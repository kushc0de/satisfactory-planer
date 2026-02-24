import type { PlacedBuilding, ProductionRate, Connection } from '../types';
import { MINER_BASE_RATES, PURITY_MULTIPLIERS } from '../data/purity';
import { RECIPES } from '../data/recipes/index';
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
 * Calculate splitter output: input rate divided equally among connected outputs.
 */
export function calcSplitterOutput(
  inputRate: number,
  connectedOutputCount: number,
): number {
  if (connectedOutputCount <= 0) return 0;
  return inputRate / connectedOutputCount;
}

/**
 * Calculate merger output: sum of all input rates.
 */
export function calcMergerOutput(inputRates: number[]): number {
  return inputRates.reduce((sum, rate) => sum + rate, 0);
}

/**
 * Calculate full production info for a building.
 */
export function calcBuildingProduction(
  building: PlacedBuilding,
): { inputs: ProductionRate[]; outputs: ProductionRate[] } {
  // Miner
  if (building.type === 'miner') {
    const rate = calcMinerOutput(building.mkLevel, building.purity, building.overclock);
    const itemId = building.oreType ?? 'iron_ore';
    return { inputs: [], outputs: [{ itemId, rate }] };
  }

  // Water Extractor: produces 120 m³/min water at 100%
  if (building.type === 'water_extractor') {
    const clockMul = calcClockMultiplier(building.overclock);
    return { inputs: [], outputs: [{ itemId: 'water', rate: 120 * clockMul }] };
  }

  // Oil Extractor: produces based on purity (120/240/480 at MK levels, similar to miner)
  if (building.type === 'oil_extractor') {
    const rate = calcMinerOutput(1, building.purity, building.overclock);
    // Oil extractor base rate is 120 m³/min at normal purity
    const baseRate = 120;
    const purityMul = PURITY_MULTIPLIERS[building.purity];
    const clockMul = calcClockMultiplier(building.overclock);
    return { inputs: [], outputs: [{ itemId: 'crude_oil', rate: baseRate * purityMul * clockMul }] };
  }

  // Splitter/Merger pass-through (basic; full flow graph would need connection context)
  if (building.type === 'splitter' || building.type === 'merger') {
    return { inputs: [], outputs: [] };
  }

  // Logistics buildings with no production
  if (building.type === 'storage_container' || building.type === 'fluid_buffer' ||
      building.type === 'pipeline_junction' || building.type === 'awesome_sink') {
    return { inputs: [], outputs: [] };
  }

  // Generator buildings (show fuel consumption as inputs)
  if (building.type === 'coal_generator' || building.type === 'fuel_generator' ||
      building.type === 'nuclear_power_plant' || building.type === 'biomass_burner' ||
      building.type === 'geothermal_generator') {
    if (building.recipeId) {
      const result = calcRecipeProduction(building.recipeId, building.overclock);
      if (result) return result;
    }
    return { inputs: [], outputs: [] };
  }

  // Recipe-based buildings
  if (building.recipeId) {
    const result = calcRecipeProduction(building.recipeId, building.overclock);
    if (result) return result;
  }

  return { inputs: [], outputs: [] };
}
