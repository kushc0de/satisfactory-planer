import type { Connection, PlacedBuilding, BeltMk, PipeMk } from '../types';
import { BELTS } from '../data/belts';
import { PIPES } from '../data/pipes';
import { calcBuildingProduction } from './production';

export interface BottleneckInfo {
  connectionId: string;
  capacity: number;
  requiredRate: number;
  isBottleneck: boolean;
  connectionKind: 'belt' | 'pipe';
}

/**
 * Get the capacity for a connection based on its kind.
 */
function getConnectionCapacity(connection: Connection): number {
  if (connection.connectionKind === 'pipe') {
    return PIPES[connection.pipeMk].throughput;
  }
  return BELTS[connection.beltMk].throughput;
}

/**
 * Check if a connection is a bottleneck.
 */
export function checkBottleneck(
  connection: Connection,
  buildings: PlacedBuilding[],
): BottleneckInfo {
  const capacity = getConnectionCapacity(connection);
  const fromBuilding = buildings.find((b) => b.id === connection.fromBuildingId);

  let requiredRate = 0;
  if (fromBuilding) {
    const prod = calcBuildingProduction(fromBuilding);
    const outputPort = connection.fromPortIndex;
    if (prod.outputs[outputPort]) {
      requiredRate = prod.outputs[outputPort].rate;
    } else if (prod.outputs.length > 0) {
      requiredRate = prod.outputs[0].rate;
    }
  }

  return {
    connectionId: connection.id,
    capacity,
    requiredRate,
    isBottleneck: requiredRate > capacity,
    connectionKind: connection.connectionKind,
  };
}

/**
 * Find all bottlenecks in the factory.
 */
export function findAllBottlenecks(
  connections: Connection[],
  buildings: PlacedBuilding[],
): BottleneckInfo[] {
  return connections
    .map((c) => checkBottleneck(c, buildings))
    .filter((b) => b.isBottleneck);
}

/**
 * Calculate effective throughput (limited by belt/pipe).
 */
export function effectiveThroughput(rate: number, beltMk: BeltMk): number {
  const cap = BELTS[beltMk].throughput;
  return Math.min(rate, cap);
}

/**
 * Calculate effective pipe throughput.
 */
export function effectivePipeThroughput(rate: number, pipeMk: PipeMk): number {
  const cap = PIPES[pipeMk].throughput;
  return Math.min(rate, cap);
}
