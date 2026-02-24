import type { SolverResult, SolverStep, ProductionRate } from '../types';
import { RECIPES } from '../data/recipes/index';
import { BUILDINGS } from '../data/buildings';
import { ITEMS } from '../data/items';
import { calcOverclockedPower } from './overclock';

/** Raw resources that don't need recipes to produce */
const RAW_RESOURCES = new Set([
  'iron_ore', 'copper_ore', 'limestone', 'coal', 'caterium_ore',
  'bauxite', 'raw_quartz', 'sulfur', 'uranium', 'water',
  'crude_oil', 'nitrogen_gas', 'sam',
  // Organic/drops (not craftable through normal recipes)
  'leaves', 'wood', 'mycelia', 'alien_protein',
  'hog_remains', 'hatcher_remains', 'spitter_remains', 'stinger_remains',
  'blue_power_slug', 'yellow_power_slug', 'purple_power_slug',
]);

export function isRawResource(itemId: string): boolean {
  return RAW_RESOURCES.has(itemId);
}

/**
 * Find the default (standard) recipe that produces an item.
 */
export function findRecipeForItem(
  itemId: string,
  overrides?: Map<string, string>,
): string | null {
  // Check overrides first
  if (overrides?.has(itemId)) {
    return overrides.get(itemId)!;
  }

  // Find first standard recipe that outputs this item
  for (const recipe of Object.values(RECIPES)) {
    if (recipe.isAlternate) continue;
    if (recipe.outputs.some((o) => o.itemId === itemId)) {
      return recipe.id;
    }
  }

  // Fall back to alternate if no standard found
  for (const recipe of Object.values(RECIPES)) {
    if (recipe.outputs.some((o) => o.itemId === itemId)) {
      return recipe.id;
    }
  }

  return null;
}

export type OverclockStrategy = 'full' | 'exact';

export interface SolverOptions {
  targetItem: string;
  targetRate: number;
  overrides?: Map<string, string>;
  given?: Map<string, number>;
  strategy?: OverclockStrategy;
}

/**
 * Solve a production chain backwards from a target item and rate.
 */
