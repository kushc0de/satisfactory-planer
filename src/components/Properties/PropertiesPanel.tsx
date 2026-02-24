import { useStore } from '../../store/store';
import { useSelectedBuilding } from '../../store/selectors';
import { BUILDINGS } from '../../data/buildings';
import { calcBuildingProduction } from '../../engine/production';
import { calcBuildingPower } from '../../engine/power';
import BuildingIcon from '../Icons/BuildingIcon';
import MkLevelSelector from './MkLevelSelector';
import OverclockSlider from './OverclockSlider';
import PuritySelector from './PuritySelector';
import RecipeSelector from './RecipeSelector';
import ProductionDisplay from './ProductionDisplay';
import ConnectionProperties from './ConnectionProperties';

export default function PropertiesPanel() {
  const building = useSelectedBuilding();
  const selectedConnectionId = useStore((s) => s.selectedConnectionId);
  const setMkLevel = useStore((s) => s.setMkLevel);
  const setOverclock = useStore((s) => s.setOverclock);
  const setPurity = useStore((s) => s.setPurity);
  const setRecipe = useStore((s) => s.setRecipe);
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
