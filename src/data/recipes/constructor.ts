import type { RecipeDef } from '../../types';

export const CONSTRUCTOR_RECIPES: Record<string, RecipeDef> = {
  // === Standard ===
  iron_plate: {
    id: 'iron_plate', label: 'Eisenplatte', buildingType: 'constructor', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'iron_ingot', amount: 3 }], outputs: [{ itemId: 'iron_plate', amount: 2 }],
  },
  iron_rod: {
    id: 'iron_rod', label: 'Eisenstange', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'iron_ingot', amount: 1 }], outputs: [{ itemId: 'iron_rod', amount: 1 }],
  },
  wire: {
    id: 'wire', label: 'Draht', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'copper_ingot', amount: 1 }], outputs: [{ itemId: 'wire', amount: 2 }],
  },
  cable: {
    id: 'cable', label: 'Kabel', buildingType: 'constructor', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'wire', amount: 2 }], outputs: [{ itemId: 'cable', amount: 1 }],
  },
  concrete: {
    id: 'concrete', label: 'Beton', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'limestone', amount: 3 }], outputs: [{ itemId: 'concrete', amount: 1 }],
  },
  screw: {
    id: 'screw', label: 'Schraube', buildingType: 'constructor', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'iron_rod', amount: 1 }], outputs: [{ itemId: 'screw', amount: 4 }],
  },
  copper_sheet: {
    id: 'copper_sheet', label: 'Kupferblech', buildingType: 'constructor', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'copper_ingot', amount: 2 }], outputs: [{ itemId: 'copper_sheet', amount: 1 }],
  },
  steel_beam: {
    id: 'steel_beam', label: 'Stahlträger', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'steel_ingot', amount: 4 }], outputs: [{ itemId: 'steel_beam', amount: 1 }],
  },
  steel_pipe: {
    id: 'steel_pipe', label: 'Stahlrohr', buildingType: 'constructor', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'steel_ingot', amount: 3 }], outputs: [{ itemId: 'steel_pipe', amount: 2 }],
  },
  quartz_crystal: {
    id: 'quartz_crystal', label: 'Quarzkristall', buildingType: 'constructor', cycleTime: 8, isAlternate: false,
    inputs: [{ itemId: 'raw_quartz', amount: 5 }], outputs: [{ itemId: 'quartz_crystal', amount: 3 }],
  },
  silica: {
    id: 'silica', label: 'Silizium', buildingType: 'constructor', cycleTime: 8, isAlternate: false,
    inputs: [{ itemId: 'raw_quartz', amount: 3 }], outputs: [{ itemId: 'silica', amount: 5 }],
  },
  quickwire: {
    id: 'quickwire', label: 'Schnelldraht', buildingType: 'constructor', cycleTime: 5, isAlternate: false,
    inputs: [{ itemId: 'caterium_ingot', amount: 1 }], outputs: [{ itemId: 'quickwire', amount: 5 }],
  },
  empty_canister: {
    id: 'empty_canister', label: 'Leerer Kanister', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'plastic', amount: 2 }], outputs: [{ itemId: 'empty_canister', amount: 4 }],
  },
  aluminum_casing: {
    id: 'aluminum_casing', label: 'Aluminiumgehäuse', buildingType: 'constructor', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'aluminum_ingot', amount: 3 }], outputs: [{ itemId: 'aluminum_casing', amount: 2 }],
  },
  solid_biofuel: {
    id: 'solid_biofuel', label: 'Fester Biobrennstoff', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'biomass', amount: 8 }], outputs: [{ itemId: 'solid_biofuel', amount: 4 }],
  },
  empty_fluid_tank: {
    id: 'empty_fluid_tank', label: 'Leerer Flüssigkeitstank', buildingType: 'constructor', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'aluminum_ingot', amount: 1 }], outputs: [{ itemId: 'empty_fluid_tank', amount: 1 }],
  },
  iron_rebar: {
    id: 'iron_rebar', label: 'Eisenbewehrung', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'iron_rod', amount: 1 }], outputs: [{ itemId: 'iron_rebar', amount: 1 }],
  },
  copper_powder: {
    id: 'copper_powder', label: 'Kupferpulver', buildingType: 'constructor', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'copper_ingot', amount: 30 }], outputs: [{ itemId: 'copper_powder', amount: 5 }],
  },
  ficsite_trigon: {
    id: 'ficsite_trigon', label: 'Ficsit-Trigon', buildingType: 'constructor', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'ficsite_ingot', amount: 1 }], outputs: [{ itemId: 'ficsite_trigon', amount: 3 }],
  },
  reanimated_sam: {
    id: 'reanimated_sam', label: 'Reanimiertes SAM', buildingType: 'constructor', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'sam', amount: 4 }], outputs: [{ itemId: 'reanimated_sam', amount: 1 }],
  },
  biomass_leaves: {
    id: 'biomass_leaves', label: 'Biomasse (Blätter)', buildingType: 'constructor', cycleTime: 5, isAlternate: false,
    inputs: [{ itemId: 'leaves', amount: 10 }], outputs: [{ itemId: 'biomass', amount: 5 }],
  },
  biomass_wood: {
    id: 'biomass_wood', label: 'Biomasse (Holz)', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'wood', amount: 4 }], outputs: [{ itemId: 'biomass', amount: 20 }],
  },
  biomass_mycelia: {
    id: 'biomass_mycelia', label: 'Biomasse (Myzel)', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'mycelia', amount: 1 }], outputs: [{ itemId: 'biomass', amount: 10 }],
  },
  biomass_alien_protein: {
    id: 'biomass_alien_protein', label: 'Biomasse (Alien-Protein)', buildingType: 'constructor', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'alien_protein', amount: 1 }], outputs: [{ itemId: 'biomass', amount: 100 }],
  },
  alien_dna_capsule: {
    id: 'alien_dna_capsule', label: 'Alien-DNS-Kapsel', buildingType: 'constructor', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'alien_protein', amount: 1 }], outputs: [{ itemId: 'alien_dna_capsule', amount: 1 }],
  },
  power_shard_blue: {
    id: 'power_shard_blue', label: 'Energiekristall (Blau)', buildingType: 'constructor', cycleTime: 8, isAlternate: false,
    inputs: [{ itemId: 'blue_power_slug', amount: 1 }], outputs: [{ itemId: 'power_shard', amount: 1 }],
  },
  power_shard_yellow: {
    id: 'power_shard_yellow', label: 'Energiekristall (Gelb)', buildingType: 'constructor', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'yellow_power_slug', amount: 1 }], outputs: [{ itemId: 'power_shard', amount: 2 }],
  },
  power_shard_purple: {
    id: 'power_shard_purple', label: 'Energiekristall (Lila)', buildingType: 'constructor', cycleTime: 24, isAlternate: false,
    inputs: [{ itemId: 'purple_power_slug', amount: 1 }], outputs: [{ itemId: 'power_shard', amount: 5 }],
  },
  hog_protein: {
    id: 'hog_protein', label: 'Schweine-Protein', buildingType: 'constructor', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'hog_remains', amount: 1 }], outputs: [{ itemId: 'alien_protein', amount: 1 }],
  },
  hatcher_protein: {
    id: 'hatcher_protein', label: 'Brüter-Protein', buildingType: 'constructor', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'hatcher_remains', amount: 1 }], outputs: [{ itemId: 'alien_protein', amount: 1 }],
  },
  spitter_protein: {
    id: 'spitter_protein', label: 'Spucker-Protein', buildingType: 'constructor', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'spitter_remains', amount: 1 }], outputs: [{ itemId: 'alien_protein', amount: 1 }],
  },
  stinger_protein: {
    id: 'stinger_protein', label: 'Stachler-Protein', buildingType: 'constructor', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'stinger_remains', amount: 1 }], outputs: [{ itemId: 'alien_protein', amount: 1 }],
  },

  // === Alternate ===
  alt_cast_screw: {
    id: 'alt_cast_screw', label: 'Gegossene Schraube (Alt)', buildingType: 'constructor', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'iron_ingot', amount: 5 }], outputs: [{ itemId: 'screw', amount: 20 }],
  },
  alt_steel_screw: {
    id: 'alt_steel_screw', label: 'Stahlschraube (Alt)', buildingType: 'constructor', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'steel_beam', amount: 1 }], outputs: [{ itemId: 'screw', amount: 52 }],
  },
  alt_steel_rod: {
    id: 'alt_steel_rod', label: 'Stahlstange (Alt)', buildingType: 'constructor', cycleTime: 5, isAlternate: true,
    inputs: [{ itemId: 'steel_ingot', amount: 1 }], outputs: [{ itemId: 'iron_rod', amount: 4 }],
  },
  alt_aluminum_rod: {
    id: 'alt_aluminum_rod', label: 'Aluminiumstange (Alt)', buildingType: 'constructor', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'aluminum_ingot', amount: 1 }], outputs: [{ itemId: 'iron_rod', amount: 7 }],
  },
  alt_aluminum_beam: {
    id: 'alt_aluminum_beam', label: 'Aluminiumträger (Alt)', buildingType: 'constructor', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'aluminum_ingot', amount: 3 }], outputs: [{ itemId: 'steel_beam', amount: 3 }],
  },
  alt_iron_wire: {
    id: 'alt_iron_wire', label: 'Eisendraht (Alt)', buildingType: 'constructor', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'iron_ingot', amount: 5 }], outputs: [{ itemId: 'wire', amount: 9 }],
  },
  alt_caterium_wire: {
    id: 'alt_caterium_wire', label: 'Cateriumdraht (Alt)', buildingType: 'constructor', cycleTime: 4, isAlternate: true,
    inputs: [{ itemId: 'caterium_ingot', amount: 1 }], outputs: [{ itemId: 'wire', amount: 8 }],
  },
  alt_iron_pipe: {
    id: 'alt_iron_pipe', label: 'Eisenrohr (Alt)', buildingType: 'constructor', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'iron_ingot', amount: 20 }], outputs: [{ itemId: 'steel_pipe', amount: 5 }],
  },
  alt_steel_canister: {
    id: 'alt_steel_canister', label: 'Stahlkanister (Alt)', buildingType: 'constructor', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'steel_ingot', amount: 4 }], outputs: [{ itemId: 'empty_canister', amount: 4 }],
  },
  alt_biocoal: {
    id: 'alt_biocoal', label: 'Biokohle (Alt)', buildingType: 'constructor', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'biomass', amount: 5 }], outputs: [{ itemId: 'coal', amount: 6 }],
  },
  alt_charcoal: {
    id: 'alt_charcoal', label: 'Holzkohle (Alt)', buildingType: 'constructor', cycleTime: 4, isAlternate: true,
    inputs: [{ itemId: 'wood', amount: 1 }], outputs: [{ itemId: 'coal', amount: 10 }],
  },
};
