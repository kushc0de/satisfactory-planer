// === Building Types ===

export type BuildingType =
  | 'miner'
  | 'smelter'
  | 'constructor'
  | 'assembler'
  | 'foundry'
  | 'splitter'
  | 'merger'
  | 'manufacturer'
  | 'refinery'
  | 'packager'
  | 'blender'
  | 'particle_accelerator'
  | 'converter'
  | 'quantum_encoder'
  | 'water_extractor'
  | 'oil_extractor'
  | 'coal_generator'
  | 'fuel_generator'
  | 'nuclear_power_plant'
  | 'biomass_burner'
  | 'geothermal_generator'
  | 'awesome_sink'
  | 'storage_container'
  | 'fluid_buffer'
  | 'pipeline_junction';

export type MkLevel = 1 | 2 | 3;

export type Purity = 'impure' | 'normal' | 'pure';

export type Rotation = 0 | 90 | 180 | 270;

export type PortSide = 'top' | 'right' | 'bottom' | 'left';

export type PortCategory = 'conveyor' | 'pipe';

export interface PortDefinition {
  type: 'input' | 'output';
  side: PortSide;
  category: PortCategory;
  /** 0–1 fractional offset along the side (0 = start, 1 = end) */
  offset: number;
}

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
  rotation: Rotation;
  oreType: string | null;
}

// === Connection Types ===

export type BeltMk = 1 | 2 | 3 | 4 | 5 | 6;

export type PipeMk = 1 | 2;

export type ConnectionKind = 'belt' | 'pipe';

export interface Connection {
  id: string;
  fromBuildingId: string;
  fromPortIndex: number;
  toBuildingId: string;
  toPortIndex: number;
  beltMk: BeltMk;
  pipeMk: PipeMk;
  connectionKind: ConnectionKind;
}

// === Game Data Types ===

export type PowerType = 'consumer' | 'producer' | 'none';

export interface BuildingDef {
  type: BuildingType;
  label: string;
  description: string;
  basePower: number; // MW (base for consumers, generated for producers)
  /** For buildings with MK-dependent power (e.g. miners): power per MK level */
  powerPerMk?: Record<number, number>;
  /** For variable-power buildings (PA, Converter, QE): min/max per recipe is stored on RecipeDef */
  maxMkLevel: MkLevel;
  ports: PortDefinition[];
  isLogistics: boolean;
  gridWidth: number;
  gridHeight: number;
  category: 'extraction' | 'smelting' | 'production' | 'processing' | 'logistics' | 'power' | 'storage';
  powerType: PowerType;
}

export interface ItemDef {
  id: string;
  label: string;
  isFluid: boolean;
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
  isAlternate: boolean;
  /** For variable-power buildings: min power MW */
  minPower?: number;
  /** For variable-power buildings: max power MW */
  maxPower?: number;
}

export interface BeltDef {
  mk: BeltMk;
  label: string;
  throughput: number; // items/min
}

export interface PipeDef {
  mk: PipeMk;
  label: string;
  throughput: number; // m³/min
}

// === Factory Layout (Export/Import) ===

export interface FactoryLayout {
  version: number;
  buildings: PlacedBuilding[];
  connections: Connection[];
  projectName?: string;
}

// === Project Management ===

export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  buildingCount: number;
}

export interface ProjectData {
  version: number;
  buildings: PlacedBuilding[];
  connections: Connection[];
}

// === UI State ===

export type PlacementMode =
  | { kind: 'building'; buildingType: BuildingType; rotation: Rotation }
  | { kind: 'belt'; beltMk: BeltMk }
  | { kind: 'pipe'; pipeMk: PipeMk };

export interface ConnectionDraft {
  fromBuildingId: string;
  fromPortIndex: number;
}

// === Calculation Results ===

export interface ProductionRate {
  itemId: string;
  rate: number; // items/min or m³/min for fluids
}

export interface BuildingProduction {
  buildingId: string;
  inputs: ProductionRate[];
  outputs: ProductionRate[];
  power: number; // MW (positive = consumption, negative = production)
}

// === Solver Types ===

export interface SolverStep {
  itemId: string;
  recipeId: string;
  buildingType: BuildingType;
  buildingCount: number;
  buildingCountCeil: number;
  clockPercent: number;
  inputRates: ProductionRate[];
  outputRates: ProductionRate[];
  powerPerBuilding: number;
  totalPower: number;
  /** True for auto-generated extractor steps (miner, water_extractor, oil_extractor) */
  isExtractor?: boolean;
  /** The ore/resource type for extractor steps */
  oreType?: string;
  /** Miner MK level for miner extractor steps */
  minerMkLevel?: MkLevel;
  /** Purity for extractor steps */
  purity?: Purity;
}

export interface SolverResult {
  steps: SolverStep[];
  rawResources: ProductionRate[];
  totalPower: number;
  totalBuildings: number;
  excess: ProductionRate[];
}

// === Layout Transfer Types ===

export interface PlacementInstruction {
  buildingType: BuildingType;
  gridX: number;
  gridY: number;
  recipeId: string | null;
  overclock: number;
  mkLevel: MkLevel;
  oreType: string | null;
  purity: Purity;
  /** Index of the SolverStep this placement belongs to */
  stepIndex: number;
  /** Instance index within the step (0..buildingCountCeil-1) */
  instanceIndex: number;
}

export interface ConnectionInstruction {
  fromPlacementIndex: number;
  fromPortIndex: number;
  toPlacementIndex: number;
  toPortIndex: number;
  beltMk: BeltMk;
  pipeMk: PipeMk;
}
