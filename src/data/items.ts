import type { ItemDef } from '../types';

export const ITEMS: Record<string, ItemDef> = {
  // Ores
  iron_ore: { id: 'iron_ore', label: 'Eisenerz' },
  copper_ore: { id: 'copper_ore', label: 'Kupfererz' },
  limestone: { id: 'limestone', label: 'Kalkstein' },
  coal: { id: 'coal', label: 'Kohle' },
  caterium_ore: { id: 'caterium_ore', label: 'Caterium-Erz' },
  bauxite: { id: 'bauxite', label: 'Bauxit' },
  raw_quartz: { id: 'raw_quartz', label: 'Rohquarz' },
  sulfur: { id: 'sulfur', label: 'Schwefel' },
  uranium: { id: 'uranium', label: 'Uran' },

  // Ingots
  iron_ingot: { id: 'iron_ingot', label: 'Eisenbarren' },
  copper_ingot: { id: 'copper_ingot', label: 'Kupferbarren' },
  steel_ingot: { id: 'steel_ingot', label: 'Stahlbarren' },
  caterium_ingot: { id: 'caterium_ingot', label: 'Caterium-Barren' },
  aluminum_ingot: { id: 'aluminum_ingot', label: 'Aluminiumbarren' },

  // Basic parts
  iron_plate: { id: 'iron_plate', label: 'Eisenplatte' },
  iron_rod: { id: 'iron_rod', label: 'Eisenstange' },
  copper_sheet: { id: 'copper_sheet', label: 'Kupferblech' },
  wire: { id: 'wire', label: 'Draht' },
  cable: { id: 'cable', label: 'Kabel' },
  concrete: { id: 'concrete', label: 'Beton' },
  screw: { id: 'screw', label: 'Schraube' },
  steel_beam: { id: 'steel_beam', label: 'Stahlträger' },
  steel_pipe: { id: 'steel_pipe', label: 'Stahlrohr' },

  // Intermediate parts
  reinforced_iron_plate: { id: 'reinforced_iron_plate', label: 'Verstärkte Eisenplatte' },
  modular_frame: { id: 'modular_frame', label: 'Modularer Rahmen' },
  rotor: { id: 'rotor', label: 'Rotor' },
  smart_plating: { id: 'smart_plating', label: 'Intelligente Platte' },
  stator: { id: 'stator', label: 'Stator' },
  motor: { id: 'motor', label: 'Motor' },
  encased_industrial_beam: { id: 'encased_industrial_beam', label: 'Ummantelter Industrieträger' },
  heavy_modular_frame: { id: 'heavy_modular_frame', label: 'Schwerer Modularer Rahmen' },
  versatile_framework: { id: 'versatile_framework', label: 'Vielseitiges Rahmenwerk' },
  automated_wiring: { id: 'automated_wiring', label: 'Automatische Verkabelung' },

  // Electronics
  quickwire: { id: 'quickwire', label: 'Schnelldraht' },
  circuit_board: { id: 'circuit_board', label: 'Leiterplatte' },
  computer: { id: 'computer', label: 'Computer' },
  high_speed_connector: { id: 'high_speed_connector', label: 'Hochgeschwindigkeits-Stecker' },
  modular_engine: { id: 'modular_engine', label: 'Modularer Motor' },

  // Quartz
  quartz_crystal: { id: 'quartz_crystal', label: 'Quarzkristall' },
  silica: { id: 'silica', label: 'Silikon' },

  // Oil chain
  crude_oil: { id: 'crude_oil', label: 'Rohöl' },
  plastic: { id: 'plastic', label: 'Plastik' },
  rubber: { id: 'rubber', label: 'Gummi' },
  fuel: { id: 'fuel', label: 'Treibstoff' },
  heavy_oil_residue: { id: 'heavy_oil_residue', label: 'Schweres Ölrückstand' },
  polymer_resin: { id: 'polymer_resin', label: 'Polymerharz' },
  petroleum_coke: { id: 'petroleum_coke', label: 'Petrolkoks' },
  water: { id: 'water', label: 'Wasser' },

  // Aluminum chain
  aluminum_casing: { id: 'aluminum_casing', label: 'Aluminiumgehäuse' },
  aluminum_scrap: { id: 'aluminum_scrap', label: 'Aluminiumschrott' },
  alumina_solution: { id: 'alumina_solution', label: 'Aluminiumoxid-Lösung' },

  // Packaging
  empty_canister: { id: 'empty_canister', label: 'Leerer Kanister' },
  packaged_water: { id: 'packaged_water', label: 'Verpacktes Wasser' },
};
