import type { Connection, PlacedBuilding, BeltMk } from '../types';
import { BELTS } from '../data/belts';
import { calcBuildingProduction } from './production';

export interface BottleneckInfo {
  connectionId: string;
  beltCapacity: number;
  requiredRate: number;
  isBottleneck: boolean;
}

/**
 * Check if a belt connection is a bottleneck.
 */
export function checkBottleneck(
  connection: Connection,
  buildings: PlacedBuilding[],
): BottleneckInfo {
  const beltCapacity = BELTS[connection.beltMk].throughput;
  const fromBuilding = buildings.find((b) => b.id === connection.fromBuildingId);

  let requiredRate = 0;
  if (fromBuilding) {
    const prod = calcBuildingProduction(fromBuilding);
    const outputPort = connection.fromPortIndex;
    if (prod.outputs[outputPort]) {
      requiredRate = prod.outputs[outputPort].rate;
    } else if (prod.outputs.length > 0) {
      // For single-output buildings, use the first output
      requiredRate = prod.outputs[0].rate;
    }
  }

  return {
    connectionId: connection.id,
    beltCapacity,
    requiredRate,
    isBottleneck: requiredRate > beltCapacity,
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
 * Calculate effective throughput (limited by belt).
 */
export function effectiveThroughput(rate: number, beltMk: BeltMk): number {
  const cap = BELTS[beltMk].throughput;
  return Math.min(rate, cap);
}