export function solve(options: SolverOptions): SolverResult {
  const { targetItem, targetRate, overrides, given, strategy = 'full' } = options;

  const demands = new Map<string, number>();
  demands.set(targetItem, targetRate);

  const steps: SolverStep[] = [];
  const rawResources = new Map<string, number>();
  const excess = new Map<string, number>();
  const processed = new Set<string>();

  // Prevent infinite loops
  let maxIterations = 200;

  while (demands.size > 0 && maxIterations-- > 0) {
    // Find an item to resolve (pick one that's not being processed)
    let itemToProcess: string | null = null;
    for (const [itemId] of demands) {
      if (!processed.has(itemId)) {
        itemToProcess = itemId;
        break;
      }
    }

    if (!itemToProcess) break;

    const demandRate = demands.get(itemToProcess)!;
    if (demandRate <= 0.001) {
      demands.delete(itemToProcess);
      continue;
    }

    // Raw resource?
    if (isRawResource(itemToProcess)) {
      rawResources.set(itemToProcess, (rawResources.get(itemToProcess) ?? 0) + demandRate);
      demands.delete(itemToProcess);
      continue;
    }

    // Check "given" resources
    if (given?.has(itemToProcess)) {
      const available = given.get(itemToProcess)!;
      const used = Math.min(demandRate, available);
      given.set(itemToProcess, available - used);
      const remaining = demandRate - used;
      if (remaining <= 0.001) {
        demands.delete(itemToProcess);
        continue;
      }
      demands.set(itemToProcess, remaining);
    }

    // Find recipe
    const recipeId = findRecipeForItem(itemToProcess, overrides);
    if (!recipeId) {
      // No recipe found - treat as raw resource
      rawResources.set(itemToProcess, (rawResources.get(itemToProcess) ?? 0) + demandRate);
      demands.delete(itemToProcess);
      continue;
    }

    const recipe = RECIPES[recipeId];
    if (!recipe) {
      demands.delete(itemToProcess);
      continue;
    }

    // Calculate building count
    const targetOutput = recipe.outputs.find((o) => o.itemId === itemToProcess);
    if (!targetOutput) {
      demands.delete(itemToProcess);
      continue;
    }

    const outputPerMinPerBuilding = targetOutput.amount * (60 / recipe.cycleTime);
    const buildingCount = demandRate / outputPerMinPerBuilding;
    const buildingCountCeil = Math.ceil(buildingCount);

    // Overclock strategy
    let clockPercent: number;
    if (strategy === 'exact' && buildingCountCeil > 0) {
      clockPercent = (buildingCount / buildingCountCeil) * 100;
    } else {
      clockPercent = 100;
    }

    // Actual production rate per building
    const actualBuildingOutput = outputPerMinPerBuilding * (clockPercent / 100);
    const actualTotalOutput = actualBuildingOutput * buildingCountCeil;

    // Calculate input demands
    for (const input of recipe.inputs) {
      const inputRatePerBuilding = input.amount * (60 / recipe.cycleTime) * (clockPercent / 100);
      const totalInputRate = inputRatePerBuilding * buildingCountCeil;
      demands.set(input.itemId, (demands.get(input.itemId) ?? 0) + totalInputRate);
    }

    // Handle byproducts
    for (const output of recipe.outputs) {
      if (output.itemId === itemToProcess) continue;
      const byproductRate = output.amount * (60 / recipe.cycleTime) * (clockPercent / 100) * buildingCountCeil;

      const existingDemand = demands.get(output.itemId) ?? 0;
      if (existingDemand > 0) {
        const reduced = existingDemand - byproductRate;
        if (reduced <= 0) {
          demands.delete(output.itemId);
          if (reduced < -0.001) {
            excess.set(output.itemId, (excess.get(output.itemId) ?? 0) + Math.abs(reduced));
          }
        } else {
          demands.set(output.itemId, reduced);
        }
      } else {
        excess.set(output.itemId, (excess.get(output.itemId) ?? 0) + byproductRate);
      }
    }

    // Power calculation
    const buildingDef = BUILDINGS[recipe.buildingType];
    let basePower = buildingDef?.basePower ?? 0;

    // Variable power buildings
    if (recipe.minPower != null && recipe.maxPower != null) {
      basePower = (recipe.minPower + recipe.maxPower) / 2;
    }

    // MK-dependent power (use MK1 for solver since we don't know MK level)
    if (buildingDef?.powerPerMk) {
      basePower = buildingDef.powerPerMk[1] ?? basePower;
    }

    const powerPerBuilding = calcOverclockedPower(basePower, clockPercent);
    const totalPower = powerPerBuilding * buildingCountCeil;

    // Input rates for display
    const inputRates: ProductionRate[] = recipe.inputs.map((inp) => ({
      itemId: inp.itemId,
      rate: inp.amount * (60 / recipe.cycleTime) * (clockPercent / 100) * buildingCountCeil,
    }));

    // Output rates for display
    const outputRates: ProductionRate[] = recipe.outputs.map((out) => ({
      itemId: out.itemId,
      rate: out.amount * (60 / recipe.cycleTime) * (clockPercent / 100) * buildingCountCeil,
    }));

    steps.push({
      itemId: itemToProcess,
      recipeId,
      buildingType: recipe.buildingType,
      buildingCount,
      buildingCountCeil,
      clockPercent,
      inputRates,
      outputRates,
      powerPerBuilding,
      totalPower,
    });

    demands.delete(itemToProcess);
    processed.add(itemToProcess);
  }

  // Totals (extractors are now generated separately in SolverPanel from ResourceConfig)
  const totalPower = steps.reduce((sum, s) => sum + s.totalPower, 0);
  const totalBuildings = steps.reduce((sum, s) => sum + s.buildingCountCeil, 0);

  return {
    steps,
    rawResources: Array.from(rawResources.entries()).map(([itemId, rate]) => ({ itemId, rate })),
    totalPower,
    totalBuildings,
    excess: Array.from(excess.entries()).map(([itemId, rate]) => ({ itemId, rate })),
  };
}
