import type { SolverResult, PlacementInstruction, MkLevel, Purity } from '../types';
import { BUILDINGS } from '../data/buildings';

export interface LayoutOptions {
  /** Grid gap between columns (default: 3) */
  columnGap?: number;
  /** Grid gap between rows (default: 1) */
  rowGap?: number;
  /** Starting grid X position (default: 0) */
  startX?: number;
  /** Starting grid Y position (default: 0) */
  startY?: number;
}

/**
 * Generate a left-to-right layout from solver results.
 * Extractors (end of steps array) go on the left, final product (beginning) on the right.
 */
export function generateLayout(
  result: SolverResult,
  options: LayoutOptions = {},
): PlacementInstruction[] {
  const {
    columnGap = 3,
    rowGap = 1,
    startX = 0,
    startY = 0,
  } = options;

  const placements: PlacementInstruction[] = [];

  // Reverse steps: extractors (appended last by solver) should be placed on the left,
  // final product steps (first in array) on the right
  const layoutSteps = [...result.steps].reverse();

  let currentX = startX;

  for (let colIdx = 0; colIdx < layoutSteps.length; colIdx++) {
    const step = layoutSteps[colIdx];
    const originalStepIndex = result.steps.length - 1 - colIdx;
    const buildingDef = BUILDINGS[step.buildingType];
    const buildingWidth = buildingDef?.gridWidth ?? 2;
    const buildingHeight = buildingDef?.gridHeight ?? 1;

    let currentY = startY;

    for (let inst = 0; inst < step.buildingCountCeil; inst++) {
      placements.push({
        buildingType: step.buildingType,
        gridX: currentX,
        gridY: currentY,
        recipeId: step.isExtractor ? null : step.recipeId,
        overclock: step.clockPercent,
        mkLevel: (step.minerMkLevel ?? 1) as MkLevel,
        oreType: step.oreType ?? null,
        purity: (step.purity ?? 'normal') as Purity,
        stepIndex: originalStepIndex,
        instanceIndex: inst,
      });

      currentY += buildingHeight + rowGap;
    }

    currentX += buildingWidth + columnGap;
  }

  return placements;
}
