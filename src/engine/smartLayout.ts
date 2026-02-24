import type {
  SolverResult,
  SolverStep,
  PlacementInstruction,
  ConnectionInstruction,
  BeltMk,
  PipeMk,
  MkLevel,
  Purity,
  BuildingType,
} from '../types';
import { ITEMS } from '../data/items';
import { BUILDINGS } from '../data/buildings';
import { selectBeltMk, selectPipeMk, findOutputPortIndex, findInputPortIndex } from './autoConnect';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlowEdge {
  itemId: string;
  producerStepIndex: number;
  consumerStepIndex: number;
  rate: number;
  isFluid: boolean;
}

interface StepPlacement {
  stepIndex: number;
  column: number;
  row: number;
}

interface SmartLayoutResult {
  placements: PlacementInstruction[];
  connections: ConnectionInstruction[];
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function generateSmartLayout(
  result: SolverResult,
  options?: { startX?: number; startY?: number },
): SmartLayoutResult {
  const startX = options?.startX ?? 0;
  const startY = options?.startY ?? 0;

  if (result.steps.length === 0) {
    return { placements: [], connections: [] };
  }

  // Phase 1: Build flow graph
  const flowEdges = buildFlowGraph(result);

  // Phase 2: Assign columns (extractors left, target right)
  const columnMap = assignColumns(result, flowEdges);

  // Phase 3: Assign rows (right-to-left, centering on consumers)
  const rowMap = assignRows(result, flowEdges, columnMap);

  // Phase 4+5: Place buildings & build splitter/merger trees with connections
  return buildLayout(result, flowEdges, columnMap, rowMap, startX, startY);
}

// ---------------------------------------------------------------------------
// Phase 1: Build flow graph
// ---------------------------------------------------------------------------

function buildFlowGraph(result: SolverResult): FlowEdge[] {
  const edges: FlowEdge[] = [];

  // Map: itemId → stepIndex that produces it
  const producerMap = new Map<string, number>();
  for (let si = 0; si < result.steps.length; si++) {
    const step = result.steps[si];
    for (const out of step.outputRates) {
      if (out.rate > 0.001) {
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
      if (producerIdx === undefined) continue;

      const item = ITEMS[inp.itemId];
      edges.push({
        itemId: inp.itemId,
        producerStepIndex: producerIdx,
        consumerStepIndex: si,
        rate: inp.rate,
        isFluid: item?.isFluid ?? false,
      });
    }
  }

  return edges;
}

// ---------------------------------------------------------------------------
// Phase 2: Column assignment
// ---------------------------------------------------------------------------

function assignColumns(
  result: SolverResult,
  flowEdges: FlowEdge[],
): Map<number, number> {
  const steps = result.steps;
  const columnMap = new Map<number, number>();

  // Build adjacency: producer → consumers
  const consumers = new Map<number, Set<number>>();
  const producers = new Map<number, Set<number>>();
  for (const edge of flowEdges) {
    if (!consumers.has(edge.producerStepIndex)) consumers.set(edge.producerStepIndex, new Set());
    consumers.get(edge.producerStepIndex)!.add(edge.consumerStepIndex);
    if (!producers.has(edge.consumerStepIndex)) producers.set(edge.consumerStepIndex, new Set());
    producers.get(edge.consumerStepIndex)!.add(edge.producerStepIndex);
  }

  // Find leaf steps (no consumers = final products, or extractors with no inputs)
  // Use topological distance from right (target) to left (extractors)
  // The target item step (first in result.steps) should be rightmost

  // BFS from target step (index 0) going backwards through producers
  const visited = new Set<number>();
  const queue: { stepIndex: number; depth: number }[] = [];

  // Start from the target step (index 0)
  queue.push({ stepIndex: 0, depth: 0 });
  visited.add(0);

  while (queue.length > 0) {
    const { stepIndex, depth } = queue.shift()!;
    // Assign column: higher depth = further left (lower column number)
    const existing = columnMap.get(stepIndex);
    if (existing === undefined || depth > existing) {
      columnMap.set(stepIndex, depth);
    }

    const prods = producers.get(stepIndex);
    if (prods) {
      for (const prodIdx of prods) {
        if (!visited.has(prodIdx)) {
          visited.add(prodIdx);
          queue.push({ stepIndex: prodIdx, depth: depth + 1 });
        }
      }
    }
  }

  // Assign unvisited steps (disconnected) to their own columns
  for (let si = 0; si < steps.length; si++) {
    if (!columnMap.has(si)) {
      const maxCol = Math.max(0, ...Array.from(columnMap.values()));
      columnMap.set(si, maxCol + 1);
    }
  }

  // Invert: column 0 should be leftmost (extractors), max column should be rightmost (target)
  const maxCol = Math.max(0, ...Array.from(columnMap.values()));
  for (const [si, col] of columnMap) {
    columnMap.set(si, maxCol - col);
  }

  return columnMap;
}

// ---------------------------------------------------------------------------
// Phase 3: Row assignment (right-to-left, centering on consumers)
// ---------------------------------------------------------------------------

function assignRows(
  result: SolverResult,
  flowEdges: FlowEdge[],
  columnMap: Map<number, number>,
): Map<number, number> {
  const rowMap = new Map<number, number>();

  // Group steps by column, process right-to-left
  const maxCol = Math.max(0, ...Array.from(columnMap.values()));
  const stepsByColumn: number[][] = [];
  for (let c = 0; c <= maxCol; c++) stepsByColumn.push([]);
  for (const [si, col] of columnMap) {
    stepsByColumn[col].push(si);
  }

  // Build consumer lookup: stepIndex → which steps consume its output
  const consumerMap = new Map<number, number[]>();
  for (const edge of flowEdges) {
    if (!consumerMap.has(edge.producerStepIndex)) consumerMap.set(edge.producerStepIndex, []);
    consumerMap.get(edge.producerStepIndex)!.push(edge.consumerStepIndex);
  }

  // Place rightmost column first (target) at row 0
  const rightSteps = stepsByColumn[maxCol];
  let nextRow = 0;
  for (const si of rightSteps) {
    rowMap.set(si, nextRow);
    const step = result.steps[si];
    const def = BUILDINGS[step.buildingType];
    const height = (def?.gridHeight ?? 1) * step.buildingCountCeil + (step.buildingCountCeil - 1);
    nextRow += height + 2;
  }

  // Process columns right-to-left
  for (let col = maxCol - 1; col >= 0; col--) {
    const stepsInCol = stepsByColumn[col];
    if (stepsInCol.length === 0) continue;

    // For each step, compute target row = center of its consumers
    const targetRows: { stepIndex: number; targetRow: number }[] = [];
    for (const si of stepsInCol) {
      const consumerSteps = consumerMap.get(si) ?? [];
      if (consumerSteps.length === 0) {
        targetRows.push({ stepIndex: si, targetRow: 0 });
        continue;
      }

      // Compute center of consumer buildings
      let totalY = 0;
      let count = 0;
      for (const csi of consumerSteps) {
        const cRow = rowMap.get(csi);
        if (cRow !== undefined) {
          const cStep = result.steps[csi];
          const cDef = BUILDINGS[cStep.buildingType];
          const cHeight = (cDef?.gridHeight ?? 1) * cStep.buildingCountCeil + (cStep.buildingCountCeil - 1);
          totalY += cRow + cHeight / 2;
          count++;
        }
      }

      const centerY = count > 0 ? totalY / count : 0;
      const step = result.steps[si];
      const def = BUILDINGS[step.buildingType];
      const height = (def?.gridHeight ?? 1) * step.buildingCountCeil + (step.buildingCountCeil - 1);
      targetRows.push({ stepIndex: si, targetRow: centerY - height / 2 });
    }

    // Sort by targetRow
    targetRows.sort((a, b) => a.targetRow - b.targetRow);

    // Place, resolving overlaps
    let currentY = targetRows[0].targetRow;
    for (const { stepIndex, targetRow } of targetRows) {
      const actualY = Math.max(targetRow, currentY);
      rowMap.set(stepIndex, actualY);
      const step = result.steps[stepIndex];
      const def = BUILDINGS[step.buildingType];
      const height = (def?.gridHeight ?? 1) * step.buildingCountCeil + (step.buildingCountCeil - 1);
      currentY = actualY + height + 2;
    }
  }

  return rowMap;
}

// ---------------------------------------------------------------------------
// Phase 4+5: Build layout with splitter/merger trees
// ---------------------------------------------------------------------------

function buildLayout(
  result: SolverResult,
  flowEdges: FlowEdge[],
  columnMap: Map<number, number>,
  rowMap: Map<number, number>,
  startX: number,
  startY: number,
): SmartLayoutResult {
  const placements: PlacementInstruction[] = [];
  const connections: ConnectionInstruction[] = [];

  // Compute X position for each column
  const maxCol = Math.max(0, ...Array.from(columnMap.values()));

  // Compute column widths (max building width in each column)
  const colWidths: number[] = new Array(maxCol + 1).fill(2);
  for (const [si, col] of columnMap) {
    const step = result.steps[si];
    const def = BUILDINGS[step.buildingType];
    colWidths[col] = Math.max(colWidths[col], def?.gridWidth ?? 2);
  }

  // Compute column gap: base gap + extra for splitter/merger trees
  const baseGap = 3;
  const splitterGap = computeSplitterGap(result, flowEdges);
  const columnGap = baseGap + splitterGap;

  // Column X positions
  const colX: number[] = [];
  let cx = startX;
  for (let c = 0; c <= maxCol; c++) {
    colX.push(cx);
    cx += colWidths[c] + columnGap;
  }

  // Place all production buildings
  // Track: stepIndex → list of placement indices
  const stepPlacements = new Map<number, number[]>();

  for (let col = 0; col <= maxCol; col++) {
    // Find steps in this column
    const stepsInCol: number[] = [];
    for (const [si, c] of columnMap) {
      if (c === col) stepsInCol.push(si);
    }

    for (const si of stepsInCol) {
      const step = result.steps[si];
      const row = rowMap.get(si) ?? 0;
      const def = BUILDINGS[step.buildingType];
      const buildingHeight = def?.gridHeight ?? 1;

      const indices: number[] = [];
      for (let inst = 0; inst < step.buildingCountCeil; inst++) {
        const placementIndex = placements.length;
        indices.push(placementIndex);
        placements.push({
          buildingType: step.buildingType,
          gridX: colX[col],
          gridY: Math.round(startY + row + inst * (buildingHeight + 1)),
          recipeId: step.isExtractor ? null : step.recipeId,
          overclock: step.clockPercent,
          mkLevel: (step.minerMkLevel ?? 1) as MkLevel,
          oreType: step.oreType ?? null,
          purity: (step.purity ?? 'normal') as Purity,
          stepIndex: si,
          instanceIndex: inst,
        });
      }
      stepPlacements.set(si, indices);
    }
  }

  // Phase 4+5: For each flow edge, insert splitter/merger trees and connect
  for (const edge of flowEdges) {
    const producerIndices = stepPlacements.get(edge.producerStepIndex) ?? [];
    const consumerIndices = stepPlacements.get(edge.consumerStepIndex) ?? [];
    if (producerIndices.length === 0 || consumerIndices.length === 0) continue;

    const producerStep = result.steps[edge.producerStepIndex];
    const consumerStep = result.steps[edge.consumerStepIndex];

    const producerPortIndex = findOutputPortIndex(
      producerStep.buildingType,
      edge.itemId,
      producerStep,
      edge.isFluid,
    );
    const consumerPortIndex = findInputPortIndex(
      consumerStep.buildingType,
      edge.itemId,
      consumerStep,
      edge.isFluid,
    );

    if (producerPortIndex < 0 || consumerPortIndex < 0) continue;

    const P = producerIndices.length;
    const C = consumerIndices.length;
    const ratePerConnection = edge.rate / Math.max(P, C);
    const beltMk = edge.isFluid ? (1 as BeltMk) : selectBeltMk(ratePerConnection);
    const pipeMk = edge.isFluid ? selectPipeMk(ratePerConnection) : (1 as PipeMk);

    // Sort producers and consumers by Y position for crossing-free connections
    const sortedProducers = [...producerIndices].sort(
      (a, b) => placements[a].gridY - placements[b].gridY,
    );
    const sortedConsumers = [...consumerIndices].sort(
      (a, b) => placements[a].gridY - placements[b].gridY,
    );

    if (P === C) {
      // 1:1 — direct connections, Y-sorted
      for (let i = 0; i < P; i++) {
        connections.push({
          fromPlacementIndex: sortedProducers[i],
          fromPortIndex: producerPortIndex,
          toPlacementIndex: sortedConsumers[i],
          toPortIndex: consumerPortIndex,
          beltMk,
          pipeMk,
        });
      }
    } else if (P === 1 && C <= 3 && !edge.isFluid) {
      // 1 producer, 2-3 consumers → single splitter
      const splitterIdx = placeSplitter(
        placements,
        sortedProducers[0],
        sortedConsumers,
        columnMap,
        colX,
        startY,
        rowMap,
        result,
        edge,
      );
      // Connect producer → splitter
      connections.push({
        fromPlacementIndex: sortedProducers[0],
        fromPortIndex: producerPortIndex,
        toPlacementIndex: splitterIdx,
        toPortIndex: 0, // splitter input = port 0 (left)
        beltMk,
        pipeMk,
      });
      // Connect splitter outputs → consumers
      connectSplitterToConsumers(connections, splitterIdx, sortedConsumers, consumerPortIndex, beltMk, pipeMk, C);
    } else if (P > 1 && C === 1 && !edge.isFluid) {
      // Multiple producers, 1 consumer → merger tree
      const mergerLeaves = buildMergerTree(
        placements,
        sortedProducers,
        sortedConsumers[0],
        columnMap,
        colX,
        startY,
        rowMap,
        result,
        edge,
        connections,
        producerPortIndex,
        beltMk,
        pipeMk,
      );
      // Connect final merger → consumer
      connections.push({
        fromPlacementIndex: mergerLeaves,
        fromPortIndex: 0, // merger output = port 0 (right, only output)
        toPlacementIndex: sortedConsumers[0],
        toPortIndex: consumerPortIndex,
        beltMk,
        pipeMk,
      });
    } else if (P < C && !edge.isFluid) {
      // Fewer producers than consumers → each producer gets splitter tree
      const groups = divideIntoGroups(sortedConsumers, P);
      for (let p = 0; p < P; p++) {
        const group = groups[p];
        if (group.length === 1) {
          // Direct
          connections.push({
            fromPlacementIndex: sortedProducers[p],
            fromPortIndex: producerPortIndex,
            toPlacementIndex: group[0],
            toPortIndex: consumerPortIndex,
            beltMk,
            pipeMk,
          });
        } else if (group.length <= 3) {
          const splitterIdx = placeSplitter(
            placements,
            sortedProducers[p],
            group,
            columnMap,
            colX,
            startY,
            rowMap,
            result,
            edge,
          );
          connections.push({
            fromPlacementIndex: sortedProducers[p],
            fromPortIndex: producerPortIndex,
            toPlacementIndex: splitterIdx,
            toPortIndex: 0,
            beltMk,
            pipeMk,
          });
          connectSplitterToConsumers(connections, splitterIdx, group, consumerPortIndex, beltMk, pipeMk, group.length);
        } else {
          // Build splitter tree for this group
          buildSplitterTree(
            placements,
            connections,
            sortedProducers[p],
            producerPortIndex,
            group,
            consumerPortIndex,
            columnMap,
            colX,
            startY,
            rowMap,
            result,
            edge,
            beltMk,
            pipeMk,
          );
        }
      }
    } else if (P > C && !edge.isFluid) {
      // More producers than consumers → each consumer gets merger tree
      const groups = divideIntoGroups(sortedProducers, C);
      for (let c = 0; c < C; c++) {
        const group = groups[c];
        if (group.length === 1) {
          connections.push({
            fromPlacementIndex: group[0],
            fromPortIndex: producerPortIndex,
            toPlacementIndex: sortedConsumers[c],
            toPortIndex: consumerPortIndex,
            beltMk,
            pipeMk,
          });
        } else {
          const mergerOut = buildMergerTree(
            placements,
            group,
            sortedConsumers[c],
            columnMap,
            colX,
            startY,
            rowMap,
            result,
            edge,
            connections,
            producerPortIndex,
            beltMk,
            pipeMk,
          );
          connections.push({
            fromPlacementIndex: mergerOut,
            fromPortIndex: 0,
            toPlacementIndex: sortedConsumers[c],
            toPortIndex: consumerPortIndex,
            beltMk,
            pipeMk,
          });
        }
      }
    } else {
      // Fluid or complex case → direct round-robin connections
      if (P <= C) {
        for (let i = 0; i < C; i++) {
          connections.push({
            fromPlacementIndex: sortedProducers[i % P],
            fromPortIndex: producerPortIndex,
            toPlacementIndex: sortedConsumers[i],
            toPortIndex: consumerPortIndex,
            beltMk,
            pipeMk,
          });
        }
      } else {
        for (let i = 0; i < P; i++) {
          connections.push({
            fromPlacementIndex: sortedProducers[i],
            fromPortIndex: producerPortIndex,
            toPlacementIndex: sortedConsumers[i % C],
            toPortIndex: consumerPortIndex,
            beltMk,
            pipeMk,
          });
        }
      }
    }
  }

  return { placements, connections };
}

// ---------------------------------------------------------------------------
// Splitter/Merger helpers
// ---------------------------------------------------------------------------

function placeSplitter(
  placements: PlacementInstruction[],
  producerIdx: number,
  consumerIndices: number[],
  _columnMap: Map<number, number>,
  _colX: number[],
  _startY: number,
  _rowMap: Map<number, number>,
  _result: SolverResult,
  _edge: FlowEdge,
): number {
  // Place splitter between producer and consumers
  const producer = placements[producerIdx];
  const producerDef = BUILDINGS[producer.buildingType];
  const producerRight = producer.gridX + (producerDef?.gridWidth ?? 2);

  // Compute Y: center of consumers
  let minY = Infinity, maxY = -Infinity;
  for (const ci of consumerIndices) {
    const c = placements[ci];
    minY = Math.min(minY, c.gridY);
    const cDef = BUILDINGS[c.buildingType];
    maxY = Math.max(maxY, c.gridY + (cDef?.gridHeight ?? 1));
  }
  const centerY = Math.round((minY + maxY) / 2 - 0.5);

  const idx = placements.length;
  placements.push({
    buildingType: 'splitter',
    gridX: producerRight + 1,
    gridY: centerY,
    recipeId: null,
    overclock: 100,
    mkLevel: 1,
    oreType: null,
    purity: 'normal',
    stepIndex: -1,
    instanceIndex: 0,
  });
  return idx;
}

function connectSplitterToConsumers(
  connections: ConnectionInstruction[],
  splitterIdx: number,
  consumerIndices: number[],
  consumerPortIndex: number,
  beltMk: BeltMk,
  pipeMk: PipeMk,
  count: number,
) {
  // Splitter output ports: 0=top, 1=right, 2=bottom (indices among output ports)
  // For 2 consumers: use top(0) and bottom(2)
  // For 3 consumers: use top(0), right(1), bottom(2)
  const portMap2 = [0, 2];
  const portMap3 = [0, 1, 2];
  const ports = count === 2 ? portMap2 : portMap3;

  for (let i = 0; i < Math.min(count, 3); i++) {
    connections.push({
      fromPlacementIndex: splitterIdx,
      fromPortIndex: ports[i],
      toPlacementIndex: consumerIndices[i],
      toPortIndex: consumerPortIndex,
      beltMk,
      pipeMk,
    });
  }
}

function buildSplitterTree(
  placements: PlacementInstruction[],
  connections: ConnectionInstruction[],
  producerIdx: number,
  producerPortIndex: number,
  consumers: number[],
  consumerPortIndex: number,
  columnMap: Map<number, number>,
  colX: number[],
  startY: number,
  rowMap: Map<number, number>,
  result: SolverResult,
  edge: FlowEdge,
  beltMk: BeltMk,
  pipeMk: PipeMk,
) {
  if (consumers.length <= 3) {
    // Base case: place single splitter
    const splitterIdx = placeSplitter(
      placements, producerIdx, consumers,
      columnMap, colX, startY, rowMap, result, edge,
    );
    connections.push({
      fromPlacementIndex: producerIdx,
      fromPortIndex: producerPortIndex,
      toPlacementIndex: splitterIdx,
      toPortIndex: 0,
      beltMk,
      pipeMk,
    });
    connectSplitterToConsumers(connections, splitterIdx, consumers, consumerPortIndex, beltMk, pipeMk, consumers.length);
    return;
  }

  // Split consumers into up to 3 groups and recurse
  const groups = divideIntoGroups(consumers, Math.min(3, consumers.length));
  const groupCount = groups.length;

  // Place root splitter
  const splitterIdx = placeSplitter(
    placements, producerIdx, consumers,
    columnMap, colX, startY, rowMap, result, edge,
  );
  connections.push({
    fromPlacementIndex: producerIdx,
    fromPortIndex: producerPortIndex,
    toPlacementIndex: splitterIdx,
    toPortIndex: 0,
    beltMk,
    pipeMk,
  });

  const portMap2 = [0, 2];
  const portMap3 = [0, 1, 2];
  const ports = groupCount === 2 ? portMap2 : portMap3;

  for (let g = 0; g < groupCount; g++) {
    const group = groups[g];
    if (group.length === 1) {
      // Direct connection from splitter to consumer
      connections.push({
        fromPlacementIndex: splitterIdx,
        fromPortIndex: ports[g],
        toPlacementIndex: group[0],
        toPortIndex: consumerPortIndex,
        beltMk,
        pipeMk,
      });
    } else {
      // Recurse: splitter output → sub-tree
      buildSplitterTree(
        placements, connections,
        splitterIdx, ports[g],
        group, consumerPortIndex,
        columnMap, colX, startY, rowMap, result, edge,
        beltMk, pipeMk,
      );
    }
  }
}

function buildMergerTree(
  placements: PlacementInstruction[],
  producers: number[],
  consumerIdx: number,
  _columnMap: Map<number, number>,
  _colX: number[],
  _startY: number,
  _rowMap: Map<number, number>,
  _result: SolverResult,
  _edge: FlowEdge,
  connections: ConnectionInstruction[],
  producerPortIndex: number,
  beltMk: BeltMk,
  pipeMk: PipeMk,
): number {
  if (producers.length <= 3) {
    // Base case: single merger
    const mergerIdx = placeMerger(placements, producers, consumerIdx);
    // Merger input ports: 0=top, 1=left, 2=bottom
    const portMap2 = [0, 2];
    const portMap3 = [0, 1, 2];
    const ports = producers.length === 2 ? portMap2 : portMap3;

    for (let i = 0; i < producers.length; i++) {
      connections.push({
        fromPlacementIndex: producers[i],
        fromPortIndex: producerPortIndex,
        toPlacementIndex: mergerIdx,
        toPortIndex: ports[i],
        beltMk,
        pipeMk,
      });
    }
    return mergerIdx;
  }

  // Split producers into up to 3 groups and recurse
  const groups = divideIntoGroups(producers, Math.min(3, producers.length));
  const groupCount = groups.length;

  // Recursively build sub-mergers
  const subMergerOutputs: number[] = [];
  for (const group of groups) {
    if (group.length === 1) {
      subMergerOutputs.push(group[0]);
    } else {
      const subMergerIdx = buildMergerTree(
        placements, group, consumerIdx,
        _columnMap, _colX, _startY, _rowMap, _result, _edge,
        connections, producerPortIndex, beltMk, pipeMk,
      );
      subMergerOutputs.push(subMergerIdx);
    }
  }

  // Place final merger that combines sub-merger outputs
  const finalMergerIdx = placeMerger(placements, subMergerOutputs.map(i => i), consumerIdx);
  const portMap2 = [0, 2];
  const portMap3 = [0, 1, 2];
  const ports = subMergerOutputs.length === 2 ? portMap2 : portMap3;

  for (let i = 0; i < subMergerOutputs.length; i++) {
    const fromIdx = subMergerOutputs[i];
    // If it's a merger (stepIndex === -1), use output port 0
    // If it's a producer, use the producer port index
    const fromPort = placements[fromIdx].stepIndex === -1 ? 0 : producerPortIndex;
    connections.push({
      fromPlacementIndex: fromIdx,
      fromPortIndex: fromPort,
      toPlacementIndex: finalMergerIdx,
      toPortIndex: ports[i],
      beltMk,
      pipeMk,
    });
  }

  return finalMergerIdx;
}

function placeMerger(
  placements: PlacementInstruction[],
  producerIndices: number[],
  consumerIdx: number,
): number {
  // Place merger between producers and consumer
  const consumer = placements[consumerIdx];

  // Compute Y: center of producers
  let minY = Infinity, maxY = -Infinity;
  for (const pi of producerIndices) {
    const p = placements[pi];
    minY = Math.min(minY, p.gridY);
    const pDef = BUILDINGS[p.buildingType];
    maxY = Math.max(maxY, p.gridY + (pDef?.gridHeight ?? 1));
  }
  const centerY = Math.round((minY + maxY) / 2 - 0.5);

  const idx = placements.length;
  placements.push({
    buildingType: 'merger',
    gridX: consumer.gridX - 2,
    gridY: centerY,
    recipeId: null,
    overclock: 100,
    mkLevel: 1,
    oreType: null,
    purity: 'normal',
    stepIndex: -1,
    instanceIndex: 0,
  });
  return idx;
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function computeSplitterGap(result: SolverResult, flowEdges: FlowEdge[]): number {
  let maxRatio = 1;
  for (const edge of flowEdges) {
    const pStep = result.steps[edge.producerStepIndex];
    const cStep = result.steps[edge.consumerStepIndex];
    const ratio = Math.max(pStep.buildingCountCeil, cStep.buildingCountCeil) /
      Math.max(1, Math.min(pStep.buildingCountCeil, cStep.buildingCountCeil));
    maxRatio = Math.max(maxRatio, ratio);
  }
  // Each level of tree needs ~2 grid cells
  const treeDepth = Math.ceil(Math.log(maxRatio) / Math.log(3));
  return treeDepth * 2;
}

function divideIntoGroups<T>(items: T[], groupCount: number): T[][] {
  const gc = Math.min(groupCount, items.length);
  const groups: T[][] = [];
  const baseSize = Math.floor(items.length / gc);
  let remainder = items.length % gc;
  let idx = 0;
  for (let g = 0; g < gc; g++) {
    const size = baseSize + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
    groups.push(items.slice(idx, idx + size));
    idx += size;
  }
  return groups;
}
