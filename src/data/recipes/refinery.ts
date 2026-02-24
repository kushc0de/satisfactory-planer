import type { RecipeDef } from '../../types';

export const REFINERY_RECIPES: Record<string, RecipeDef> = {
  // === Standard ===
  plastic: {
    id: 'plastic', label: 'Kunststoff', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'crude_oil', amount: 3 }],
    outputs: [{ itemId: 'plastic', amount: 2 }, { itemId: 'heavy_oil_residue', amount: 1 }],
  },
  rubber: {
    id: 'rubber', label: 'Gummi', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'crude_oil', amount: 3 }],
    outputs: [{ itemId: 'rubber', amount: 2 }, { itemId: 'heavy_oil_residue', amount: 2 }],
  },
  fuel: {
    id: 'fuel', label: 'Treibstoff', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'crude_oil', amount: 6 }],
    outputs: [{ itemId: 'fuel', amount: 4 }, { itemId: 'polymer_resin', amount: 3 }],
  },
  petroleum_coke: {
    id: 'petroleum_coke', label: 'Petrolkoks', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'heavy_oil_residue', amount: 4 }],
    outputs: [{ itemId: 'petroleum_coke', amount: 12 }],
  },
  residual_plastic: {
    id: 'residual_plastic', label: 'Restkunststoff', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'polymer_resin', amount: 6 }, { itemId: 'water', amount: 2 }],
    outputs: [{ itemId: 'plastic', amount: 2 }],
  },
  residual_rubber: {
    id: 'residual_rubber', label: 'Restgummi', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'polymer_resin', amount: 4 }, { itemId: 'water', amount: 4 }],
    outputs: [{ itemId: 'rubber', amount: 2 }],
  },
  residual_fuel: {
    id: 'residual_fuel', label: 'Resttreibstoff', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'heavy_oil_residue', amount: 6 }],
    outputs: [{ itemId: 'fuel', amount: 4 }],
  },
  sulfuric_acid: {
    id: 'sulfuric_acid', label: 'Schwefelsäure', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'sulfur', amount: 5 }, { itemId: 'water', amount: 5 }],
    outputs: [{ itemId: 'sulfuric_acid', amount: 5 }],
  },
  alumina_solution: {
    id: 'alumina_solution', label: 'Aluminiumoxid-Lösung', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'bauxite', amount: 12 }, { itemId: 'water', amount: 18 }],
    outputs: [{ itemId: 'alumina_solution', amount: 12 }, { itemId: 'silica', amount: 5 }],
  },
  aluminum_scrap: {
    id: 'aluminum_scrap', label: 'Aluminiumschrott', buildingType: 'refinery', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'alumina_solution', amount: 4 }, { itemId: 'coal', amount: 2 }],
    outputs: [{ itemId: 'aluminum_scrap', amount: 6 }, { itemId: 'water', amount: 2 }],
  },
  smokeless_powder: {
    id: 'smokeless_powder', label: 'Rauchloses Pulver', buildingType: 'refinery', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'black_powder', amount: 2 }, { itemId: 'heavy_oil_residue', amount: 1 }],
    outputs: [{ itemId: 'smokeless_powder', amount: 2 }],
  },
  liquid_biofuel: {
    id: 'liquid_biofuel', label: 'Flüssiger Biobrennstoff', buildingType: 'refinery', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'solid_biofuel', amount: 6 }, { itemId: 'water', amount: 3 }],
    outputs: [{ itemId: 'liquid_biofuel', amount: 4 }],
  },
  ionized_fuel: {
    id: 'ionized_fuel', label: 'Ionisierter Treibstoff', buildingType: 'refinery', cycleTime: 24, isAlternate: false,
    inputs: [{ itemId: 'rocket_fuel', amount: 16 }, { itemId: 'power_shard', amount: 1 }],
    outputs: [{ itemId: 'ionized_fuel', amount: 16 }, { itemId: 'compacted_coal', amount: 2 }],
  },
  // === Alternate ===
  alt_pure_iron_ingot: {
    id: 'alt_pure_iron_ingot', label: 'Reiner Eisenbarren (Alt)', buildingType: 'refinery', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'iron_ore', amount: 7 }, { itemId: 'water', amount: 4 }],
    outputs: [{ itemId: 'iron_ingot', amount: 13 }],
  },
  alt_pure_copper_ingot: {
    id: 'alt_pure_copper_ingot', label: 'Reiner Kupferbarren (Alt)', buildingType: 'refinery', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'copper_ore', amount: 6 }, { itemId: 'water', amount: 4 }],
    outputs: [{ itemId: 'copper_ingot', amount: 15 }],
  },
  alt_pure_caterium_ingot: {
    id: 'alt_pure_caterium_ingot', label: 'Reiner Caterium-Barren (Alt)', buildingType: 'refinery', cycleTime: 5, isAlternate: true,
    inputs: [{ itemId: 'caterium_ore', amount: 2 }, { itemId: 'water', amount: 2 }],
    outputs: [{ itemId: 'caterium_ingot', amount: 1 }],
  },
  alt_pure_quartz_crystal: {
    id: 'alt_pure_quartz_crystal', label: 'Reiner Quarzkristall (Alt)', buildingType: 'refinery', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'raw_quartz', amount: 9 }, { itemId: 'water', amount: 5 }],
    outputs: [{ itemId: 'quartz_crystal', amount: 7 }],
  },
  alt_recycled_plastic: {
    id: 'alt_recycled_plastic', label: 'Recycelter Kunststoff (Alt)', buildingType: 'refinery', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'rubber', amount: 6 }, { itemId: 'fuel', amount: 6 }],
    outputs: [{ itemId: 'plastic', amount: 12 }],
  },
  alt_recycled_rubber: {
    id: 'alt_recycled_rubber', label: 'Recyceltes Gummi (Alt)', buildingType: 'refinery', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'plastic', amount: 6 }, { itemId: 'fuel', amount: 6 }],
    outputs: [{ itemId: 'rubber', amount: 12 }],
  },
  alt_sloppy_alumina: {
    id: 'alt_sloppy_alumina', label: 'Schlampiges Aluminiumoxid (Alt)', buildingType: 'refinery', cycleTime: 3, isAlternate: true,
    inputs: [{ itemId: 'bauxite', amount: 10 }, { itemId: 'water', amount: 10 }],
    outputs: [{ itemId: 'alumina_solution', amount: 12 }],
  },
  alt_electrode_aluminum_scrap: {
    id: 'alt_electrode_aluminum_scrap', label: 'Elektroden-Aluminiumschrott (Alt)', buildingType: 'refinery', cycleTime: 4, isAlternate: true,
    inputs: [{ itemId: 'alumina_solution', amount: 12 }, { itemId: 'petroleum_coke', amount: 4 }],
    outputs: [{ itemId: 'aluminum_scrap', amount: 20 }, { itemId: 'water', amount: 7 }],
  },
  alt_heavy_oil_residue: {
    id: 'alt_heavy_oil_residue', label: 'Schweres Ölrückstand (Alt)', buildingType: 'refinery', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'crude_oil', amount: 3 }],
    outputs: [{ itemId: 'heavy_oil_residue', amount: 4 }, { itemId: 'polymer_resin', amount: 2 }],
  },
  alt_polymer_resin: {
    id: 'alt_polymer_resin', label: 'Polymerharz (Alt)', buildingType: 'refinery', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'crude_oil', amount: 6 }],
    outputs: [{ itemId: 'polymer_resin', amount: 13 }, { itemId: 'heavy_oil_residue', amount: 2 }],
  },
  alt_turbofuel: {
    id: 'alt_turbofuel', label: 'Turbotreibstoff (Alt)', buildingType: 'refinery', cycleTime: 16, isAlternate: true,
    inputs: [{ itemId: 'fuel', amount: 6 }, { itemId: 'compacted_coal', amount: 4 }],
    outputs: [{ itemId: 'turbofuel', amount: 5 }],
  },
  alt_turbo_heavy_fuel: {
    id: 'alt_turbo_heavy_fuel', label: 'Turbo-Schweröl (Alt)', buildingType: 'refinery', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'heavy_oil_residue', amount: 5 }, { itemId: 'compacted_coal', amount: 4 }],
    outputs: [{ itemId: 'turbofuel', amount: 4 }],
  },
  alt_coated_cable: {
    id: 'alt_coated_cable', label: 'Beschichtetes Kabel (Alt)', buildingType: 'refinery', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'wire', amount: 5 }, { itemId: 'heavy_oil_residue', amount: 2 }],
    outputs: [{ itemId: 'cable', amount: 9 }],
  },
  alt_steamed_copper_sheet: {
    id: 'alt_steamed_copper_sheet', label: 'Gedämpftes Kupferblech (Alt)', buildingType: 'refinery', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'copper_ingot', amount: 3 }, { itemId: 'water', amount: 3 }],
    outputs: [{ itemId: 'copper_sheet', amount: 3 }],
  },
  alt_wet_concrete: {
    id: 'alt_wet_concrete', label: 'Nassbeton (Alt)', buildingType: 'refinery', cycleTime: 3, isAlternate: true,
    inputs: [{ itemId: 'limestone', amount: 6 }, { itemId: 'water', amount: 5 }],
    outputs: [{ itemId: 'concrete', amount: 4 }],
  },
  alt_diluted_packaged_fuel: {
    id: 'alt_diluted_packaged_fuel', label: 'Verdünnter verpackter Treibstoff (Alt)', buildingType: 'refinery', cycleTime: 2, isAlternate: true,
    inputs: [{ itemId: 'heavy_oil_residue', amount: 1 }, { itemId: 'packaged_water', amount: 2 }],
    outputs: [{ itemId: 'packaged_fuel', amount: 2 }],
  },
  alt_leached_iron_ingot: {
    id: 'alt_leached_iron_ingot', label: 'Gelaugter Eisenbarren (Alt)', buildingType: 'refinery', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'iron_ore', amount: 5 }, { itemId: 'sulfuric_acid', amount: 1 }],
    outputs: [{ itemId: 'iron_ingot', amount: 10 }],
  },
  alt_leached_copper_ingot: {
    id: 'alt_leached_copper_ingot', label: 'Gelaugter Kupferbarren (Alt)', buildingType: 'refinery', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'copper_ore', amount: 9 }, { itemId: 'sulfuric_acid', amount: 5 }],
    outputs: [{ itemId: 'copper_ingot', amount: 22 }],
  },
  alt_leached_caterium_ingot: {
    id: 'alt_leached_caterium_ingot', label: 'Gelaugter Caterium-Barren (Alt)', buildingType: 'refinery', cycleTime: 10, isAlternate: true,
    inputs: [{ itemId: 'caterium_ore', amount: 9 }, { itemId: 'sulfuric_acid', amount: 5 }],
    outputs: [{ itemId: 'caterium_ingot', amount: 6 }],
  },
  alt_polyester_fabric: {
    id: 'alt_polyester_fabric', label: 'Polyesterstoff (Alt)', buildingType: 'refinery', cycleTime: 2, isAlternate: true,
    inputs: [{ itemId: 'polymer_resin', amount: 1 }, { itemId: 'water', amount: 1 }],
    outputs: [{ itemId: 'fabric', amount: 1 }],
  },
  alt_quartz_purification: {
    id: 'alt_quartz_purification', label: 'Quarzreinigung (Alt)', buildingType: 'refinery', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'raw_quartz', amount: 24 }, { itemId: 'nitric_acid', amount: 2 }],
    outputs: [{ itemId: 'quartz_crystal', amount: 15 }, { itemId: 'dissolved_silica', amount: 12 }],
  },
};
