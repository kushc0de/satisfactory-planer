import type { PlacedBuilding } from '../types';
import { BUILDINGS } from '../data/buildings';
import { calcOverclockedPower } from './overclock';

/**
 * Calculate power consumption for a single building.
 */
export function calcBuildingPower(building: PlacedBuilding): number {
  const def = BUILDINGS[building.type];
  if (!def || def.isLogistics) return 0;
  return calcOverclockedPower(def.basePower, building.overclock);
}

/**
 * Calculate total power consumption for all buildings.
 */
export function calcTotalPower(buildings: PlacedBuilding[]): number {
  return buildings.reduce((sum, b) => sum + calcBuildingPower(b), 0);
}
