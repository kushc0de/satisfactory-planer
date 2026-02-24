import type { RecipeDef } from '../../types';

export const PACKAGER_RECIPES: Record<string, RecipeDef> = {
  // === Pack ===
  packaged_water: {
    id: 'packaged_water', label: 'Verpacktes Wasser', buildingType: 'packager', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'water', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
    outputs: [{ itemId: 'packaged_water', amount: 2 }],
  },
  packaged_fuel: {
    id: 'packaged_fuel', label: 'Verpackter Treibstoff', buildingType: 'packager', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'fuel', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
    outputs: [{ itemId: 'packaged_fuel', amount: 2 }],
  },
  packaged_oil: {
    id: 'packaged_oil', label: 'Verpacktes Rohöl', buildingType: 'packager', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'crude_oil', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
    outputs: [{ itemId: 'packaged_oil', amount: 2 }],
  },
  packaged_heavy_oil_residue: {
    id: 'packaged_heavy_oil_residue', label: 'Verpacktes Schweres Ölrückstand', buildingType: 'packager', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'heavy_oil_residue', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
    outputs: [{ itemId: 'packaged_heavy_oil_residue', amount: 2 }],
  },
  packaged_alumina_solution: {
    id: 'packaged_alumina_solution', label: 'Verpackte Aluminiumoxid-Lösung', buildingType: 'packager', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'alumina_solution', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
    outputs: [{ itemId: 'packaged_alumina_solution', amount: 2 }],
  },
  packaged_sulfuric_acid: {
    id: 'packaged_sulfuric_acid', label: 'Verpackte Schwefelsäure', buildingType: 'packager', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'sulfuric_acid', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
    outputs: [{ itemId: 'packaged_sulfuric_acid', amount: 2 }],
  },
  packaged_liquid_biofuel: {
    id: 'packaged_liquid_biofuel', label: 'Verpackter Flüssiger Biobrennstoff', buildingType: 'packager', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'liquid_biofuel', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
    outputs: [{ itemId: 'packaged_liquid_biofuel', amount: 2 }],
  },
  packaged_turbofuel: {
    id: 'packaged_turbofuel', label: 'Verpackter Turbotreibstoff', buildingType: 'packager', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'turbofuel', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
    outputs: [{ itemId: 'packaged_turbofuel', amount: 2 }],
  },
  packaged_nitrogen_gas: {
    id: 'packaged_nitrogen_gas', label: 'Verpacktes Stickstoffgas', buildingType: 'packager', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'nitrogen_gas', amount: 4 }, { itemId: 'empty_fluid_tank', amount: 1 }],
    outputs: [{ itemId: 'packaged_nitrogen_gas', amount: 1 }],
  },
  packaged_nitric_acid: {
    id: 'packaged_nitric_acid', label: 'Verpackte Salpetersäure', buildingType: 'packager', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'nitric_acid', amount: 1 }, { itemId: 'empty_fluid_tank', amount: 1 }],
    outputs: [{ itemId: 'packaged_nitric_acid', amount: 1 }],
  },
  packaged_rocket_fuel: {
    id: 'packaged_rocket_fuel', label: 'Verpackter Raketentreibstoff', buildingType: 'packager', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'rocket_fuel', amount: 2 }, { itemId: 'empty_fluid_tank', amount: 1 }],
    outputs: [{ itemId: 'packaged_rocket_fuel', amount: 1 }],
  },
  packaged_ionized_fuel: {
    id: 'packaged_ionized_fuel', label: 'Verpackter Ionisierter Treibstoff', buildingType: 'packager', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'ionized_fuel', amount: 4 }, { itemId: 'empty_fluid_tank', amount: 2 }],
    outputs: [{ itemId: 'packaged_ionized_fuel', amount: 2 }],
  },
  // === Unpack ===
  unpackage_water: {
    id: 'unpackage_water', label: 'Wasser entpacken', buildingType: 'packager', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'packaged_water', amount: 2 }],
    outputs: [{ itemId: 'water', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
  },
  unpackage_fuel: {
    id: 'unpackage_fuel', label: 'Treibstoff entpacken', buildingType: 'packager', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'packaged_fuel', amount: 2 }],
    outputs: [{ itemId: 'fuel', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
  },
  unpackage_oil: {
    id: 'unpackage_oil', label: 'Rohöl entpacken', buildingType: 'packager', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'packaged_oil', amount: 2 }],
    outputs: [{ itemId: 'crude_oil', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
  },
  unpackage_heavy_oil_residue: {
    id: 'unpackage_heavy_oil_residue', label: 'Schweres Ölrückstand entpacken', buildingType: 'packager', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'packaged_heavy_oil_residue', amount: 2 }],
    outputs: [{ itemId: 'heavy_oil_residue', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
  },
  unpackage_alumina_solution: {
    id: 'unpackage_alumina_solution', label: 'Aluminiumoxid-Lösung entpacken', buildingType: 'packager', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'packaged_alumina_solution', amount: 2 }],
    outputs: [{ itemId: 'alumina_solution', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
  },
  unpackage_sulfuric_acid: {
    id: 'unpackage_sulfuric_acid', label: 'Schwefelsäure entpacken', buildingType: 'packager', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'packaged_sulfuric_acid', amount: 2 }],
    outputs: [{ itemId: 'sulfuric_acid', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
  },
  unpackage_liquid_biofuel: {
    id: 'unpackage_liquid_biofuel', label: 'Flüssigen Biobrennstoff entpacken', buildingType: 'packager', cycleTime: 2, isAlternate: false,
    inputs: [{ itemId: 'packaged_liquid_biofuel', amount: 2 }],
    outputs: [{ itemId: 'liquid_biofuel', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
  },
  unpackage_turbofuel: {
    id: 'unpackage_turbofuel', label: 'Turbotreibstoff entpacken', buildingType: 'packager', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'packaged_turbofuel', amount: 2 }],
    outputs: [{ itemId: 'turbofuel', amount: 2 }, { itemId: 'empty_canister', amount: 2 }],
  },
  unpackage_nitrogen_gas: {
    id: 'unpackage_nitrogen_gas', label: 'Stickstoffgas entpacken', buildingType: 'packager', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'packaged_nitrogen_gas', amount: 1 }],
    outputs: [{ itemId: 'nitrogen_gas', amount: 4 }, { itemId: 'empty_fluid_tank', amount: 1 }],
  },
  unpackage_nitric_acid: {
    id: 'unpackage_nitric_acid', label: 'Salpetersäure entpacken', buildingType: 'packager', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'packaged_nitric_acid', amount: 1 }],
    outputs: [{ itemId: 'nitric_acid', amount: 1 }, { itemId: 'empty_fluid_tank', amount: 1 }],
  },
  unpackage_rocket_fuel: {
    id: 'unpackage_rocket_fuel', label: 'Raketentreibstoff entpacken', buildingType: 'packager', cycleTime: 1, isAlternate: false,
    inputs: [{ itemId: 'packaged_rocket_fuel', amount: 1 }],
    outputs: [{ itemId: 'rocket_fuel', amount: 2 }, { itemId: 'empty_fluid_tank', amount: 1 }],
  },
  unpackage_ionized_fuel: {
    id: 'unpackage_ionized_fuel', label: 'Ionisierten Treibstoff entpacken', buildingType: 'packager', cycleTime: 3, isAlternate: false,
    inputs: [{ itemId: 'packaged_ionized_fuel', amount: 2 }],
    outputs: [{ itemId: 'ionized_fuel', amount: 4 }, { itemId: 'empty_fluid_tank', amount: 2 }],
  },
};
