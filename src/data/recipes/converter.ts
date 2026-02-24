import type { RecipeDef } from '../../types';

export const CONVERTER_RECIPES: Record<string, RecipeDef> = {
  // === Special Standard ===
  dark_matter_residue: {
    id: 'dark_matter_residue', label: 'Dunkle-Materie-Rückstand', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 5 }],
    outputs: [{ itemId: 'dark_matter_residue', amount: 10 }],
    minPower: 100, maxPower: 400,
  },
  excited_photonic_matter: {
    id: 'excited_photonic_matter', label: 'Angeregte Photonische Materie', buildingType: 'converter', cycleTime: 3, isAlternate: false,
    inputs: [],
    outputs: [{ itemId: 'excited_photonic_matter', amount: 10 }],
    minPower: 100, maxPower: 400,
  },
  ficsite_ingot_iron: {
    id: 'ficsite_ingot_iron', label: 'Ficsit-Barren (Eisen)', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 4 }, { itemId: 'iron_ingot', amount: 24 }],
    outputs: [{ itemId: 'ficsite_ingot', amount: 1 }],
    minPower: 100, maxPower: 400,
  },
  ficsite_ingot_aluminum: {
    id: 'ficsite_ingot_aluminum', label: 'Ficsit-Barren (Aluminium)', buildingType: 'converter', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 2 }, { itemId: 'aluminum_ingot', amount: 4 }],
    outputs: [{ itemId: 'ficsite_ingot', amount: 1 }],
    minPower: 100, maxPower: 400,
  },
  ficsite_ingot_caterium: {
    id: 'ficsite_ingot_caterium', label: 'Ficsit-Barren (Caterium)', buildingType: 'converter', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 3 }, { itemId: 'caterium_ingot', amount: 4 }],
    outputs: [{ itemId: 'ficsite_ingot', amount: 1 }],
    minPower: 100, maxPower: 400,
  },
  time_crystal: {
    id: 'time_crystal', label: 'Zeitkristall', buildingType: 'converter', cycleTime: 10, isAlternate: false,
    inputs: [{ itemId: 'diamonds', amount: 2 }],
    outputs: [{ itemId: 'time_crystal', amount: 1 }],
    minPower: 100, maxPower: 400,
  },
  // === Ore Conversions (selection of key ones) ===
  conv_iron_to_limestone: {
    id: 'conv_iron_to_limestone', label: 'Eisen zu Kalkstein', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'iron_ore', amount: 2 }],
    outputs: [{ itemId: 'limestone', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  conv_limestone_to_iron: {
    id: 'conv_limestone_to_iron', label: 'Kalkstein zu Eisen', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'limestone', amount: 2 }],
    outputs: [{ itemId: 'iron_ore', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  conv_coal_to_iron: {
    id: 'conv_coal_to_iron', label: 'Kohle zu Eisen', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'coal', amount: 2 }],
    outputs: [{ itemId: 'iron_ore', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  conv_iron_to_coal: {
    id: 'conv_iron_to_coal', label: 'Eisen zu Kohle', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'iron_ore', amount: 2 }],
    outputs: [{ itemId: 'coal', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  conv_copper_to_quartz: {
    id: 'conv_copper_to_quartz', label: 'Kupfer zu Quarz', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'copper_ore', amount: 2 }],
    outputs: [{ itemId: 'raw_quartz', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  conv_sulfur_to_coal: {
    id: 'conv_sulfur_to_coal', label: 'Schwefel zu Kohle', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'sulfur', amount: 2 }],
    outputs: [{ itemId: 'coal', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  conv_bauxite_to_copper: {
    id: 'conv_bauxite_to_copper', label: 'Bauxit zu Kupfer', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'bauxite', amount: 2 }],
    outputs: [{ itemId: 'copper_ore', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  conv_nitrogen_to_bauxite: {
    id: 'conv_nitrogen_to_bauxite', label: 'Stickstoff zu Bauxit', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'nitrogen_gas', amount: 2 }],
    outputs: [{ itemId: 'bauxite', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  conv_uranium_to_bauxite: {
    id: 'conv_uranium_to_bauxite', label: 'Uran zu Bauxit', buildingType: 'converter', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 1 }, { itemId: 'uranium', amount: 2 }],
    outputs: [{ itemId: 'bauxite', amount: 12 }],
    minPower: 100, maxPower: 400,
  },
  // === Alternate ===
  alt_pink_diamonds: {
    id: 'alt_pink_diamonds', label: 'Rosa Diamanten (Alt)', buildingType: 'converter', cycleTime: 4, isAlternate: true,
    inputs: [{ itemId: 'coal', amount: 8 }, { itemId: 'quartz_crystal', amount: 3 }],
    outputs: [{ itemId: 'diamonds', amount: 1 }],
    minPower: 100, maxPower: 400,
  },
  alt_dark_ion_fuel: {
    id: 'alt_dark_ion_fuel', label: 'Dunkler-Ionen-Treibstoff (Alt)', buildingType: 'converter', cycleTime: 3, isAlternate: true,
    inputs: [{ itemId: 'packaged_rocket_fuel', amount: 12 }, { itemId: 'dark_matter_crystal', amount: 4 }],
    outputs: [{ itemId: 'ionized_fuel', amount: 10 }, { itemId: 'compacted_coal', amount: 2 }],
    minPower: 100, maxPower: 400,
  },
};
