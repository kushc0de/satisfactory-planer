import type { RecipeDef } from '../../types';

export const SMELTER_RECIPES: Record<string, RecipeDef> = {
  iron_ingot: {
    id: 'iron_ingot', label: 'Eisenbarren', buildingType: 'smelter', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'iron_ore', amount: 1 }],
    outputs: [{ itemId: 'iron_ingot', amount: 1 }],
  },
  copper_ingot: {
    id: 'copper_ingot', label: 'Kupferbarren', buildingType: 'smelter', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'copper_ore', amount: 1 }],
    outputs: [{ itemId: 'copper_ingot', amount: 1 }],
  },
  caterium_ingot: {
    id: 'caterium_ingot', label: 'Caterium-Barren', buildingType: 'smelter', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'caterium_ore', amount: 3 }],
    outputs: [{ itemId: 'caterium_ingot', amount: 1 }],
  },
  alt_pure_aluminum_ingot: {
    id: 'alt_pure_aluminum_ingot', label: 'Reiner Aluminiumbarren (Alt)', buildingType: 'smelter', cycleTime: 2, isAlternate: true,
    inputs: [{ itemId: 'aluminum_scrap', amount: 2 }],
    outputs: [{ itemId: 'aluminum_ingot', amount: 1 }],
  },
};
