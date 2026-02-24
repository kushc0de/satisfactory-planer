import type { RecipeDef } from '../../types';

export const FOUNDRY_RECIPES: Record<string, RecipeDef> = {
  // === Standard ===
  steel_ingot: {
    id: 'steel_ingot', label: 'Stahlbarren', buildingType: 'foundry', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'iron_ore', amount: 3 }, { itemId: 'coal', amount: 3 }],
    outputs: [{ itemId: 'steel_ingot', amount: 3 }],
  },
  aluminum_ingot: {
    id: 'aluminum_ingot', label: 'Aluminiumbarren', buildingType: 'foundry', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'aluminum_scrap', amount: 6 }, { itemId: 'silica', amount: 5 }],
    outputs: [{ itemId: 'aluminum_ingot', amount: 4 }],
  },
  // === Alternate ===
  alt_iron_alloy_ingot: {
    id: 'alt_iron_alloy_ingot', label: 'Eisenlegierungsbarren (Alt)', buildingType: 'foundry', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'iron_ore', amount: 8 }, { itemId: 'copper_ore', amount: 2 }],
    outputs: [{ itemId: 'iron_ingot', amount: 15 }],
  },
  alt_copper_alloy_ingot: {
    id: 'alt_copper_alloy_ingot', label: 'Kupferlegierungsbarren (Alt)', buildingType: 'foundry', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'copper_ore', amount: 5 }, { itemId: 'iron_ore', amount: 5 }],
    outputs: [{ itemId: 'copper_ingot', amount: 10 }],
  },
  alt_solid_steel_ingot: {
    id: 'alt_solid_steel_ingot', label: 'Massiver Stahlbarren (Alt)', buildingType: 'foundry', cycleTime: 3, isAlternate: true,
    inputs: [{ itemId: 'iron_ingot', amount: 2 }, { itemId: 'coal', amount: 2 }],
    outputs: [{ itemId: 'steel_ingot', amount: 3 }],
  },
  alt_coke_steel_ingot: {
    id: 'alt_coke_steel_ingot', label: 'Koks-Stahlbarren (Alt)', buildingType: 'foundry', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'iron_ore', amount: 15 }, { itemId: 'petroleum_coke', amount: 15 }],
    outputs: [{ itemId: 'steel_ingot', amount: 20 }],
  },
  alt_compacted_steel_ingot: {
    id: 'alt_compacted_steel_ingot', label: 'Verdichteter Stahlbarren (Alt)', buildingType: 'foundry', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'iron_ore', amount: 2 }, { itemId: 'compacted_coal', amount: 1 }],
    outputs: [{ itemId: 'steel_ingot', amount: 4 }],
  },
  alt_basic_iron_ingot: {
    id: 'alt_basic_iron_ingot', label: 'Einfacher Eisenbarren (Alt)', buildingType: 'foundry', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'iron_ore', amount: 5 }, { itemId: 'limestone', amount: 8 }],
    outputs: [{ itemId: 'iron_ingot', amount: 10 }],
  },
  alt_tempered_copper_ingot: {
    id: 'alt_tempered_copper_ingot', label: 'Gehärteter Kupferbarren (Alt)', buildingType: 'foundry', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'copper_ore', amount: 5 }, { itemId: 'petroleum_coke', amount: 8 }],
    outputs: [{ itemId: 'copper_ingot', amount: 12 }],
  },
  alt_tempered_caterium_ingot: {
    id: 'alt_tempered_caterium_ingot', label: 'Gehärteter Caterium-Barren (Alt)', buildingType: 'foundry', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'caterium_ore', amount: 6 }, { itemId: 'petroleum_coke', amount: 2 }],
    outputs: [{ itemId: 'caterium_ingot', amount: 3 }],
  },
  alt_fused_quartz_crystal: {
    id: 'alt_fused_quartz_crystal', label: 'Verschmolzener Quarzkristall (Alt)', buildingType: 'foundry', cycleTime: 20, isAlternate: true,
    inputs: [{ itemId: 'raw_quartz', amount: 25 }, { itemId: 'coal', amount: 12 }],
    outputs: [{ itemId: 'quartz_crystal', amount: 18 }],
  },
  alt_steel_cast_plate: {
    id: 'alt_steel_cast_plate', label: 'Stahlgussplatte (Alt)', buildingType: 'foundry', cycleTime: 4, isAlternate: true,
    inputs: [{ itemId: 'iron_ingot', amount: 1 }, { itemId: 'steel_ingot', amount: 1 }],
    outputs: [{ itemId: 'iron_plate', amount: 3 }],
  },
  alt_molded_beam: {
    id: 'alt_molded_beam', label: 'Geformter Träger (Alt)', buildingType: 'foundry', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'steel_ingot', amount: 24 }, { itemId: 'concrete', amount: 16 }],
    outputs: [{ itemId: 'steel_beam', amount: 9 }],
  },
  alt_molded_steel_pipe: {
    id: 'alt_molded_steel_pipe', label: 'Geformtes Stahlrohr (Alt)', buildingType: 'foundry', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'steel_ingot', amount: 5 }, { itemId: 'concrete', amount: 3 }],
    outputs: [{ itemId: 'steel_pipe', amount: 5 }],
  },
};
