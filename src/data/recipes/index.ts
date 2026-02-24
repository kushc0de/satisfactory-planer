import type { RecipeDef } from '../../types';
import { SMELTER_RECIPES } from './smelter';
import { CONSTRUCTOR_RECIPES } from './constructor';
import { FOUNDRY_RECIPES } from './foundry';
import { ASSEMBLER_RECIPES } from './assembler';
import { MANUFACTURER_RECIPES } from './manufacturer';
import { REFINERY_RECIPES } from './refinery';
import { PACKAGER_RECIPES } from './packager';
import { BLENDER_RECIPES } from './blender';
import { PARTICLE_ACCELERATOR_RECIPES } from './particle_accelerator';
import { CONVERTER_RECIPES } from './converter';
import { QUANTUM_ENCODER_RECIPES } from './quantum_encoder';

export const RECIPES: Record<string, RecipeDef> = {
  ...SMELTER_RECIPES,
  ...CONSTRUCTOR_RECIPES,
  ...FOUNDRY_RECIPES,
  ...ASSEMBLER_RECIPES,
  ...MANUFACTURER_RECIPES,
  ...REFINERY_RECIPES,
  ...PACKAGER_RECIPES,
  ...BLENDER_RECIPES,
  ...PARTICLE_ACCELERATOR_RECIPES,
  ...CONVERTER_RECIPES,
  ...QUANTUM_ENCODER_RECIPES,
};

export function getRecipesForBuilding(buildingType: string): RecipeDef[] {
  return Object.values(RECIPES).filter((r) => r.buildingType === buildingType);
}

export function getStandardRecipesForBuilding(buildingType: string): RecipeDef[] {
  return Object.values(RECIPES).filter((r) => r.buildingType === buildingType && !r.isAlternate);
}

export function getAlternateRecipesForBuilding(buildingType: string): RecipeDef[] {
  return Object.values(RECIPES).filter((r) => r.buildingType === buildingType && r.isAlternate);
}
