import type { RecipeDef } from '../../types';

export const MANUFACTURER_RECIPES: Record<string, RecipeDef> = {
  // === Standard ===
  computer: {
    id: 'computer', label: 'Computer', buildingType: 'manufacturer', cycleTime: 24, isAlternate: false,
    inputs: [{ itemId: 'circuit_board', amount: 4 }, { itemId: 'cable', amount: 8 }, { itemId: 'plastic', amount: 16 }],
    outputs: [{ itemId: 'computer', amount: 1 }],
  },
  heavy_modular_frame: {
    id: 'heavy_modular_frame', label: 'Schwerer Modularer Rahmen', buildingType: 'manufacturer', cycleTime: 30, isAlternate: false,
    inputs: [{ itemId: 'modular_frame', amount: 5 }, { itemId: 'steel_pipe', amount: 20 }, { itemId: 'encased_industrial_beam', amount: 5 }, { itemId: 'screw', amount: 120 }],
    outputs: [{ itemId: 'heavy_modular_frame', amount: 1 }],
  },
  crystal_oscillator: {
    id: 'crystal_oscillator', label: 'Quarzoszillator', buildingType: 'manufacturer', cycleTime: 120, isAlternate: false,
    inputs: [{ itemId: 'quartz_crystal', amount: 36 }, { itemId: 'cable', amount: 28 }, { itemId: 'reinforced_iron_plate', amount: 5 }],
    outputs: [{ itemId: 'crystal_oscillator', amount: 2 }],
  },
  high_speed_connector: {
    id: 'high_speed_connector', label: 'Hochgeschwindigkeits-Stecker', buildingType: 'manufacturer', cycleTime: 16, isAlternate: false,
    inputs: [{ itemId: 'quickwire', amount: 56 }, { itemId: 'cable', amount: 10 }, { itemId: 'circuit_board', amount: 1 }],
    outputs: [{ itemId: 'high_speed_connector', amount: 1 }],
  },
  modular_engine: {
    id: 'modular_engine', label: 'Modularer Motor', buildingType: 'manufacturer', cycleTime: 60, isAlternate: false,
    inputs: [{ itemId: 'motor', amount: 2 }, { itemId: 'rubber', amount: 15 }, { itemId: 'smart_plating', amount: 2 }],
    outputs: [{ itemId: 'modular_engine', amount: 1 }],
  },
  supercomputer: {
    id: 'supercomputer', label: 'Supercomputer', buildingType: 'manufacturer', cycleTime: 32, isAlternate: false,
    inputs: [{ itemId: 'computer', amount: 4 }, { itemId: 'ai_limiter', amount: 2 }, { itemId: 'high_speed_connector', amount: 3 }, { itemId: 'plastic', amount: 28 }],
    outputs: [{ itemId: 'supercomputer', amount: 1 }],
  },
  radio_control_unit: {
    id: 'radio_control_unit', label: 'Funksteuereinheit', buildingType: 'manufacturer', cycleTime: 48, isAlternate: false,
    inputs: [{ itemId: 'aluminum_casing', amount: 32 }, { itemId: 'crystal_oscillator', amount: 1 }, { itemId: 'computer', amount: 2 }],
    outputs: [{ itemId: 'radio_control_unit', amount: 2 }],
  },
  adaptive_control_unit: {
    id: 'adaptive_control_unit', label: 'Adaptive Steuereinheit', buildingType: 'manufacturer', cycleTime: 60, isAlternate: false,
    inputs: [{ itemId: 'automated_wiring', amount: 5 }, { itemId: 'circuit_board', amount: 5 }, { itemId: 'heavy_modular_frame', amount: 1 }, { itemId: 'computer', amount: 2 }],
    outputs: [{ itemId: 'adaptive_control_unit', amount: 1 }],
  },
  turbo_motor: {
    id: 'turbo_motor', label: 'Turbomotor', buildingType: 'manufacturer', cycleTime: 32, isAlternate: false,
    inputs: [{ itemId: 'cooling_system', amount: 4 }, { itemId: 'radio_control_unit', amount: 2 }, { itemId: 'motor', amount: 4 }, { itemId: 'rubber', amount: 24 }],
    outputs: [{ itemId: 'turbo_motor', amount: 1 }],
  },
  gas_filter: {
    id: 'gas_filter', label: 'Gasfilter', buildingType: 'manufacturer', cycleTime: 8, isAlternate: false,
    inputs: [{ itemId: 'fabric', amount: 2 }, { itemId: 'coal', amount: 4 }, { itemId: 'iron_plate', amount: 2 }],
    outputs: [{ itemId: 'gas_filter', amount: 1 }],
  },
  iodine_infused_filter: {
    id: 'iodine_infused_filter', label: 'Jodgetränkter Filter', buildingType: 'manufacturer', cycleTime: 16, isAlternate: false,
    inputs: [{ itemId: 'gas_filter', amount: 1 }, { itemId: 'quickwire', amount: 8 }, { itemId: 'aluminum_casing', amount: 1 }],
    outputs: [{ itemId: 'iodine_infused_filter', amount: 1 }],
  },
  sam_fluctuator: {
    id: 'sam_fluctuator', label: 'SAM-Fluktuator', buildingType: 'manufacturer', cycleTime: 6, isAlternate: false,
    inputs: [{ itemId: 'reanimated_sam', amount: 6 }, { itemId: 'wire', amount: 5 }, { itemId: 'steel_pipe', amount: 3 }],
    outputs: [{ itemId: 'sam_fluctuator', amount: 1 }],
  },
  uranium_fuel_rod: {
    id: 'uranium_fuel_rod', label: 'Uran-Brennstab', buildingType: 'manufacturer', cycleTime: 150, isAlternate: false,
    inputs: [{ itemId: 'encased_uranium_cell', amount: 50 }, { itemId: 'encased_industrial_beam', amount: 3 }, { itemId: 'electromagnetic_control_rod', amount: 5 }],
    outputs: [{ itemId: 'uranium_fuel_rod', amount: 1 }],
  },
  plutonium_fuel_rod: {
    id: 'plutonium_fuel_rod', label: 'Plutonium-Brennstab', buildingType: 'manufacturer', cycleTime: 240, isAlternate: false,
    inputs: [{ itemId: 'encased_plutonium_cell', amount: 30 }, { itemId: 'steel_beam', amount: 18 }, { itemId: 'electromagnetic_control_rod', amount: 6 }, { itemId: 'heat_sink', amount: 10 }],
    outputs: [{ itemId: 'plutonium_fuel_rod', amount: 1 }],
  },
  singularity_cell: {
    id: 'singularity_cell', label: 'Singularitätszelle', buildingType: 'manufacturer', cycleTime: 60, isAlternate: false,
    inputs: [{ itemId: 'nuclear_pasta', amount: 1 }, { itemId: 'dark_matter_crystal', amount: 20 }, { itemId: 'iron_plate', amount: 100 }, { itemId: 'concrete', amount: 200 }],
    outputs: [{ itemId: 'singularity_cell', amount: 10 }],
  },
  thermal_propulsion_rocket: {
    id: 'thermal_propulsion_rocket', label: 'Thermaler Raketenantrieb', buildingType: 'manufacturer', cycleTime: 120, isAlternate: false,
    inputs: [{ itemId: 'modular_engine', amount: 5 }, { itemId: 'turbo_motor', amount: 2 }, { itemId: 'cooling_system', amount: 6 }, { itemId: 'fused_modular_frame', amount: 2 }],
    outputs: [{ itemId: 'thermal_propulsion_rocket', amount: 2 }],
  },
  ballistic_warp_drive: {
    id: 'ballistic_warp_drive', label: 'Ballistischer Warpantrieb', buildingType: 'manufacturer', cycleTime: 60, isAlternate: false,
    inputs: [{ itemId: 'thermal_propulsion_rocket', amount: 1 }, { itemId: 'singularity_cell', amount: 5 }, { itemId: 'superposition_oscillator', amount: 2 }, { itemId: 'dark_matter_crystal', amount: 40 }],
    outputs: [{ itemId: 'ballistic_warp_drive', amount: 1 }],
  },

  // === Alternate ===
  alt_caterium_computer: {
    id: 'alt_caterium_computer', label: 'Caterium-Computer (Alt)', buildingType: 'manufacturer', cycleTime: 16, isAlternate: true,
    inputs: [{ itemId: 'circuit_board', amount: 4 }, { itemId: 'quickwire', amount: 14 }, { itemId: 'rubber', amount: 6 }],
    outputs: [{ itemId: 'computer', amount: 1 }],
  },
  alt_heavy_encased_frame: {
    id: 'alt_heavy_encased_frame', label: 'Schwerer ummantelter Rahmen (Alt)', buildingType: 'manufacturer', cycleTime: 64, isAlternate: true,
    inputs: [{ itemId: 'modular_frame', amount: 8 }, { itemId: 'encased_industrial_beam', amount: 10 }, { itemId: 'steel_pipe', amount: 36 }, { itemId: 'concrete', amount: 22 }],
    outputs: [{ itemId: 'heavy_modular_frame', amount: 3 }],
  },
  alt_heavy_flexible_frame: {
    id: 'alt_heavy_flexible_frame', label: 'Schwerer flexibler Rahmen (Alt)', buildingType: 'manufacturer', cycleTime: 16, isAlternate: true,
    inputs: [{ itemId: 'modular_frame', amount: 5 }, { itemId: 'encased_industrial_beam', amount: 3 }, { itemId: 'rubber', amount: 20 }, { itemId: 'screw', amount: 104 }],
    outputs: [{ itemId: 'heavy_modular_frame', amount: 1 }],
  },
  alt_insulated_crystal_oscillator: {
    id: 'alt_insulated_crystal_oscillator', label: 'Isolierter Quarzoszillator (Alt)', buildingType: 'manufacturer', cycleTime: 32, isAlternate: true,
    inputs: [{ itemId: 'quartz_crystal', amount: 10 }, { itemId: 'rubber', amount: 7 }, { itemId: 'ai_limiter', amount: 1 }],
    outputs: [{ itemId: 'crystal_oscillator', amount: 1 }],
  },
  alt_flexible_framework: {
    id: 'alt_flexible_framework', label: 'Flexibles Mehrzweckgerüst (Alt)', buildingType: 'manufacturer', cycleTime: 16, isAlternate: true,
    inputs: [{ itemId: 'modular_frame', amount: 1 }, { itemId: 'steel_beam', amount: 6 }, { itemId: 'rubber', amount: 8 }],
    outputs: [{ itemId: 'versatile_framework', amount: 2 }],
  },
  alt_automated_speed_wiring: {
    id: 'alt_automated_speed_wiring', label: 'Automatische Schnellverkabelung (Alt)', buildingType: 'manufacturer', cycleTime: 32, isAlternate: true,
    inputs: [{ itemId: 'stator', amount: 2 }, { itemId: 'wire', amount: 40 }, { itemId: 'high_speed_connector', amount: 1 }],
    outputs: [{ itemId: 'automated_wiring', amount: 4 }],
  },
  alt_classic_battery: {
    id: 'alt_classic_battery', label: 'Klassische Batterie (Alt)', buildingType: 'manufacturer', cycleTime: 8, isAlternate: true,
    inputs: [{ itemId: 'sulfur', amount: 6 }, { itemId: 'alclad_aluminum_sheet', amount: 7 }, { itemId: 'plastic', amount: 8 }, { itemId: 'wire', amount: 12 }],
    outputs: [{ itemId: 'battery', amount: 4 }],
  },
  alt_plastic_smart_plating: {
    id: 'alt_plastic_smart_plating', label: 'Kunststoff-Beschichtung (Alt)', buildingType: 'manufacturer', cycleTime: 24, isAlternate: true,
    inputs: [{ itemId: 'reinforced_iron_plate', amount: 1 }, { itemId: 'rotor', amount: 1 }, { itemId: 'plastic', amount: 3 }],
    outputs: [{ itemId: 'smart_plating', amount: 2 }],
  },
  alt_radio_connection_unit: {
    id: 'alt_radio_connection_unit', label: 'Funk-Verbindungseinheit (Alt)', buildingType: 'manufacturer', cycleTime: 16, isAlternate: true,
    inputs: [{ itemId: 'heat_sink', amount: 4 }, { itemId: 'high_speed_connector', amount: 2 }, { itemId: 'quartz_crystal', amount: 12 }],
    outputs: [{ itemId: 'radio_control_unit', amount: 1 }],
  },
  alt_radio_control_system: {
    id: 'alt_radio_control_system', label: 'Funk-Kontrollsystem (Alt)', buildingType: 'manufacturer', cycleTime: 40, isAlternate: true,
    inputs: [{ itemId: 'crystal_oscillator', amount: 1 }, { itemId: 'circuit_board', amount: 10 }, { itemId: 'aluminum_casing', amount: 60 }, { itemId: 'rubber', amount: 30 }],
    outputs: [{ itemId: 'radio_control_unit', amount: 3 }],
  },
  alt_rigor_motor: {
    id: 'alt_rigor_motor', label: 'Starrer Motor (Alt)', buildingType: 'manufacturer', cycleTime: 48, isAlternate: true,
    inputs: [{ itemId: 'rotor', amount: 3 }, { itemId: 'stator', amount: 3 }, { itemId: 'crystal_oscillator', amount: 1 }],
    outputs: [{ itemId: 'motor', amount: 6 }],
  },
  alt_silicon_hsc: {
    id: 'alt_silicon_hsc', label: 'Silizium-HSC (Alt)', buildingType: 'manufacturer', cycleTime: 40, isAlternate: true,
    inputs: [{ itemId: 'quickwire', amount: 60 }, { itemId: 'silica', amount: 25 }, { itemId: 'circuit_board', amount: 2 }],
    outputs: [{ itemId: 'high_speed_connector', amount: 2 }],
  },
  alt_super_state_computer: {
    id: 'alt_super_state_computer', label: 'Super-State-Computer (Alt)', buildingType: 'manufacturer', cycleTime: 25, isAlternate: true,
    inputs: [{ itemId: 'computer', amount: 3 }, { itemId: 'electromagnetic_control_rod', amount: 1 }, { itemId: 'battery', amount: 10 }, { itemId: 'wire', amount: 25 }],
    outputs: [{ itemId: 'supercomputer', amount: 1 }],
  },
  alt_turbo_electric_motor: {
    id: 'alt_turbo_electric_motor', label: 'Turbo-Elektromotor (Alt)', buildingType: 'manufacturer', cycleTime: 64, isAlternate: true,
    inputs: [{ itemId: 'motor', amount: 7 }, { itemId: 'radio_control_unit', amount: 9 }, { itemId: 'electromagnetic_control_rod', amount: 5 }, { itemId: 'rotor', amount: 7 }],
    outputs: [{ itemId: 'turbo_motor', amount: 3 }],
  },
  alt_turbo_pressure_motor: {
    id: 'alt_turbo_pressure_motor', label: 'Turbo-Druckmotor (Alt)', buildingType: 'manufacturer', cycleTime: 32, isAlternate: true,
    inputs: [{ itemId: 'motor', amount: 4 }, { itemId: 'pressure_conversion_cube', amount: 1 }, { itemId: 'packaged_nitrogen_gas', amount: 24 }, { itemId: 'stator', amount: 8 }],
    outputs: [{ itemId: 'turbo_motor', amount: 2 }],
  },
  alt_infused_uranium_cell: {
    id: 'alt_infused_uranium_cell', label: 'Infundierte Uranzelle (Alt)', buildingType: 'manufacturer', cycleTime: 12, isAlternate: true,
    inputs: [{ itemId: 'uranium', amount: 5 }, { itemId: 'silica', amount: 3 }, { itemId: 'sulfur', amount: 5 }, { itemId: 'quickwire', amount: 15 }],
    outputs: [{ itemId: 'encased_uranium_cell', amount: 4 }],
  },
  alt_uranium_fuel_unit: {
    id: 'alt_uranium_fuel_unit', label: 'Uran-Brenneinheit (Alt)', buildingType: 'manufacturer', cycleTime: 300, isAlternate: true,
    inputs: [{ itemId: 'encased_uranium_cell', amount: 100 }, { itemId: 'electromagnetic_control_rod', amount: 10 }, { itemId: 'crystal_oscillator', amount: 3 }, { itemId: 'rotor', amount: 10 }],
    outputs: [{ itemId: 'uranium_fuel_rod', amount: 3 }],
  },
};
