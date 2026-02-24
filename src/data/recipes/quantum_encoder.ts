import type { RecipeDef } from '../../types';

export const QUANTUM_ENCODER_RECIPES: Record<string, RecipeDef> = {
  superposition_oscillator: {
    id: 'superposition_oscillator', label: 'Superpositions-Oszillator', buildingType: 'quantum_encoder', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'dark_matter_crystal', amount: 6 }, { itemId: 'crystal_oscillator', amount: 1 }, { itemId: 'alclad_aluminum_sheet', amount: 9 }, { itemId: 'excited_photonic_matter', amount: 25 }],
    outputs: [{ itemId: 'superposition_oscillator', amount: 1 }, { itemId: 'dark_matter_residue', amount: 25 }],
    minPower: 0, maxPower: 2000,
  },
  neural_quantum_processor: {
    id: 'neural_quantum_processor', label: 'Neuraler Quantenprozessor', buildingType: 'quantum_encoder', cycleTime: 20, isAlternate: false,
    inputs: [{ itemId: 'time_crystal', amount: 5 }, { itemId: 'supercomputer', amount: 1 }, { itemId: 'ficsite_trigon', amount: 15 }, { itemId: 'excited_photonic_matter', amount: 25 }],
    outputs: [{ itemId: 'neural_quantum_processor', amount: 1 }, { itemId: 'dark_matter_residue', amount: 25 }],
    minPower: 0, maxPower: 2000,
  },
  ai_expansion_server: {
    id: 'ai_expansion_server', label: 'KI-Erweiterungsserver', buildingType: 'quantum_encoder', cycleTime: 15, isAlternate: false,
    inputs: [{ itemId: 'magnetic_field_generator', amount: 1 }, { itemId: 'neural_quantum_processor', amount: 1 }, { itemId: 'superposition_oscillator', amount: 1 }, { itemId: 'excited_photonic_matter', amount: 25 }],
    outputs: [{ itemId: 'ai_expansion_server', amount: 1 }, { itemId: 'dark_matter_residue', amount: 25 }],
    minPower: 0, maxPower: 2000,
  },
  alien_power_matrix: {
    id: 'alien_power_matrix', label: 'Alien-Energiematrix', buildingType: 'quantum_encoder', cycleTime: 24, isAlternate: false,
    inputs: [{ itemId: 'sam_fluctuator', amount: 5 }, { itemId: 'power_shard', amount: 3 }, { itemId: 'superposition_oscillator', amount: 3 }, { itemId: 'excited_photonic_matter', amount: 24 }],
    outputs: [{ itemId: 'alien_power_matrix', amount: 1 }, { itemId: 'dark_matter_residue', amount: 24 }],
    minPower: 0, maxPower: 2000,
  },
  ficsonium_fuel_rod: {
    id: 'ficsonium_fuel_rod', label: 'Ficsonium-Brennstab', buildingType: 'quantum_encoder', cycleTime: 24, isAlternate: false,
    inputs: [{ itemId: 'ficsonium', amount: 2 }, { itemId: 'electromagnetic_control_rod', amount: 2 }, { itemId: 'ficsite_trigon', amount: 40 }, { itemId: 'excited_photonic_matter', amount: 20 }],
    outputs: [{ itemId: 'ficsonium_fuel_rod', amount: 1 }, { itemId: 'dark_matter_residue', amount: 20 }],
    minPower: 0, maxPower: 2000,
  },
  synthetic_power_shard: {
    id: 'synthetic_power_shard', label: 'Synthetischer Energiekristall', buildingType: 'quantum_encoder', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'time_crystal', amount: 2 }, { itemId: 'dark_matter_crystal', amount: 2 }, { itemId: 'quartz_crystal', amount: 12 }, { itemId: 'excited_photonic_matter', amount: 12 }],
    outputs: [{ itemId: 'power_shard', amount: 1 }, { itemId: 'dark_matter_residue', amount: 12 }],
    minPower: 0, maxPower: 2000,
  },
};
