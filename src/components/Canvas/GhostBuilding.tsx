import type { BuildingType, Rotation } from '../../types';
import { BUILDINGS } from '../../data/buildings';
import { GRID_SIZE } from '../../utils/grid';
import { getVisualDimensions, getInputPorts, getOutputPorts, getPortPixelOffset } from '../../utils/ports';
import { canPlace } from '../../utils/collision';
import { useStore } from '../../store/store';
import BuildingIcon from '../Icons/BuildingIcon';

interface Props {
  buildingType: BuildingType;
  gridX: number;
  gridY: number;
  rotation: Rotation;
}

export default function GhostBuilding({ buildingType, gridX, gridY, rotation }: Props) {
  const def = BUILDINGS[buildingType];
  const buildings = useStore((s) => s.buildings);
  const { width, height } = getVisualDimensions(def, rotation);

  const inputPorts = getInputPorts(def);
  const outputPorts = getOutputPorts(def);

  const hasCollision = !canPlace(buildingType, gridX, gridY, rotation, buildings);

  return (
    <div
      className={`absolute rounded-lg border-2 border-dashed flex flex-col items-center justify-center pointer-events-none ${
        hasCollision
          ? 'border-red-400/60 bg-red-500/20'
          : 'border-amber-400/60 bg-amber-500/15'
      }`}
      style={{
        left: gridX * GRID_SIZE,
        top: gridY * GRID_SIZE,
        width,
        height,
        zIndex: 100,
      }}
    >
      <BuildingIcon type={buildingType} size={Math.min(width, height) * 0.5} />
      <span className={`text-[10px] font-medium mt-0.5 ${
        hasCollision ? 'text-red-300/80' : 'text-amber-300/80'
      }`}>
        {def.label}
      </span>
      {rotation !== 0 && (
        <span className={`text-[8px] font-bold ${hasCollision ? 'text-red-400/60' : 'text-amber-400/60'}`}>{rotation}°</span>
      )}
      {hasCollision && (
        <span className="text-[8px] font-bold text-red-400 mt-0.5">Kollision!</span>
      )}

      {/* Port preview dots */}
      {inputPorts.map((port, i) => {
        const pos = getPortPixelOffset(port, rotation, width, height);
        return (
          <div
            key={`in-${i}`}
            className={`absolute w-2.5 h-2.5 ${port.category === 'pipe' ? 'rounded-sm' : 'rounded-full'} bg-blue-400/40 border border-blue-400/60`}
            style={{ left: pos.x - 5, top: pos.y - 5 }}
          />
        );
      })}
      {outputPorts.map((port, i) => {
        const pos = getPortPixelOffset(port, rotation, width, height);
        return (
          <div
            key={`out-${i}`}
            className={`absolute w-2.5 h-2.5 ${port.category === 'pipe' ? 'rounded-sm' : 'rounded-full'} bg-amber-400/40 border border-amber-400/60`}
            style={{ left: pos.x - 5, top: pos.y - 5 }}
          />
        );
      })}
    </div>
  );
}
