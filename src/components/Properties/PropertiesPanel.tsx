import { useStore } from '../../store/store';
import { useSelectedBuilding, useSelectedBuildings } from '../../store/selectors';
import { BUILDINGS } from '../../data/buildings';
import { calcBuildingProduction } from '../../engine/production';
import { calcBuildingPower } from '../../engine/power';
import type { Rotation } from '../../types';
import BuildingIcon from '../Icons/BuildingIcon';
import MkLevelSelector from './MkLevelSelector';
import OverclockSlider from './OverclockSlider';
import PuritySelector from './PuritySelector';
import RecipeSelector from './RecipeSelector';
import ProductionDisplay from './ProductionDisplay';
import ConnectionProperties from './ConnectionProperties';
import OreSelector from './OreSelector';

const ROTATIONS: Rotation[] = [0, 90, 180, 270];

export default function PropertiesPanel() {
  const building = useSelectedBuilding();
  const selectedBuildings = useSelectedBuildings();
  const selectedConnectionId = useStore((s) => s.selectedConnectionId);
  const setMkLevel = useStore((s) => s.setMkLevel);
  const setOverclock = useStore((s) => s.setOverclock);
  const setPurity = useStore((s) => s.setPurity);
  const setRecipe = useStore((s) => s.setRecipe);
  const setRotation = useStore((s) => s.setRotation);
  const setOreType = useStore((s) => s.setOreType);
  const removeBuilding = useStore((s) => s.removeBuilding);
  const removeConnectionsForBuilding = useStore((s) => s.removeConnectionsForBuilding);
  const clearSelection = useStore((s) => s.clearSelection);

  if (selectedConnectionId) {
    return (
      <aside className="w-[300px] flex-shrink-0 bg-[#0f0f1a] border-l border-gray-800/80 flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-800/80">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Eigenschaften</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ConnectionProperties />
        </div>
      </aside>
    );
  }

  // Multi-selection: show summary
  if (selectedBuildings.length > 1) {
    const handleDeleteAll = () => {
      for (const b of selectedBuildings) {
        removeConnectionsForBuilding(b.id);
        removeBuilding(b.id);
      }
      clearSelection();
    };

    return (
      <aside className="w-[300px] flex-shrink-0 bg-[#0f0f1a] border-l border-gray-800/80 flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-800/80">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Eigenschaften</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center py-6">
            <div className="text-3xl font-bold text-amber-400 mb-1">{selectedBuildings.length}</div>
            <div className="text-sm text-gray-400">Gebäude ausgewählt</div>
          </div>

          <div className="space-y-1">
            {selectedBuildings.map((b) => {
              const d = BUILDINGS[b.type];
              return (
                <div key={b.id} className="flex items-center gap-2 bg-gray-800/50 rounded px-2 py-1.5">
                  <BuildingIcon type={b.type} size={20} />
                  <span className="text-xs text-gray-300 truncate">{d.label}</span>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-gray-800" />

          <button
            onClick={handleDeleteAll}
            className="w-full py-2 text-sm font-medium rounded-md border border-red-500/40 text-red-400
              hover:bg-red-500/10 transition-colors"
          >
            Alle {selectedBuildings.length} Gebäude löschen
          </button>
        </div>
      </aside>
    );
  }

  if (!building) {
    return (
      <aside className="w-[300px] flex-shrink-0 bg-[#0f0f1a] border-l border-gray-800/80 flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-800/80">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Eigenschaften</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-600 text-center px-4">
            Wähle ein Gebäude oder eine Verbindung aus
          </p>
        </div>
      </aside>
    );
  }

  const def = BUILDINGS[building.type];
  const prod = calcBuildingProduction(building);
  const power = calcBuildingPower(building);

  const handleDelete = () => {
    removeConnectionsForBuilding(building.id);
    removeBuilding(building.id);
    clearSelection();
  };

  return (
    <aside className="w-[300px] flex-shrink-0 bg-[#0f0f1a] border-l border-gray-800/80 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-800/80">
        <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Eigenschaften</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Building header */}
        <div className="flex items-center gap-3">
          <BuildingIcon type={building.type} size={40} />
          <div>
            <h3 className="text-sm font-bold text-gray-100">{def.label}</h3>
            <p className="text-xs text-gray-500">{def.description}</p>
          </div>
        </div>

        <div className="h-px bg-gray-800" />

        {/* Rotation control */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Rotation
          </label>
          <div className="flex gap-1">
            {ROTATIONS.map((rot) => (
              <button
                key={rot}
                onClick={() => setRotation(building.id, rot)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors
                  ${building.rotation === rot
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
              >
                {rot}°
              </button>
            ))}
          </div>
        </div>

        {/* MK Level (miners only) */}
        {building.type === 'miner' && (
          <MkLevelSelector
            value={building.mkLevel}
            maxLevel={def.maxMkLevel}
            onChange={(level) => setMkLevel(building.id, level)}
          />
        )}

        {/* Purity (miners only) */}
        {building.type === 'miner' && (
          <PuritySelector
            value={building.purity}
            onChange={(purity) => setPurity(building.id, purity)}
          />
        )}

        {/* Ore type (miners only) */}
        {building.type === 'miner' && (
          <OreSelector
            value={building.oreType}
            onChange={(oreType) => setOreType(building.id, oreType)}
          />
        )}

        {/* Recipe (non-miner, non-logistics) */}
        {!def.isLogistics && building.type !== 'miner' && (
          <RecipeSelector
            buildingType={building.type}
            value={building.recipeId}
            onChange={(recipeId) => setRecipe(building.id, recipeId)}
          />
        )}

        {/* Overclock (non-logistics) */}
        {!def.isLogistics && (
          <OverclockSlider
            value={building.overclock}
            onChange={(percent) => setOverclock(building.id, percent)}
          />
        )}

        <div className="h-px bg-gray-800" />

        {/* Production display */}
        <ProductionDisplay inputs={prod.inputs} outputs={prod.outputs} power={power} />

        <div className="h-px bg-gray-800" />

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="w-full py-2 text-sm font-medium rounded-md border border-red-500/40 text-red-400
            hover:bg-red-500/10 transition-colors"
        >
          Gebäude löschen
        </button>
      </div>
    </aside>
  );
}
