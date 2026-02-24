// === Building Types ===

export type BuildingType =
  | 'miner'
  | 'smelter'
  | 'constructor'
  | 'assembler'
  | 'foundry'
  | 'splitter'
  | 'merger';

export type MkLevel = 1 | 2 | 3;

export type Purity = 'impure' | 'normal' | 'pure';

export interface Port {
  id: string;
  type: 'input' | 'output';
  index: number;
}

export interface PlacedBuilding {
  id: string;
  type: BuildingType;
  gridX: number;
  gridY: number;
  mkLevel: MkLevel;
  overclock: number; // 1-250
  purity: Purity; // only relevant for miners
  recipeId: string | null;
}

// === Connection Types ===

export type BeltMk = 1 | 2 | 3 | 4 | 5 | 6;

export interface Connection {
  id: string;
  fromBuildingId: string;
  fromPortIndex: number;
  toBuildingId: string;
  toPortIndex: number;
  beltMk: BeltMk;
}

// === Game Data Types ===

export interface BuildingDef {
  type: BuildingType;
  label: string;
  description: string;
  basePower: number; // MW
  maxMkLevel: MkLevel;
  inputCount: number;
  outputCount: number;
  isLogistics: boolean;
  gridWidth: number;
  gridHeight: number;
}

export interface ItemDef {
  id: string;
  label: string;
}

export interface RecipeInput {
  itemId: string;
  amount: number; // per cycle
}

export interface RecipeOutput {
  itemId: string;
  amount: number; // per cycle
}

export interface RecipeDef {
  id: string;
  label: string;
  buildingType: BuildingType;
  cycleTime: number; // seconds
  inputs: RecipeInput[];
  outputs: RecipeOutput[];
}

export interface BeltDef {
  mk: BeltMk;
  label: string;
  throughput: number; // items/min
}

// === Factory Layout (Export/Import) ===

export interface FactoryLayout {
  version: 1;
  buildings: PlacedBuilding[];
  connections: Connection[];
}

// === UI State ===

export type PlacementMode =
  | { kind: 'building'; buildingType: BuildingType }
  | { kind: 'belt'; beltMk: BeltMk };

export interface ConnectionDraft {
  fromBuildingId: string;
  fromPortIndex: number;
}

// === Calculation Results ===

export interface ProductionRate {
  itemId: string;
  rate: number; // items/min
}

export interface BuildingProduction {
  buildingId: string;
  inputs: ProductionRate[];
  outputs: ProductionRate[];
  power: number; // MW
}
