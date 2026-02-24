import type { RecipeDef } from '../../types';

export const ASSEMBLER_RECIPES: Record<string, RecipeDef> = {
  // === Standard ===
  reinforced_iron_plate: {
    id: 'reinforced_iron_plate', label: 'Verstärkte Eisenplatte', buildingType: 'assembler', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'iron_plate', amount: 6 }, { itemId: 'screw', amount: 12 }],
    outputs: [{ itemId: 'reinforced_iron_plate', amount: 1 }],
  },
  modular_frame: {
    id: 'modular_frame', label: 'Modularer Rahmen', buildingType: 'assembler', cycleTime: 60, isAlternate: false,
    inputs: [{ itemId: 'reinforced_iron_plate', amount: 3 }, { itemId: 'iron_rod', amount: 12 }],
    outputs: [{ itemId: 'modular_frame', amount: 2 }],
  },
  rotor: {
    id: 'rotor', label: 'Rotor', buildingType: 'assembler', cycleTime: 15, isAlternate: false,
    inputs: [{ itemId: 'iron_rod', amount: 5 }, { itemId: 'screw', amount: 25 }],
    outputs: [{ itemId: 'rotor', amount: 1 }],
  },
  smart_plating: {
    id: 'smart_plating', label: 'Intelligente Beschichtung', buildingType: 'assembler', cycleTime: 30, isAlternate: false,
    inputs: [{ itemId: 'reinforced_iron_plate', amount: 1 }, { itemId: 'rotor', amount: 1 }],
    outputs: [{ itemId: 'smart_plating', amount: 1 }],
  },
  stator: {
    id: 'stator', label: 'Stator', buildingType: 'assembler', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'steel_pipe', amount: 3 }, { itemId: 'wire', amount: 8 }],
    outputs: [{ itemId: 'stator', amount: 1 }],
  },
  motor: {
    id: 'motor', label: 'Motor', buildingType: 'assembler', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'rotor', amount: 2 }, { itemId: 'stator', amount: 2 }],
    outputs: [{ itemId: 'motor', amount: 1 }],
  },
  circuit_board: {
    id: 'circuit_board', label: 'Platine', buildingType: 'assembler', cycleTime: 8, isAlternate: false,
    inputs: [{ itemId: 'copper_sheet', amount: 2 }, { itemId: 'plastic', amount: 4 }],
    outputs: [{ itemId: 'circuit_board', amount: 1 }],
  },
  encased_industrial_beam: {
    id: 'encased_industrial_beam', label: 'Ummantelter Industrieträger', buildingType: 'assembler', cycleTime: 10, isAlternate: false,
    inputs: [{ itemId: 'steel_beam', amount: 3 }, { itemId: 'concrete', amount: 6 }],
    outputs: [{ itemId: 'encased_industrial_beam', amount: 1 }],
  },
  versatile_framework: {
    id: 'versatile_framework', label: 'Mehrzweckgerüst', buildingType: 'assembler', cycleTime: 24, isAlternate: false,
    inputs: [{ itemId: 'modular_frame', amount: 1 }, { itemId: 'steel_beam', amount: 12 }],
    outputs: [{ itemId: 'versatile_framework', amount: 2 }],
  },
  automated_wiring: {
    id: 'automated_wiring', label: 'Automatische Verkabelung', buildingType: 'assembler', cycleTime: 24, isAlternate: false,
    inputs: [{ itemId: 'stator', amount: 1 }, { itemId: 'cable', amount: 20 }],
    outputs: [{ itemId: 'automated_wiring', amount: 1 }],
  },
  ai_limiter: {
    id: 'ai_limiter', label: 'KI-Begrenzer', buildingType: 'assembler', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'copper_sheet', amount: 5 }, { itemId: 'quickwire', amount: 20 }],
    outputs: [{ itemId: 'ai_limiter', amount: 1 }],
  },
  alclad_aluminum_sheet: {
    id: 'alclad_aluminum_sheet', label: 'Alclad-Aluminiumblech', buildingType: 'assembler', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'aluminum_ingot', amount: 3 }, { itemId: 'copper_ingot', amount: 1 }],
    outputs: [{ itemId: 'alclad_aluminum_sheet', amount: 3 }],
  },
  electromagnetic_control_rod: {
    id: 'electromagnetic_control_rod', label: 'Elektromagn. Kontrollstab', buildingType: 'assembler', cycleTime: 30, isAlternate: false,
    inputs: [{ itemId: 'stator', amount: 3 }, { itemId: 'ai_limiter', amount: 2 }],
    outputs: [{ itemId: 'electromagnetic_control_rod', amount: 2 }],
  },
  heat_sink: {
    id: 'heat_sink', label: 'Kühlkörper', buildingType: 'assembler', cycleTime: 8, isAlternate: false,
    inputs: [{ itemId: 'alclad_aluminum_sheet', amount: 5 }, { itemId: 'copper_sheet', amount: 3 }],
    outputs: [{ itemId: 'heat_sink', amount: 1 }],
  },
  assembly_director_system: {
    id: 'assembly_director_system', label: 'Montage-Leitsystem', buildingType: 'assembler', cycleTime: 80, isAlternate: false,
    inputs: [{ itemId: 'adaptive_control_unit', amount: 2 }, { itemId: 'supercomputer', amount: 1 }],
    outputs: [{ itemId: 'assembly_director_system', amount: 1 }],
  },
  pressure_conversion_cube: {
    id: 'pressure_conversion_cube', label: 'Druckumwandlungswürfel', buildingType: 'assembler', cycleTime: 60, isAlternate: false,
    inputs: [{ itemId: 'fused_modular_frame', amount: 1 }, { itemId: 'radio_control_unit', amount: 2 }],
    outputs: [{ itemId: 'pressure_conversion_cube', amount: 1 }],
  },
  magnetic_field_generator: {
    id: 'magnetic_field_generator', label: 'Magnetfeld-Generator', buildingType: 'assembler', cycleTime: 120, isAlternate: false,
    inputs: [{ itemId: 'versatile_framework', amount: 5 }, { itemId: 'electromagnetic_control_rod', amount: 2 }],
    outputs: [{ itemId: 'magnetic_field_generator', amount: 2 }],
  },
  black_powder: {
    id: 'black_powder', label: 'Schwarzpulver', buildingType: 'assembler', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'coal', amount: 1 }, { itemId: 'sulfur', amount: 1 }],
    outputs: [{ itemId: 'black_powder', amount: 2 }],
  },
  nobelisk: {
    id: 'nobelisk', label: 'Nobelisk', buildingType: 'assembler', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'black_powder', amount: 2 }, { itemId: 'steel_pipe', amount: 2 }],
    outputs: [{ itemId: 'nobelisk', amount: 1 }],
  },
  fabric: {
    id: 'fabric', label: 'Stoff', buildingType: 'assembler', cycleTime: 4, isAlternate: false,
    inputs: [{ itemId: 'mycelia', amount: 1 }, { itemId: 'biomass', amount: 5 }],
    outputs: [{ itemId: 'fabric', amount: 1 }],
  },
  encased_plutonium_cell: {
    id: 'encased_plutonium_cell', label: 'Ummantelte Plutoniumzelle', buildingType: 'assembler', cycleTime: 12, isAlternate: false,
    inputs: [{ itemId: 'plutonium_pellet', amount: 2 }, { itemId: 'concrete', amount: 4 }],
    outputs: [{ itemId: 'encased_plutonium_cell', amount: 1 }],
  },

  // === Alternate ===
  alt_adhered_iron_plate: {
    id: 'alt_adhered_iron_plate', label: 'Geklebte Eisenplatte (Alt)', buildingType: 'assembler', cycleTime: 16, isAlternate: true,
    inputs: [{ itemId: 'iron_plate', amount: 3 }, { itemId: 'rubber', amount: 1 }],
    outputs: [{ itemId: 'reinforced_iron_plate', amount: 1 }],
  },
  alt_stitched_iron_plate: {
    id: 'alt_stitched_iron_plate', label: 'Genähte Eisenplatte (Alt)', buildingType: 'assembler', cycleTime: 32, isAlternate: true,
    inputs: [{ itemId: 'iron_plate', amount: 10 }, { itemId: 'wire', amount: 20 }],
    outputs: [{ itemId: 'reinforced_iron_plate', amount: 3 }],
  },
  alt_bolted_iron_plate: {
    id: 'alt_bolted_iron_plate', label: 'Geschraubte Eisenplatte (Alt)', buildingType: 'assembler', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'iron_plate', amount: 18 }, { itemId: 'screw', amount: 50 }],
    outputs: [{ itemId: 'reinforced_iron_plate', amount: 3 }],
  },
  alt_bolted_frame: {
    id: 'alt_bolted_frame', label: 'Geschraubter Rahmen (Alt)', buildingType: 'assembler', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'reinforced_iron_plate', amount: 3 }, { itemId: 'screw', amount: 56 }],
    outputs: [{ itemId: 'modular_frame', amount: 2 }],
  },
  alt_steeled_frame: {
    id: 'alt_steeled_frame', label: 'Stahlrahmen (Alt)', buildingType: 'assembler', cycleTime: 60, isAlternate: true,
    inputs: [{ itemId: 'reinforced_iron_plate', amount: 2 }, { itemId: 'steel_pipe', amount: 10 }],
    outputs: [{ itemId: 'modular_frame', amount: 3 }],
  },
  alt_copper_rotor: {
    id: 'alt_copper_rotor', label: 'Kupferrotor (Alt)', buildingType: 'assembler', cycleTime: 16, isAlternate: true,
    inputs: [{ itemId: 'copper_sheet', amount: 6 }, { itemId: 'screw', amount: 52 }],
    outputs: [{ itemId: 'rotor', amount: 3 }],
  },
  alt_steel_rotor: {
    id: 'alt_steel_rotor', label: 'Stahlrotor (Alt)', buildingType: 'assembler', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'steel_pipe', amount: 2 }, { itemId: 'wire', amount: 6 }],
    outputs: [{ itemId: 'rotor', amount: 1 }],
  },
  alt_electrode_circuit_board: {
    id: 'alt_electrode_circuit_board', label: 'Elektroden-Platine (Alt)', buildingType: 'assembler', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'rubber', amount: 4 }, { itemId: 'petroleum_coke', amount: 8 }],
    outputs: [{ itemId: 'circuit_board', amount: 1 }],
  },
  alt_silicon_circuit_board: {
    id: 'alt_silicon_circuit_board', label: 'Silizium-Platine (Alt)', buildingType: 'assembler', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'copper_sheet', amount: 11 }, { itemId: 'silica', amount: 11 }],
    outputs: [{ itemId: 'circuit_board', amount: 5 }],
  },
  alt_caterium_circuit_board: {
    id: 'alt_caterium_circuit_board', label: 'Caterium-Platine (Alt)', buildingType: 'assembler', cycleTime: 48, isAlternate: true,
    inputs: [{ itemId: 'plastic', amount: 10 }, { itemId: 'quickwire', amount: 30 }],
    outputs: [{ itemId: 'circuit_board', amount: 7 }],
  },
  alt_crystal_computer: {
    id: 'alt_crystal_computer', label: 'Kristallcomputer (Alt)', buildingType: 'assembler', cycleTime: 36, isAlternate: true,
    inputs: [{ itemId: 'circuit_board', amount: 3 }, { itemId: 'crystal_oscillator', amount: 1 }],
    outputs: [{ itemId: 'computer', amount: 2 }],
  },
  alt_encased_industrial_pipe: {
    id: 'alt_encased_industrial_pipe', label: 'Ummanteltes Industrierohr (Alt)', buildingType: 'assembler', cycleTime: 15, isAlternate: true,
    inputs: [{ itemId: 'steel_pipe', amount: 6 }, { itemId: 'concrete', amount: 5 }],
    outputs: [{ itemId: 'encased_industrial_beam', amount: 1 }],
  },
  alt_electric_motor: {
    id: 'alt_electric_motor', label: 'Elektromotor (Alt)', buildingType: 'assembler', cycleTime: 16, isAlternate: true,
    inputs: [{ itemId: 'electromagnetic_control_rod', amount: 1 }, { itemId: 'rotor', amount: 2 }],
    outputs: [{ itemId: 'motor', amount: 2 }],
  },
  alt_electromagnetic_connection_rod: {
    id: 'alt_electromagnetic_connection_rod', label: 'Elektromagn. Verbindungsstab (Alt)', buildingType: 'assembler', cycleTime: 15, isAlternate: true,
    inputs: [{ itemId: 'stator', amount: 2 }, { itemId: 'high_speed_connector', amount: 1 }],
    outputs: [{ itemId: 'electromagnetic_control_rod', amount: 2 }],
  },
  alt_heat_exchanger: {
    id: 'alt_heat_exchanger', label: 'Wärmetauscher (Alt)', buildingType: 'assembler', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'aluminum_casing', amount: 3 }, { itemId: 'rubber', amount: 3 }],
    outputs: [{ itemId: 'heat_sink', amount: 1 }],
  },
  alt_plastic_ai_limiter: {
    id: 'alt_plastic_ai_limiter', label: 'Kunststoff-KI-Begrenzer (Alt)', buildingType: 'assembler', cycleTime: 15, isAlternate: true,
    inputs: [{ itemId: 'quickwire', amount: 30 }, { itemId: 'plastic', amount: 7 }],
    outputs: [{ itemId: 'ai_limiter', amount: 2 }],
  },
  alt_quickwire_stator: {
    id: 'alt_quickwire_stator', label: 'Schnelldraht-Stator (Alt)', buildingType: 'assembler', cycleTime: 15, isAlternate: true,
    inputs: [{ itemId: 'steel_pipe', amount: 4 }, { itemId: 'quickwire', amount: 15 }],
    outputs: [{ itemId: 'stator', amount: 2 }],
  },
  alt_insulated_cable: {
    id: 'alt_insulated_cable', label: 'Isoliertes Kabel (Alt)', buildingType: 'assembler', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'wire', amount: 9 }, { itemId: 'rubber', amount: 6 }],
    outputs: [{ itemId: 'cable', amount: 20 }],
  },
  alt_fused_wire: {
    id: 'alt_fused_wire', label: 'Verschmolzener Draht (Alt)', buildingType: 'assembler', cycleTime: 20, isAlternate: true,
    inputs: [{ itemId: 'copper_ingot', amount: 4 }, { itemId: 'caterium_ingot', amount: 1 }],
    outputs: [{ itemId: 'wire', amount: 30 }],
  },
  alt_fused_quickwire: {
    id: 'alt_fused_quickwire', label: 'Verschmolzener Schnelldraht (Alt)', buildingType: 'assembler', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'caterium_ingot', amount: 1 }, { itemId: 'copper_ingot', amount: 5 }],
    outputs: [{ itemId: 'quickwire', amount: 12 }],
  },
  alt_compacted_coal: {
    id: 'alt_compacted_coal', label: 'Verdichtete Kohle (Alt)', buildingType: 'assembler', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'coal', amount: 5 }, { itemId: 'sulfur', amount: 5 }],
    outputs: [{ itemId: 'compacted_coal', amount: 5 }],
  },
  alt_fine_black_powder: {
    id: 'alt_fine_black_powder', label: 'Feines Schwarzpulver (Alt)', buildingType: 'assembler', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'sulfur', amount: 1 }, { itemId: 'compacted_coal', amount: 2 }],
    outputs: [{ itemId: 'black_powder', amount: 6 }],
  },
  alt_fine_concrete: {
    id: 'alt_fine_concrete', label: 'Feiner Beton (Alt)', buildingType: 'assembler', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'silica', amount: 3 }, { itemId: 'limestone', amount: 12 }],
    outputs: [{ itemId: 'concrete', amount: 10 }],
  },
  alt_rubber_concrete: {
    id: 'alt_rubber_concrete', label: 'Gummi-Beton (Alt)', buildingType: 'assembler', cycleTime: 6, isAlternate: true,
    inputs: [{ itemId: 'limestone', amount: 10 }, { itemId: 'rubber', amount: 2 }],
    outputs: [{ itemId: 'concrete', amount: 9 }],
  },
  alt_coated_iron_plate: {
    id: 'alt_coated_iron_plate', label: 'Beschichtete Eisenplatte (Alt)', buildingType: 'assembler', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'iron_ingot', amount: 5 }, { itemId: 'plastic', amount: 1 }],
    outputs: [{ itemId: 'iron_plate', amount: 10 }],
  },
  alt_coated_iron_canister: {
    id: 'alt_coated_iron_canister', label: 'Beschichteter Eisenkanister (Alt)', buildingType: 'assembler', cycleTime: 4, isAlternate: true,
    inputs: [{ itemId: 'iron_plate', amount: 2 }, { itemId: 'copper_sheet', amount: 1 }],
    outputs: [{ itemId: 'empty_canister', amount: 4 }],
  },
  alt_cheap_silica: {
    id: 'alt_cheap_silica', label: 'Günstiges Silizium (Alt)', buildingType: 'assembler', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'raw_quartz', amount: 3 }, { itemId: 'limestone', amount: 5 }],
    outputs: [{ itemId: 'silica', amount: 7 }],
  },
  alt_alclad_casing: {
    id: 'alt_alclad_casing', label: 'Alclad-Gehäuse (Alt)', buildingType: 'assembler', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'aluminum_ingot', amount: 20 }, { itemId: 'copper_ingot', amount: 10 }],
    outputs: [{ itemId: 'aluminum_casing', amount: 15 }],
  },
  alt_quickwire_cable: {
    id: 'alt_quickwire_cable', label: 'Schnelldrahtkabel (Alt)', buildingType: 'assembler', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'quickwire', amount: 3 }, { itemId: 'rubber', amount: 2 }],
    outputs: [{ itemId: 'cable', amount: 11 }],
  },
  alt_plutonium_fuel_unit: {
    id: 'alt_plutonium_fuel_unit', label: 'Plutonium-Brenneinheit (Alt)', buildingType: 'assembler', cycleTime: 120, isAlternate: true,
    inputs: [{ itemId: 'encased_plutonium_cell', amount: 20 }, { itemId: 'pressure_conversion_cube', amount: 1 }],
    outputs: [{ itemId: 'plutonium_fuel_rod', amount: 1 }],
  },
};
