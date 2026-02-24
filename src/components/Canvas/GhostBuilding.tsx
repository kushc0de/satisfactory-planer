import type { BuildingType } from '../../types';
import { BUILDINGS } from '../../data/buildings';
import { GRID_SIZE } from '../../utils/grid';
import BuildingIcon from '../Icons/BuildingIcon';

interface Props {
  buildingType: BuildingType;
  gridX: number;
  gridY: number;
}

export default function GhostBuilding({ buildingType, gridX, gridY }: Props) {
  const def = BUILDINGS[buildingType];
  const width = def.gridWidth * GRID_SIZE;
  const height = def.gridHeight * GRID_SIZE;

  return (
    <div
      className="absolute rounded-lg border-2 border-dashed border-amber-400/60 bg-amber-500/15 flex flex-col items-center justify-center pointer-events-none"
      style={{
        left: gridX * GRID_SIZE,
        top: gridY * GRID_SIZE,
        width,
        height,
        zIndex: 100,
      }}
    >
      <BuildingIcon type={buildingType} size={Math.min(width, height) * 0.5} />
      <span className="text-[10px] font-medium text-amber-300/80 mt-0.5">
        {def.label}
      </span>
    </div>
  );
}
