import type { RecipeDef } from '../../types';

export const PARTICLE_ACCELERATOR_RECIPES: Record<string, RecipeDef> = {
  // === Standard ===
  diamonds: {
    id: 'diamonds', label: 'Diamanten', buildingType: 'particle_accelerator', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'coal', amount: 20 }], outputs: [{ itemId: 'diamonds', amount: 1 }],
    minPower: 250, maxPower: 750,
  },
  dark_matter_crystal: {
    id: 'dark_matter_crystal', label: 'Dunkle-Materie-Kristall', buildingType: 'particle_accelerator', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'diamonds', amount: 1 }],
    outputs: [{ itemId: 'dark_matter_crystal', amount: 1 }, { itemId: 'dark_matter_residue', amount: 5 }],
    minPower: 500, maxPower: 1500,
  },
  nuclear_pasta: {
    id: 'nuclear_pasta', label: 'Nukleare Pasta', buildingType: 'particle_accelerator', cycleTime: 120, isAlternate: false,
    inputs: [{ itemId: 'copper_powder', amount: 200 }, { itemId: 'pressure_conversion_cube', amount: 1 }],
    outputs: [{ itemId: 'nuclear_pasta', amount: 1 }],
    minPower: 500, maxPower: 1500,
  },
  plutonium_pellet: {
    id: 'plutonium_pellet', label: 'Plutonium-Pellet', buildingType: 'particle_accelerator', cycleTime: 60, isAlternate: false,
    inputs: [{ itemId: 'non_fissile_uranium', amount: 100 }, { itemId: 'uranium_waste', amount: 25 }],
    outputs: [{ itemId: 'plutonium_pellet', amount: 30 }],
    minPower: 250, maxPower: 750,
  },
  ficsonium: {
    id: 'ficsonium', label: 'Ficsonium', buildingType: 'particle_accelerator', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'plutonium_waste', amount: 1 }, { itemId: 'singularity_cell', amount: 1 }, { itemId: 'dark_matter_residue', amount: 20 }],
    outputs: [{ itemId: 'ficsonium', amount: 1 }],
    minPower: 500, maxPower: 1500,
  },
  // === Alternate ===
  alt_cloudy_diamonds: {
    id: 'alt_cloudy_diamonds', label: 'Trübe Diamanten (Alt)', buildingType: 'particle_accelerator', cycleTime: 3, isAlternate: true,
    inputs: [{ itemId: 'coal', amount: 12 }, { itemId: 'limestone', amount: 24 }],
    outputs: [{ itemId: 'diamonds', amount: 1 }],
    minPower: 250, maxPower: 750,
  },
  alt_oil_based_diamonds: {
    id: 'alt_oil_based_diamonds', label: 'Ölbasierte Diamanten (Alt)', buildingType: 'particle_accelerator', cycleTime: 3, isAlternate: true,
    inputs: [{ itemId: 'crude_oil', amount: 10 }],
    outputs: [{ itemId: 'diamonds', amount: 2 }],
    minPower: 250, maxPower: 750,
  },
  alt_petroleum_diamonds: {
    id: 'alt_petroleum_diamonds', label: 'Petroleum-Diamanten (Alt)', buildingType: 'particle_accelerator', cycleTime: 2, isAlternate: true,
    inputs: [{ itemId: 'petroleum_coke', amount: 24 }],
    outputs: [{ itemId: 'diamonds', amount: 1 }],
    minPower: 250, maxPower: 750,
  },
  alt_turbo_diamonds: {
    id: 'alt_turbo_diamonds', label: 'Turbo-Diamanten (Alt)', buildingType: 'particle_accelerator', cycleTime: 3, isAlternate: true,
    inputs: [{ itemId: 'coal', amount: 30 }, { itemId: 'packaged_turbofuel', amount: 2 }],
    outputs: [{ itemId: 'diamonds', amount: 3 }],
    minPower: 250, maxPower: 750,
  },
  alt_dark_matter_crystallization: {
    id: 'alt_dark_matter_crystallization', label: 'Dunkle-Materie-Kristallisation (Alt)', buildingType: 'particle_accelerator', cycleTime: 3, isAlternate: true,
    inputs: [{ itemId: 'dark_matter_residue', amount: 10 }],
    outputs: [{ itemId: 'dark_matter_crystal', amount: 1 }],
    minPower: 500, maxPower: 1500,
  },
  alt_dark_matter_trap: {
    id: 'alt_dark_matter_trap', label: 'Dunkle-Materie-Falle (Alt)', buildingType: 'particle_accelerator', cycleTime: 2, isAlternate: true,
    inputs: [{ itemId: 'time_crystal', amount: 1 }, { itemId: 'dark_matter_residue', amount: 5 }],
    outputs: [{ itemId: 'dark_matter_crystal', amount: 2 }],
    minPower: 500, maxPower: 1500,
  },
  alt_instant_plutonium_cell: {
    id: 'alt_instant_plutonium_cell', label: 'Sofort-Plutoniumzelle (Alt)', buildingType: 'particle_accelerator', cycleTime: 120, isAlternate: true,
    inputs: [{ itemId: 'non_fissile_uranium', amount: 150 }, { itemId: 'aluminum_casing', amount: 20 }],
    outputs: [{ itemId: 'encased_plutonium_cell', amount: 20 }],
    minPower: 250, maxPower: 750,
  },
};
