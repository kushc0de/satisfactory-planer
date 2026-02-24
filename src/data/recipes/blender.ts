import type { RecipeDef } from '../../types';

export const BLENDER_RECIPES: Record<string, RecipeDef> = {
  // === Standard ===
  battery: {
    id: 'battery', label: 'Batterie', buildingType: 'blender', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'sulfuric_acid', amount: 2.5 }, { itemId: 'alumina_solution', amount: 2 }, { itemId: 'aluminum_casing', amount: 1 }],
    outputs: [{ itemId: 'battery', amount: 1 }, { itemId: 'water', amount: 1.5 }],
  },
  cooling_system: {
    id: 'cooling_system', label: 'Kühlsystem', buildingType: 'blender', cycleTime: 10, isAlternate: false,
    inputs: [{ itemId: 'heat_sink', amount: 2 }, { itemId: 'rubber', amount: 2 }, { itemId: 'water', amount: 5 }, { itemId: 'nitrogen_gas', amount: 25 }],
    outputs: [{ itemId: 'cooling_system', amount: 1 }],
  },
  fused_modular_frame: {
    id: 'fused_modular_frame', label: 'Verschmolzener Modularer Rahmen', buildingType: 'blender', cycleTime: 40, isAlternate: false,
    inputs: [{ itemId: 'heavy_modular_frame', amount: 1 }, { itemId: 'aluminum_casing', amount: 50 }, { itemId: 'nitrogen_gas', amount: 25 }],
    outputs: [{ itemId: 'fused_modular_frame', amount: 1 }],
  },
  encased_uranium_cell: {
    id: 'encased_uranium_cell', label: 'Ummantelte Uranzelle', buildingType: 'blender', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'uranium', amount: 10 }, { itemId: 'concrete', amount: 3 }, { itemId: 'sulfuric_acid', amount: 8 }],
    outputs: [{ itemId: 'encased_uranium_cell', amount: 5 }, { itemId: 'sulfuric_acid', amount: 2 }],
  },
  nitric_acid: {
    id: 'nitric_acid', label: 'Salpetersäure', buildingType: 'blender', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'nitrogen_gas', amount: 12 }, { itemId: 'water', amount: 3 }, { itemId: 'iron_plate', amount: 1 }],
    outputs: [{ itemId: 'nitric_acid', amount: 3 }],
  },
  non_fissile_uranium: {
    id: 'non_fissile_uranium', label: 'Nicht-spaltbares Uran', buildingType: 'blender', cycleTime: 24, isAlternate: false,
    inputs: [{ itemId: 'uranium_waste', amount: 15 }, { itemId: 'silica', amount: 10 }, { itemId: 'nitric_acid', amount: 6 }, { itemId: 'sulfuric_acid', amount: 6 }],
    outputs: [{ itemId: 'non_fissile_uranium', amount: 20 }, { itemId: 'water', amount: 6 }],
  },
  rocket_fuel: {
    id: 'rocket_fuel', label: 'Raketentreibstoff', buildingType: 'blender', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'turbofuel', amount: 6 }, { itemId: 'nitric_acid', amount: 1 }],
    outputs: [{ itemId: 'rocket_fuel', amount: 10 }, { itemId: 'compacted_coal', amount: 1 }],
  },
  biochemical_sculptor: {
    id: 'biochemical_sculptor', label: 'Biochemischer Bildhauer', buildingType: 'blender', cycleTime: 120, isAlternate: false,
    inputs: [{ itemId: 'assembly_director_system', amount: 1 }, { itemId: 'ficsite_trigon', amount: 80 }, { itemId: 'water', amount: 20 }],
    outputs: [{ itemId: 'biochemical_sculptor', amount: 4 }],
  },
  // === Alternate ===
  alt_diluted_fuel: {
    id: 'alt_diluted_fuel', label: 'Verdünnter Treibstoff (Alt)', buildingType: 'blender', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'heavy_oil_residue', amount: 5 }, { itemId: 'water', amount: 10 }],
    outputs: [{ itemId: 'fuel', amount: 10 }],
  },
  alt_cooling_device: {
    id: 'alt_cooling_device', label: 'Kühlgerät (Alt)', buildingType: 'blender', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'heat_sink', amount: 4 }, { itemId: 'motor', amount: 1 }, { itemId: 'nitrogen_gas', amount: 24 }],
    outputs: [{ itemId: 'cooling_system', amount: 2 }],
  },
  alt_heat_fused_frame: {
    id: 'alt_heat_fused_frame', label: 'Hitzegeschmolzener Rahmen (Alt)', buildingType: 'blender', cycleTime: 20, isAlternate: true,
    inputs: [{ itemId: 'heavy_modular_frame', amount: 1 }, { itemId: 'aluminum_ingot', amount: 50 }, { itemId: 'nitric_acid', amount: 8 }, { itemId: 'fuel', amount: 10 }],
    outputs: [{ itemId: 'fused_modular_frame', amount: 1 }],
  },
  alt_instant_scrap: {
    id: 'alt_instant_scrap', label: 'Sofortschrott (Alt)', buildingType: 'blender', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'bauxite', amount: 15 }, { itemId: 'coal', amount: 10 }, { itemId: 'sulfuric_acid', amount: 5 }, { itemId: 'water', amount: 6 }],
    outputs: [{ itemId: 'aluminum_scrap', amount: 30 }, { itemId: 'water', amount: 5 }],
  },
  alt_fertile_uranium: {
    id: 'alt_fertile_uranium', label: 'Fruchtbares Uran (Alt)', buildingType: 'blender', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'uranium', amount: 5 }, { itemId: 'uranium_waste', amount: 5 }, { itemId: 'nitric_acid', amount: 3 }, { itemId: 'sulfuric_acid', amount: 5 }],
    outputs: [{ itemId: 'non_fissile_uranium', amount: 20 }, { itemId: 'water', amount: 8 }],
  },
  alt_turbo_blend_fuel: {
    id: 'alt_turbo_blend_fuel', label: 'Turbo-Mischtreibstoff (Alt)', buildingType: 'blender', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'fuel', amount: 2 }, { itemId: 'heavy_oil_residue', amount: 4 }, { itemId: 'sulfur', amount: 3 }, { itemId: 'petroleum_coke', amount: 3 }],
    outputs: [{ itemId: 'turbofuel', amount: 6 }],
  },
  alt_nitro_rocket_fuel: {
    id: 'alt_nitro_rocket_fuel', label: 'Nitro-Raketentreibstoff (Alt)', buildingType: 'blender', cycleTime: 2.4, isAlternate: true,
    inputs: [{ itemId: 'fuel', amount: 4 }, { itemId: 'nitrogen_gas', amount: 3 }, { itemId: 'sulfur', amount: 4 }, { itemId: 'coal', amount: 2 }],
    outputs: [{ itemId: 'rocket_fuel', amount: 6 }, { itemId: 'compacted_coal', amount: 1 }],
  },
  alt_distilled_silica: {
    id: 'alt_distilled_silica', label: 'Destilliertes Silizium (Alt)', buildingType: 'blender', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'dissolved_silica', amount: 12 }, { itemId: 'limestone', amount: 5 }, { itemId: 'water', amount: 10 }],
    outputs: [{ itemId: 'silica', amount: 27 }, { itemId: 'water', amount: 8 }],
  },
};
