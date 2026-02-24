import type { PlacedBuilding } from '../types';
import { BUILDINGS } from '../data/buildings';
import { RECIPES } from '../data/recipes/index';
import { calcOverclockedPower } from './overclock';

/**
 * Get the base power for a building, accounting for MK level and recipe-dependent power.
 */
function getBasePower(building: PlacedBuilding): number {
  const def = BUILDINGS[building.type];
  if (!def) return 0;

  // MK-level dependent power (e.g. miners)
  if (def.powerPerMk) {
    return def.powerPerMk[building.mkLevel] ?? def.basePower;
  }

  // Recipe-dependent variable power (PA, Converter, QE)
  if (building.recipeId) {
    const recipe = RECIPES[building.recipeId];
    if (recipe && recipe.maxPower != null && recipe.minPower != null) {
      // Use average power for planning purposes
      return (recipe.minPower + recipe.maxPower) / 2;
    }
  }

  return def.basePower;
}

/**
 * Calculate power for a single building.
 * Returns positive for consumers, negative for producers.
 */
export function calcBuildingPower(building: PlacedBuilding): number {
  const def = BUILDINGS[building.type];
  if (!def || def.isLogistics) return 0;

  const basePower = getBasePower(building);

  if (def.powerType === 'producer') {
    // Generators produce power (returned as negative for net calculation)
    return -basePower;
  }

  return calcOverclockedPower(basePower, building.overclock);
}

/**
 * Calculate total power consumption for all buildings (positive = net consumption).
 */
export function calcTotalPower(buildings: PlacedBuilding[]): number {
  return buildings.reduce((sum, b) => sum + calcBuildingPower(b), 0);
}

/**
 * Calculate power consumed by all consumer buildings.
 */
export function calcPowerConsumed(buildings: PlacedBuilding[]): number {
  return buildings.reduce((sum, b) => {
    const p = calcBuildingPower(b);
    return p > 0 ? sum + p : sum;
  }, 0);
}

/**
 * Calculate power produced by all generator buildings.
 */
export function calcPowerProduced(buildings: PlacedBuilding[]): number {
  return buildings.reduce((sum, b) => {
    const p = calcBuildingPower(b);
    return p < 0 ? sum + Math.abs(p) : sum;
  }, 0);
}
