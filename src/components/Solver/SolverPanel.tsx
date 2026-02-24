import { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { ITEMS } from '../../data/items';
import { BUILDINGS } from '../../data/buildings';
import { RECIPES } from '../../data/recipes/index';
import { PURITY_LABELS } from '../../data/purity';
import { solve, type SolverOptions, type OverclockStrategy } from '../../engine/solver';
import { generateLayout } from '../../engine/layout';
import { generateConnections } from '../../engine/autoConnect';
import { useStore } from '../../store/store';
import type { SolverResult, MkLevel, Purity, PlacedBuilding, Connection, ConnectionKind } from '../../types';

const PRODUCIBLE_ITEMS = Object.values(ITEMS)
  .filter((item) => {
    // Only show items that have at least one recipe producing them
    return Object.values(RECIPES).some((r) => r.outputs.some((o) => o.itemId === item.id));
  })
  .sort((a, b) => a.label.localeCompare(b.label, 'de'));

export default function SolverPanel({ onClose }: { onClose: () => void }) {
  const [targetItem, setTargetItem] = useState('');
  const [targetRate, setTargetRate] = useState(1);
  const [strategy, setStrategy] = useState<OverclockStrategy>('full');
  const [result, setResult] = useState<SolverResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minerMk, setMinerMk] = useState<MkLevel>(1);
  const [minerPurity, setMinerPurity] = useState<Purity>('normal');

  const buildings = useStore((s) => s.buildings);

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
      minerMkLevel: minerMk,
      minerPurity: minerPurity,
    };
    const solverResult = solve(options);
    setResult(solverResult);
  };

  const handleTransferToLayout = () => {
    if (!result) return;

    // Read current state once (non-reactive)
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

    // Generate layout and connections
    const placements = generateLayout(result, { startX: 0, startY });
    const connectionInstructions = generateConnections(placements, result);

    // Build all PlacedBuilding objects in memory
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

    // Build all Connection objects in memory
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

    // Two atomic store updates instead of hundreds
    useStore.getState().loadBuildings([...currentBuildings, ...newBuildings]);
    useStore.getState().loadConnections([...currentConnections, ...newConnections]);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#0f0f1a] border border-gray-700 rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col">
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
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Förderer-Stufe</label>
              <select
                value={minerMk}
                onChange={(e) => setMinerMk(Number(e.target.value) as MkLevel)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
              >
                <option value={1}>MK1 (60/min)</option>
                <option value={2}>MK2 (120/min)</option>
                <option value={3}>MK3 (240/min)</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Reinheit</label>
              <select
                value={minerPurity}
                onChange={(e) => setMinerPurity(e.target.value as Purity)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
              >
                <option value="impure">{PURITY_LABELS.impure} (50%)</option>
                <option value="normal">{PURITY_LABELS.normal} (100%)</option>
                <option value="pure">{PURITY_LABELS.pure} (200%)</option>
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
        {result && (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Steps */}
            {result.steps.map((step, i) => {
              const buildingDef = BUILDINGS[step.buildingType];
              const isExtractor = step.isExtractor;
              return (
                <div key={i} className={`bg-gray-800/50 rounded-lg p-3 border ${isExtractor ? 'border-emerald-700/50' : 'border-gray-700/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-100">
                      {ITEMS[step.itemId]?.label ?? step.itemId}
                      {isExtractor && (
                        <span className="ml-2 text-xs font-normal text-emerald-400">(Extraktion)</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">
                      {step.buildingCountCeil}x {buildingDef?.label ?? step.buildingType}
                      {step.minerMkLevel && ` MK${step.minerMkLevel}`}
                      {step.purity && step.purity !== 'normal' && ` ${PURITY_LABELS[step.purity]}`}
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

            {/* Summary */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <h3 className="text-xs font-bold text-amber-500 uppercase">Zusammenfassung</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800/50 rounded p-2">
                  <span className="text-gray-500">Gebäude: </span>
                  <span className="text-gray-200 font-mono font-bold">{result.totalBuildings}</span>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <span className="text-gray-500">Energie: </span>
                  <span className="text-yellow-400 font-mono font-bold">{result.totalPower.toFixed(1)} MW</span>
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
              AUF LAYOUT ÜBERTRAGEN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
