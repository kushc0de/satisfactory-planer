import type {
  SolverResult,
  PlacementInstruction,
  ConnectionInstruction,
  BeltMk,
  PipeMk,
} from '../types';
import { ITEMS } from '../data/items';
import { BUILDINGS } from '../data/buildings';
import { BELTS } from '../data/belts';
import { PIPES } from '../data/pipes';

/**
 * Select the smallest belt MK level that handles the given throughput.
 */
export function selectBeltMk(rate: number): BeltMk {
  for (const mk of [1, 2, 3, 4, 5, 6] as BeltMk[]) {
    if (BELTS[mk].throughput >= rate - 0.01) return mk;
  }
  return 6;
}

/**
 * Select the smallest pipe MK level that handles the given throughput.
 */
export function selectPipeMk(rate: number): PipeMk {
  if (PIPES[1].throughput >= rate - 0.01) return 1;
  return 2;
}

interface FlowEdge {
  itemId: string;
  producerStepIndex: number;
  consumerStepIndex: number;
  rate: number;
  isFluid: boolean;
}

/**
 * Generate connection instructions between placed buildings.
 *
 * Strategy:
 * 1. Build a flow graph: for each item, which step produces it and which consumes it
 * 2. Map items to port indices on each building type
 * 3. Distribute connections round-robin when producer count != consumer count
 */
export function generateConnections(
  placements: PlacementInstruction[],
  result: SolverResult,
): ConnectionInstruction[] {
  const connections: ConnectionInstruction[] = [];

  // Build flow edges from solver steps
  const flowEdges: FlowEdge[] = [];

  // Map: stepIndex → which items it produces
  const producerMap = new Map<string, number>(); // itemId → stepIndex
  for (let si = 0; si < result.steps.length; si++) {
    const step = result.steps[si];
    for (const out of step.outputRates) {
      if (out.rate > 0.001) {
        // If multiple steps produce the same item, last one wins (shouldn't normally happen)
        producerMap.set(out.itemId, si);
      }
    }
  }

  // Find consumer steps and create flow edges
  for (let si = 0; si < result.steps.length; si++) {
    const step = result.steps[si];
    for (const inp of step.inputRates) {
      if (inp.rate <= 0.001) continue;
      const producerIdx = producerMap.get(inp.itemId);
      if (producerIdx === undefined) continue; // raw resource not found

      const item = ITEMS[inp.itemId];
      flowEdges.push({
        itemId: inp.itemId,
        producerStepIndex: producerIdx,
        consumerStepIndex: si,
        rate: inp.rate,
        isFluid: item?.isFluid ?? false,
      });
    }
  }

  // For each flow edge, connect producer placements to consumer placements
  for (const edge of flowEdges) {
    // Find all placements for producer and consumer steps
    const producers = placements
      .map((p, i) => ({ placement: p, placementIndex: i }))
      .filter((p) => p.placement.stepIndex === edge.producerStepIndex);

    const consumers = placements
      .map((p, i) => ({ placement: p, placementIndex: i }))
      .filter((p) => p.placement.stepIndex === edge.consumerStepIndex);

    if (producers.length === 0 || consumers.length === 0) continue;

    // Determine output port index for the producer building
    const producerStep = result.steps[edge.producerStepIndex];
    const producerPortIndex = findOutputPortIndex(
      producerStep.buildingType,
      edge.itemId,
      producerStep,
      edge.isFluid,
    );

    // Determine input port index for the consumer building
    const consumerStep = result.steps[edge.consumerStepIndex];
    const consumerPortIndex = findInputPortIndex(
      consumerStep.buildingType,
      edge.itemId,
      consumerStep,
      edge.isFluid,
    );

    if (producerPortIndex < 0 || consumerPortIndex < 0) continue;

    // Rate per single connection
    const ratePerConnection = edge.rate / Math.max(producers.length, consumers.length);

    // Belt/pipe MK
    const beltMk = edge.isFluid ? (1 as BeltMk) : selectBeltMk(ratePerConnection);
    const pipeMk = edge.isFluid ? selectPipeMk(ratePerConnection) : (1 as PipeMk);

    // Round-robin distribution
    if (producers.length === consumers.length) {
      // 1:1 mapping
      for (let i = 0; i < producers.length; i++) {
        connections.push({
          fromPlacementIndex: producers[i].placementIndex,
          fromPortIndex: producerPortIndex,
          toPlacementIndex: consumers[i].placementIndex,
          toPortIndex: consumerPortIndex,
          beltMk,
          pipeMk,
        });
      }
    } else if (producers.length < consumers.length) {
      // Fewer producers → round-robin producers to consumers
      for (let i = 0; i < consumers.length; i++) {
        const pIdx = i % producers.length;
        connections.push({
          fromPlacementIndex: producers[pIdx].placementIndex,
          fromPortIndex: producerPortIndex,
          toPlacementIndex: consumers[i].placementIndex,
          toPortIndex: consumerPortIndex,
          beltMk,
          pipeMk,
        });
      }
    } else {
      // Fewer consumers → round-robin consumers to producers
      for (let i = 0; i < producers.length; i++) {
        const cIdx = i % consumers.length;
        connections.push({
          fromPlacementIndex: producers[i].placementIndex,
          fromPortIndex: producerPortIndex,
          toPlacementIndex: consumers[cIdx].placementIndex,
          toPortIndex: consumerPortIndex,
          beltMk,
          pipeMk,
        });
      }
    }
  }

  return connections;
}

