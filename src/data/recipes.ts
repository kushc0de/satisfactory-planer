import type { RecipeDef } from '../types';

export const RECIPES: Record<string, RecipeDef> = {
  // Smelter recipes
  iron_ingot: {
    id: 'iron_ingot',
    label: 'Eisenbarren',
    buildingType: 'smelter',
    cycleTime: 2,
    inputs: [{ itemId: 'iron_ore', amount: 1 }],
    outputs: [{ itemId: 'iron_ingot', amount: 1 }],
  },
  copper_ingot: {
    id: 'copper_ingot',
    label: 'Kupferbarren',
    buildingType: 'smelter',
    cycleTime: 2,
    inputs: [{ itemId: 'copper_ore', amount: 1 }],
    outputs: [{ itemId: 'copper_ingot', amount: 1 }],
  },
  caterium_ingot: {
    id: 'caterium_ingot',
    label: 'Caterium-Barren',
    buildingType: 'smelter',
    cycleTime: 4,
    inputs: [{ itemId: 'caterium_ore', amount: 3 }],
    outputs: [{ itemId: 'caterium_ingot', amount: 1 }],
  },

  // Constructor recipes
  iron_plate: {
    id: 'iron_plate',
    label: 'Eisenplatte',
    buildingType: 'constructor',
    cycleTime: 6,
    inputs: [{ itemId: 'iron_ingot', amount: 3 }],
    outputs: [{ itemId: 'iron_plate', amount: 2 }],
  },
  iron_rod: {
    id: 'iron_rod',
    label: 'Eisenstange',
    buildingType: 'constructor',
    cycleTime: 4,
    inputs: [{ itemId: 'iron_ingot', amount: 1 }],
    outputs: [{ itemId: 'iron_rod', amount: 1 }],
  },
  wire: {
    id: 'wire',
    label: 'Draht',
    buildingType: 'constructor',
    cycleTime: 4,
    inputs: [{ itemId: 'copper_ingot', amount: 1 }],
    outputs: [{ itemId: 'wire', amount: 2 }],
  },
  cable: {
    id: 'cable',
    label: 'Kabel',
    buildingType: 'constructor',
    cycleTime: 2,
    inputs: [{ itemId: 'wire', amount: 2 }],
    outputs: [{ itemId: 'cable', amount: 1 }],
  },
  concrete: {
    id: 'concrete',
    label: 'Beton',
    buildingType: 'constructor',
    cycleTime: 4,
    inputs: [{ itemId: 'limestone', amount: 3 }],
    outputs: [{ itemId: 'concrete', amount: 1 }],
  },
  screw: {
    id: 'screw',
    label: 'Schraube',
    buildingType: 'constructor',
    cycleTime: 6,
    inputs: [{ itemId: 'iron_rod', amount: 1 }],
    outputs: [{ itemId: 'screw', amount: 4 }],
  },
  copper_sheet: {
    id: 'copper_sheet',
    label: 'Kupferblech',
    buildingType: 'constructor',
    cycleTime: 6,
    inputs: [{ itemId: 'copper_ingot', amount: 2 }],
    outputs: [{ itemId: 'copper_sheet', amount: 1 }],
  },
  steel_beam: {
    id: 'steel_beam',
    label: 'Stahlträger',
    buildingType: 'constructor',
    cycleTime: 4,
    inputs: [{ itemId: 'steel_ingot', amount: 4 }],
    outputs: [{ itemId: 'steel_beam', amount: 1 }],
  },
  steel_pipe: {
    id: 'steel_pipe',
    label: 'Stahlrohr',
    buildingType: 'constructor',
    cycleTime: 6,
    inputs: [{ itemId: 'steel_ingot', amount: 3 }],
    outputs: [{ itemId: 'steel_pipe', amount: 2 }],
  },

  // Foundry recipes
  steel_ingot: {
    id: 'steel_ingot',
    label: 'Stahlbarren',
    buildingType: 'foundry',
    cycleTime: 4,
    inputs: [
      { itemId: 'iron_ore', amount: 3 },
      { itemId: 'coal', amount: 3 },
    ],
    outputs: [{ itemId: 'steel_ingot', amount: 3 }],
  },

  // Assembler recipes
  reinforced_iron_plate: {
    id: 'reinforced_iron_plate',
    label: 'Verstärkte Eisenplatte',
    buildingType: 'assembler',
    cycleTime: 12,
    inputs: [
      { itemId: 'iron_plate', amount: 6 },
      { itemId: 'screw', amount: 12 },
    ],
    outputs: [{ itemId: 'reinforced_iron_plate', amount: 1 }],
  },
  modular_frame: {
    id: 'modular_frame',
    label: 'Modularer Rahmen',
    buildingType: 'assembler',
    cycleTime: 60,
    inputs: [
      { itemId: 'reinforced_iron_plate', amount: 3 },
      { itemId: 'iron_rod', amount: 12 },
    ],
    outputs: [{ itemId: 'modular_frame', amount: 2 }],
  },
  rotor: {
    id: 'rotor',
    label: 'Rotor',
    buildingType: 'assembler',
    cycleTime: 15,
    inputs: [
      { itemId: 'iron_rod', amount: 5 },
      { itemId: 'screw', amount: 25 },
    ],
    outputs: [{ itemId: 'rotor', amount: 1 }],
  },
  smart_plating: {
    id: 'smart_plating',
    label: 'Intelligente Platte',
    buildingType: 'assembler',
    cycleTime: 30,
    inputs: [
      { itemId: 'reinforced_iron_plate', amount: 1 },
      { itemId: 'rotor', amount: 1 },
    ],
    outputs: [{ itemId: 'smart_plating', amount: 1 }],
  },
};

export function getRecipesForBuilding(buildingType: string): RecipeDef[] {
  return Object.values(RECIPES).filter((r) => r.buildingType === buildingType);
}
