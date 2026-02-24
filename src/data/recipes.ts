import type { RecipeDef } from '../types';

export const RECIPES: Record<string, RecipeDef> = {
  // === Smelter recipes ===
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

  // === Constructor recipes ===
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
  quartz_crystal: {
    id: 'quartz_crystal',
    label: 'Quarzkristall',
    buildingType: 'constructor',
    cycleTime: 8,
    inputs: [{ itemId: 'raw_quartz', amount: 5 }],
    outputs: [{ itemId: 'quartz_crystal', amount: 3 }],
  },
  silica: {
    id: 'silica',
    label: 'Silikon',
    buildingType: 'constructor',
    cycleTime: 6,
    inputs: [{ itemId: 'raw_quartz', amount: 3 }],
    outputs: [{ itemId: 'silica', amount: 5 }],
  },
  quickwire: {
    id: 'quickwire',
    label: 'Schnelldraht',
    buildingType: 'constructor',
    cycleTime: 5,
    inputs: [{ itemId: 'caterium_ingot', amount: 1 }],
    outputs: [{ itemId: 'quickwire', amount: 5 }],
  },
  empty_canister: {
    id: 'empty_canister',
    label: 'Leerer Kanister',
    buildingType: 'constructor',
    cycleTime: 4,
    inputs: [{ itemId: 'plastic', amount: 2 }],
    outputs: [{ itemId: 'empty_canister', amount: 4 }],
  },
  aluminum_casing: {
    id: 'aluminum_casing',
    label: 'Aluminiumgehäuse',
    buildingType: 'constructor',
    cycleTime: 2,
    inputs: [{ itemId: 'aluminum_ingot', amount: 3 }],
    outputs: [{ itemId: 'aluminum_casing', amount: 2 }],
  },

  // === Foundry recipes ===
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
  aluminum_ingot: {
    id: 'aluminum_ingot',
    label: 'Aluminiumbarren',
    buildingType: 'foundry',
    cycleTime: 4,
    inputs: [
      { itemId: 'aluminum_scrap', amount: 6 },
      { itemId: 'silica', amount: 5 },
    ],
    outputs: [{ itemId: 'aluminum_ingot', amount: 4 }],
  },

  // === Assembler recipes ===
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
  circuit_board: {
    id: 'circuit_board',
    label: 'Leiterplatte',
    buildingType: 'assembler',
    cycleTime: 8,
    inputs: [
      { itemId: 'copper_sheet', amount: 2 },
      { itemId: 'plastic', amount: 4 },
    ],
    outputs: [{ itemId: 'circuit_board', amount: 1 }],
  },
  encased_industrial_beam: {
    id: 'encased_industrial_beam',
    label: 'Ummantelter Industrieträger',
    buildingType: 'assembler',
    cycleTime: 10,
    inputs: [
      { itemId: 'steel_beam', amount: 4 },
      { itemId: 'concrete', amount: 5 },
    ],
    outputs: [{ itemId: 'encased_industrial_beam', amount: 1 }],
  },
  stator: {
    id: 'stator',
    label: 'Stator',
    buildingType: 'assembler',
    cycleTime: 12,
    inputs: [
      { itemId: 'steel_pipe', amount: 3 },
      { itemId: 'wire', amount: 8 },
    ],
    outputs: [{ itemId: 'stator', amount: 1 }],
  },
  motor: {
    id: 'motor',
    label: 'Motor',
    buildingType: 'assembler',
    cycleTime: 12,
    inputs: [
      { itemId: 'rotor', amount: 2 },
      { itemId: 'stator', amount: 2 },
    ],
    outputs: [{ itemId: 'motor', amount: 1 }],
  },
  versatile_framework: {
    id: 'versatile_framework',
    label: 'Vielseitiges Rahmenwerk',
    buildingType: 'assembler',
    cycleTime: 24,
    inputs: [
      { itemId: 'modular_frame', amount: 1 },
      { itemId: 'steel_beam', amount: 12 },
    ],
    outputs: [{ itemId: 'versatile_framework', amount: 2 }],
  },
  automated_wiring: {
    id: 'automated_wiring',
    label: 'Automatische Verkabelung',
    buildingType: 'assembler',
    cycleTime: 24,
    inputs: [
      { itemId: 'stator', amount: 1 },
      { itemId: 'cable', amount: 20 },
    ],
    outputs: [{ itemId: 'automated_wiring', amount: 1 }],
  },

  // === Manufacturer recipes ===
  computer: {
    id: 'computer',
    label: 'Computer',
    buildingType: 'manufacturer',
    cycleTime: 24,
    inputs: [
      { itemId: 'circuit_board', amount: 10 },
      { itemId: 'cable', amount: 9 },
      { itemId: 'plastic', amount: 18 },
      { itemId: 'screw', amount: 52 },
    ],
    outputs: [{ itemId: 'computer', amount: 1 }],
  },
  heavy_modular_frame: {
    id: 'heavy_modular_frame',
    label: 'Schwerer Modularer Rahmen',
    buildingType: 'manufacturer',
    cycleTime: 30,
    inputs: [
      { itemId: 'modular_frame', amount: 5 },
      { itemId: 'steel_pipe', amount: 15 },
      { itemId: 'encased_industrial_beam', amount: 5 },
      { itemId: 'screw', amount: 100 },
    ],
    outputs: [{ itemId: 'heavy_modular_frame', amount: 1 }],
  },
  high_speed_connector: {
    id: 'high_speed_connector',
    label: 'Hochgeschwindigkeits-Stecker',
    buildingType: 'manufacturer',
    cycleTime: 16,
    inputs: [
      { itemId: 'quickwire', amount: 56 },
      { itemId: 'cable', amount: 10 },
      { itemId: 'circuit_board', amount: 1 },
    ],
    outputs: [{ itemId: 'high_speed_connector', amount: 1 }],
  },
  modular_engine: {
    id: 'modular_engine',
    label: 'Modularer Motor',
    buildingType: 'manufacturer',
    cycleTime: 60,
    inputs: [
      { itemId: 'motor', amount: 2 },
      { itemId: 'rubber', amount: 15 },
      { itemId: 'smart_plating', amount: 2 },
    ],
    outputs: [{ itemId: 'modular_engine', amount: 1 }],
  },

  // === Refinery recipes ===
  plastic: {
    id: 'plastic',
    label: 'Plastik',
    buildingType: 'refinery',
    cycleTime: 6,
    inputs: [{ itemId: 'crude_oil', amount: 3 }],
    outputs: [
      { itemId: 'plastic', amount: 2 },
      { itemId: 'heavy_oil_residue', amount: 1 },
    ],
  },
  rubber: {
    id: 'rubber',
    label: 'Gummi',
    buildingType: 'refinery',
    cycleTime: 6,
    inputs: [{ itemId: 'crude_oil', amount: 3 }],
    outputs: [
      { itemId: 'rubber', amount: 2 },
      { itemId: 'heavy_oil_residue', amount: 2 },
    ],
  },
  fuel: {
    id: 'fuel',
    label: 'Treibstoff',
    buildingType: 'refinery',
    cycleTime: 6,
    inputs: [{ itemId: 'crude_oil', amount: 6 }],
    outputs: [
      { itemId: 'fuel', amount: 4 },
      { itemId: 'polymer_resin', amount: 3 },
    ],
  },
  petroleum_coke: {
    id: 'petroleum_coke',
    label: 'Petrolkoks',
    buildingType: 'refinery',
    cycleTime: 6,
    inputs: [{ itemId: 'heavy_oil_residue', amount: 4 }],
    outputs: [{ itemId: 'petroleum_coke', amount: 12 }],
  },
  alumina_solution: {
    id: 'alumina_solution',
    label: 'Aluminiumoxid-Lösung',
    buildingType: 'refinery',
    cycleTime: 6,
    inputs: [
      { itemId: 'bauxite', amount: 12 },
      { itemId: 'water', amount: 18 },
    ],
    outputs: [
      { itemId: 'alumina_solution', amount: 12 },
      { itemId: 'silica', amount: 5 },
    ],
  },
  aluminum_scrap: {
    id: 'aluminum_scrap',
    label: 'Aluminiumschrott',
    buildingType: 'refinery',
    cycleTime: 1,
    inputs: [
      { itemId: 'alumina_solution', amount: 4 },
      { itemId: 'coal', amount: 2 },
    ],
    outputs: [
      { itemId: 'aluminum_scrap', amount: 6 },
      { itemId: 'water', amount: 2 },
    ],
  },

  // === Packager recipes ===
  packaged_water: {
    id: 'packaged_water',
    label: 'Verpacktes Wasser',
    buildingType: 'packager',
    cycleTime: 2,
    inputs: [
      { itemId: 'water', amount: 2 },
      { itemId: 'empty_canister', amount: 2 },
    ],
    outputs: [{ itemId: 'packaged_water', amount: 2 }],
  },
};

export function getRecipesForBuilding(buildingType: string): RecipeDef[] {
  return Object.values(RECIPES).filter((r) => r.buildingType === buildingType);
}