/**
 * Find the output port index (among output ports only) for a given item on a building type.
 * Port index is relative to output ports (0-based), matching the store's convention.
 */
function findOutputPortIndex(
  buildingType: string,
  itemId: string,
  step: { outputRates: { itemId: string }[]; isExtractor?: boolean },
  isFluid: boolean,
): number {
  const def = BUILDINGS[buildingType as keyof typeof BUILDINGS];
  if (!def) return 0;

  const outputPorts = def.ports.filter((p) => p.type === 'output');
  if (outputPorts.length === 0) return -1;
  if (outputPorts.length === 1) return 0;

  // For extractor buildings, always use the first (only) output port
  if (step.isExtractor) return 0;

  // Match by category: find the n-th port of matching category
  const category = isFluid ? 'pipe' : 'conveyor';

  // Determine which "slot" this item occupies among outputs of the same category
  const sameTypeOutputs = step.outputRates.filter((o) => {
    const it = ITEMS[o.itemId];
    return (it?.isFluid ?? false) === isFluid;
  });

  const slotIndex = sameTypeOutputs.findIndex((o) => o.itemId === itemId);

  // Find the n-th output port of the matching category
  let matchCount = 0;
  for (let i = 0; i < outputPorts.length; i++) {
    if (outputPorts[i].category === category) {
      if (matchCount === slotIndex) return i;
      matchCount++;
    }
  }

  // Fallback: first port of matching category, or first port
  const fallback = outputPorts.findIndex((p) => p.category === category);
  return fallback >= 0 ? fallback : 0;
}

/**
 * Find the input port index (among input ports only) for a given item on a building type.
 */
function findInputPortIndex(
  buildingType: string,
  itemId: string,
  step: { inputRates: { itemId: string }[]; isExtractor?: boolean },
  isFluid: boolean,
): number {
  const def = BUILDINGS[buildingType as keyof typeof BUILDINGS];
  if (!def) return 0;

  const inputPorts = def.ports.filter((p) => p.type === 'input');
  if (inputPorts.length === 0) return -1;
  if (inputPorts.length === 1) return 0;

  const category = isFluid ? 'pipe' : 'conveyor';

  // Determine which "slot" this item occupies among inputs of the same category
  const sameTypeInputs = step.inputRates.filter((inp) => {
    const it = ITEMS[inp.itemId];
    return (it?.isFluid ?? false) === isFluid;
  });

  const slotIndex = sameTypeInputs.findIndex((inp) => inp.itemId === itemId);

  // Find the n-th input port of the matching category
  let matchCount = 0;
  for (let i = 0; i < inputPorts.length; i++) {
    if (inputPorts[i].category === category) {
      if (matchCount === slotIndex) return i;
      matchCount++;
    }
  }

  const fallback = inputPorts.findIndex((p) => p.category === category);
  return fallback >= 0 ? fallback : 0;
}
