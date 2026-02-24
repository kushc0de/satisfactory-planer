import { useState, useMemo, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { ITEMS } from '../../data/items';
import { BUILDINGS } from '../../data/buildings';
import { RECIPES } from '../../data/recipes/index';
import { PURITY_LABELS, PURITY_MULTIPLIERS, MINER_BASE_RATES } from '../../data/purity';
import { solve, type SolverOptions, type OverclockStrategy } from '../../engine/solver';
import { generateSmartLayout } from '../../engine/smartLayout';
import { calcOverclockedPower } from '../../engine/overclock';
import { useStore } from '../../store/store';
import type {
  SolverResult, SolverStep, MkLevel, Purity, PlacedBuilding, Connection,
  ConnectionKind, ResourceConfig, BuildingType, ProductionRate,
} from '../../types';

const PRODUCIBLE_ITEMS = Object.values(ITEMS)
  .filter((item) => {
    return Object.values(RECIPES).some((r) => r.outputs.some((o) => o.itemId === item.id));
  })
  .sort((a, b) => a.label.localeCompare(b.label, 'de'));

/** Compute ResourceConfig from raw resource demand */
function buildResourceConfig(
  itemId: string,
  demandRate: number,
  minerMk: MkLevel,
  purity: Purity,
): ResourceConfig {
  const item = ITEMS[itemId];
  let buildingType: BuildingType;
  let outputPerMiner: number;

  if (itemId === 'water') {
    buildingType = 'water_extractor';
    outputPerMiner = 120; // no purity
  } else if (itemId === 'crude_oil' || itemId === 'nitrogen_gas') {
    buildingType = 'oil_extractor';
    outputPerMiner = 120 * PURITY_MULTIPLIERS[purity];
  } else if (item?.isFluid) {
    buildingType = 'water_extractor';
    outputPerMiner = 120;
  } else {
    buildingType = 'miner';
    outputPerMiner = MINER_BASE_RATES[minerMk] * PURITY_MULTIPLIERS[purity];
  }

  const buildingCount = demandRate / outputPerMiner;
  const minerCount = Math.ceil(buildingCount);
  const clockPercent = minerCount > 0 ? (buildingCount / minerCount) * 100 : 100;

  return {
    itemId,
    demandRate,
    minerMkLevel: minerMk,
    purity,
    outputPerMiner,
    minerCount,
    clockPercent,
    buildingType,
  };
}

/** Generate extractor SolverSteps from ResourceConfigs */
function extractorStepsFromConfigs(configs: ResourceConfig[], strategy: OverclockStrategy): SolverStep[] {
  return configs.map((cfg) => {
    const clockPercent = strategy === 'exact' ? cfg.clockPercent : 100;
    const actualOutput = cfg.outputPerMiner * (clockPercent / 100) * cfg.minerCount;

    let basePower: number;
    if (cfg.buildingType === 'miner') {
      const mkPower = BUILDINGS.miner.powerPerMk;
      basePower = mkPower ? mkPower[cfg.minerMkLevel] : BUILDINGS.miner.basePower;
    } else {
      basePower = BUILDINGS[cfg.buildingType].basePower;
    }
    const powerPerBuilding = calcOverclockedPower(basePower, clockPercent);

    let oreType: string | null;
    if (cfg.buildingType === 'water_extractor') {
      oreType = 'water';
    } else if (cfg.itemId === 'nitrogen_gas') {
      oreType = 'nitrogen_gas';
    } else {
      oreType = cfg.itemId;
    }

    return {
      itemId: cfg.itemId,
      recipeId: '',
      buildingType: cfg.buildingType,
      buildingCount: cfg.demandRate / cfg.outputPerMiner,
      buildingCountCeil: cfg.minerCount,
      clockPercent,
      inputRates: [] as ProductionRate[],
      outputRates: [{ itemId: cfg.itemId, rate: actualOutput }],
      powerPerBuilding,
      totalPower: powerPerBuilding * cfg.minerCount,
      isExtractor: true,
      oreType: oreType ?? cfg.itemId,
      minerMkLevel: cfg.buildingType === 'miner' ? cfg.minerMkLevel : undefined,
      purity: cfg.buildingType === 'water_extractor' ? undefined : cfg.purity,
    };
  });
}

export default function SolverPanel({ onClose }: { onClose: () => void }) {
  const [targetItem, setTargetItem] = useState('');
  const [targetRate, setTargetRate] = useState(1);
  const [strategy, setStrategy] = useState<OverclockStrategy>('full');
  const [result, setResult] = useState<SolverResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceConfigs, setResourceConfigs] = useState<ResourceConfig[]>([]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return PRODUCIBLE_ITEMS;
    const lower = searchTerm.toLowerCase();
    return PRODUCIBLE_ITEMS.filter((item) => item.label.toLowerCase().includes(lower));
  }, [searchTerm]);

  const handleSolve = () => {
    if (!targetItem || targetRate <= 0) return;
    const options: SolverOptions = {
      targetItem,
      targetRate,
      strategy,
    };
    const solverResult = solve(options);
    setResult(solverResult);

    // Initialize ResourceConfigs from rawResources
    const configs = solverResult.rawResources.map((r) =>
      buildResourceConfig(r.itemId, r.rate, 1, 'normal'),
    );
    setResourceConfigs(configs);
  };

  const updateResourceConfig = useCallback((index: number, field: 'minerMkLevel' | 'purity', value: MkLevel | Purity) => {
    setResourceConfigs((prev) => {
      const updated = [...prev];
      const cfg = updated[index];
      const newMk = field === 'minerMkLevel' ? (value as MkLevel) : cfg.minerMkLevel;
      const newPurity = field === 'purity' ? (value as Purity) : cfg.purity;
      updated[index] = buildResourceConfig(cfg.itemId, cfg.demandRate, newMk, newPurity);
      return updated;
    });
  }, []);

  /** Build the complete SolverResult including extractor steps from current configs */
  const buildFullResult = useCallback((): SolverResult | null => {
    if (!result) return null;

    // Processing steps (non-extractor) from solver
    const processingSteps = result.steps.filter((s) => !s.isExtractor);
    const extractorSteps = extractorStepsFromConfigs(resourceConfigs, strategy);
    const allSteps = [...processingSteps, ...extractorSteps];

    const totalPower = allSteps.reduce((sum, s) => sum + s.totalPower, 0);
    const totalBuildings = allSteps.reduce((sum, s) => sum + s.buildingCountCeil, 0);

    return {
      steps: allSteps,
      rawResources: result.rawResources,
      totalPower,
      totalBuildings,
      excess: result.excess,
    };
  }, [result, resourceConfigs, strategy]);

  const handleTransferToLayout = () => {
    const fullResult = buildFullResult();
    if (!fullResult) return;

    const currentBuildings = useStore.getState().buildings;
    const currentConnections = useStore.getState().connections;

    // Find free area below existing buildings
    let maxY = 0;
    for (const b of currentBuildings) {
      const def = BUILDINGS[b.type];
      const bottomEdge = b.gridY + (def?.gridHeight ?? 1);
      if (bottomEdge > maxY) maxY = bottomEdge;
    }
    const startY = currentBuildings.length > 0 ? maxY + 3 : 0;

    // Generate smart layout (placements + connections together)
    const { placements, connections: connectionInstructions } = generateSmartLayout(fullResult, { startX: 0, startY });

    // Build all PlacedBuilding objects
    const newBuildings: PlacedBuilding[] = [];
    const placedIds: string[] = [];

    for (const p of placements) {
      const id = nanoid();
      placedIds.push(id);
      newBuildings.push({
        id,
        type: p.buildingType,
        gridX: p.gridX,
        gridY: p.gridY,
        mkLevel: p.mkLevel,
        overclock: Math.max(1, Math.min(250, p.overclock)),
        purity: p.purity,
        recipeId: p.recipeId,
        rotation: 0,
        oreType: p.oreType,
      });
    }

    // Build all Connection objects
    const newConnections: Connection[] = [];
    for (const c of connectionInstructions) {
      const fromId = placedIds[c.fromPlacementIndex];
      const toId = placedIds[c.toPlacementIndex];
      if (!fromId || !toId) continue;

      const fromBuilding = newBuildings[c.fromPlacementIndex];
      const toBuilding = newBuildings[c.toPlacementIndex];
      const fromDef = BUILDINGS[fromBuilding.type];
      const toDef = BUILDINGS[toBuilding.type];
      const outputPorts = fromDef.ports.filter((p) => p.type === 'output');
      const inputPorts = toDef.ports.filter((p) => p.type === 'input');
      const fromPort = outputPorts[c.fromPortIndex];
      const toPort = inputPorts[c.toPortIndex];

      let connectionKind: ConnectionKind = 'belt';
      if (fromPort?.category === 'pipe' || toPort?.category === 'pipe') {
        connectionKind = 'pipe';
      }

      newConnections.push({
        id: nanoid(),
        fromBuildingId: fromId,
        fromPortIndex: c.fromPortIndex,
        toBuildingId: toId,
        toPortIndex: c.toPortIndex,
        beltMk: c.beltMk,
        pipeMk: c.pipeMk,
        connectionKind,
      });
    }

    useStore.getState().loadBuildings([...currentBuildings, ...newBuildings]);
    useStore.getState().loadConnections([...currentConnections, ...newConnections]);

    onClose();
  };

  // Compute display totals including extractors
  const displayResult = buildFullResult();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#0f0f1a] border border-gray-700 rounded-xl shadow-2xl w-[650px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">
            Produktionsketten-Solver
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg">&times;</button>
        </div>

        {/* Input */}
        <div className="px-5 py-4 space-y-3 border-b border-gray-800">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Ziel-Item</label>
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200 mb-1 focus:outline-none focus:border-amber-500"
            />
            <div className="w-full bg-gray-800 border border-gray-700 rounded-md overflow-y-auto max-h-[160px]">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTargetItem(item.id)}
                  className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                    targetItem === item.id
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Rate (Items/min)</label>
              <input
                type="number"
                min={0.1}
                step={0.5}
                value={targetRate}
                onChange={(e) => setTargetRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Strategie</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as OverclockStrategy)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
              >
                <option value="full">100% (Standard)</option>
                <option value="exact">Exakt (Untertakten)</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSolve}
            disabled={!targetItem || targetRate <= 0}
            className="w-full py-2 text-sm font-bold rounded-md bg-amber-500 text-gray-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            BERECHNEN
          </button>
        </div>

        {/* Results */}
        {result && displayResult && (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Processing Steps */}
            {result.steps.map((step, i) => {
              const buildingDef = BUILDINGS[step.buildingType];
              return (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-100">
                      {ITEMS[step.itemId]?.label ?? step.itemId}
                    </span>
                    <span className="text-xs text-gray-400">
                      {step.buildingCountCeil}x {buildingDef?.label ?? step.buildingType}
                      {step.clockPercent < 100 && ` @ ${step.clockPercent.toFixed(1)}%`}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    {step.inputRates.length > 0 && (
                      <div>
                        <span className="text-blue-400">In: </span>
                        {step.inputRates.map((r, j) => (
                          <span key={j}>
                            {j > 0 && ' + '}
                            {r.rate.toFixed(1)} {ITEMS[r.itemId]?.label ?? r.itemId}
                          </span>
                        ))}
                      </div>
                    )}
                    <div>
                      <span className="text-amber-400">Out: </span>
                      {step.outputRates.map((r, j) => (
                        <span key={j}>
                          {j > 0 && ' + '}
                          {r.rate.toFixed(1)} {ITEMS[r.itemId]?.label ?? r.itemId}
                        </span>
                      ))}
                    </div>
                    <div className="text-yellow-400">{step.totalPower.toFixed(1)} MW</div>
                  </div>
                </div>
              );
            })}

            {/* Per-Resource Configuration */}
            {resourceConfigs.length > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase mb-3">Rohstoff-Konfiguration</h3>
                <div className="space-y-2">
                  {resourceConfigs.map((cfg, i) => {
                    const isWater = cfg.buildingType === 'water_extractor';
                    const isMiner = cfg.buildingType === 'miner';
                    return (
                      <div key={cfg.itemId} className="bg-gray-800/50 rounded-lg p-3 border border-emerald-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-100">
                            {ITEMS[cfg.itemId]?.label ?? cfg.itemId}
                            <span className="ml-2 text-xs font-normal text-emerald-400">(Extraktion)</span>
                          </span>
                          <span className="text-xs text-gray-400">
                            Bedarf: {cfg.demandRate.toFixed(1)}/min
                          </span>
                        </div>
                        <div className="flex gap-2 items-end">
                          {/* MK Level (only for miners) */}
                          {isMiner && (
                            <div className="flex-1">
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Stufe</label>
                              <select
                                value={cfg.minerMkLevel}
                                onChange={(e) => updateResourceConfig(i, 'minerMkLevel', Number(e.target.value) as MkLevel)}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
                              >
                                <option value={1}>MK1</option>
                                <option value={2}>MK2</option>
                                <option value={3}>MK3</option>
                              </select>
                            </div>
                          )}
                          {/* Purity (not for water) */}
                          {!isWater && (
                            <div className="flex-1">
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Reinheit</label>
                              <select
                                value={cfg.purity}
                                onChange={(e) => updateResourceConfig(i, 'purity', e.target.value as Purity)}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
                              >
                                <option value="impure">{PURITY_LABELS.impure}</option>
                                <option value="normal">{PURITY_LABELS.normal}</option>
                                <option value="pure">{PURITY_LABELS.pure}</option>
                              </select>
                            </div>
                          )}
                          {/* Computed values */}
                          <div className="flex-1 text-right">
                            <div className="text-xs text-gray-400">
                              {cfg.minerCount}x {BUILDINGS[cfg.buildingType]?.label ?? cfg.buildingType}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {cfg.outputPerMiner.toFixed(0)}/min pro Gebäude
                              {cfg.clockPercent < 99.9 && ` @ ${cfg.clockPercent.toFixed(1)}%`}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <h3 className="text-xs font-bold text-amber-500 uppercase">Zusammenfassung</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800/50 rounded p-2">
                  <span className="text-gray-500">Gebäude: </span>
                  <span className="text-gray-200 font-mono font-bold">{displayResult.totalBuildings}</span>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <span className="text-gray-500">Energie: </span>
                  <span className="text-yellow-400 font-mono font-bold">{displayResult.totalPower.toFixed(1)} MW</span>
                </div>
              </div>

              {result.rawResources.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mt-2 mb-1">Rohstoffe:</h4>
                  <div className="space-y-0.5">
                    {result.rawResources.map((r, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-300">{ITEMS[r.itemId]?.label ?? r.itemId}</span>
                        <span className="text-gray-200 font-mono">{r.rate.toFixed(1)}/min</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.excess.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mt-2 mb-1">Nebenprodukte:</h4>
                  <div className="space-y-0.5">
                    {result.excess.map((r, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-300">{ITEMS[r.itemId]?.label ?? r.itemId}</span>
                        <span className="text-orange-400 font-mono">{r.rate.toFixed(1)}/min</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Transfer to Layout Button */}
            <button
              onClick={handleTransferToLayout}
              className="w-full py-2.5 text-sm font-bold rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
            >
              AUF LAYOUT ÜBERTRAGEN (Smart Layout)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
