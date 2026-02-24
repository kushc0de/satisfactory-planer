import type { PlacedBuilding, ProductionRate } from '../types';
import { MINER_BASE_RATES, PURITY_MULTIPLIERS } from '../data/purity';
import { RECIPES } from '../data/recipes';
import { calcClockMultiplier } from './overclock';

/**
 * Calculate miner output rate in items/min.
 */
export function calcMinerOutput(
  mkLevel: number,
  purity: 'impure' | 'normal' | 'pure',
  clockPercent: number,
): number {
  const baseRate = MINER_BASE_RATES[mkLevel] ?? 60;
  const purityMul = PURITY_MULTIPLIERS[purity];
  const clockMul = calcClockMultiplier(clockPercent);
  return baseRate * purityMul * clockMul;
}

/**
 * Calculate production inputs/outputs for a recipe-based building (items/min).
 */
export function calcRecipeProduction(
  recipeId: string,
  clockPercent: number,
): { inputs: ProductionRate[]; outputs: ProductionRate[] } | null {
  const recipe = RECIPES[recipeId];
  if (!recipe) return null;

  const clockMul = calcClockMultiplier(clockPercent);
  const cyclesPerMin = 60 / recipe.cycleTime;

  const inputs: ProductionRate[] = recipe.inputs.map((inp) => ({
    itemId: inp.itemId,
    rate: inp.amount * cyclesPerMin * clockMul,
  }));

  const outputs: ProductionRate[] = recipe.outputs.map((out) => ({
    itemId: out.itemId,
    rate: out.amount * cyclesPerMin * clockMul,
  }));

  return { inputs, outputs };
}

/**
 * Calculate full production info for a building.
 */
export function calcBuildingProduction(
  building: PlacedBuilding,
): { inputs: ProductionRate[]; outputs: ProductionRate[] } {
  if (building.type === 'miner') {
    const rate = calcMinerOutput(building.mkLevel, building.purity, building.overclock);
    const itemId = building.oreType ?? 'iron_ore';
    return {
      inputs: [],
      outputs: [{ itemId, rate }],
    };
  }

  if (building.type === 'splitter' || building.type === 'merger') {
    return { inputs: [], outputs: [] };
  }

  if (building.recipeId) {
    const result = calcRecipeProduction(building.recipeId, building.overclock);
    if (result) return result;
  }

  return { inputs: [], outputs: [] };
}
