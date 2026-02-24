import { useState, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { PlacedBuilding as PlacedBuildingType } from '../../types';
import { BUILDINGS } from '../../data/buildings';
import { gridToPixel, GRID_SIZE } from '../../utils/grid';
import { useStore } from '../../store/store';
import { calcBuildingProduction } from '../../engine/production';
import { calcBuildingPower } from '../../engine/power';
import BuildingIcon from '../Icons/BuildingIcon';
import PortDot from './PortDot';
import BuildingContextMenu from './BuildingContextMenu';

interface Props {
  building: PlacedBuildingType;
}

export default function PlacedBuilding({ building }: Props) {
  const selectedId = useStore((s) => s.selectedBuildingId);
  const selectBuilding = useStore((s) => s.selectBuilding);
  const isSelected = selectedId === building.id;
  const def = BUILDINGS[building.type];

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: building.id,
    data: { type: 'placed', buildingId: building.id },
  });

  const pixelX = gridToPixel(building.gridX);
  const pixelY = gridToPixel(building.gridY);
  const width = def.gridWidth * GRID_SIZE;
  const height = def.gridHeight * GRID_SIZE;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: pixelX,
    top: pixelY,
    width,
    height,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
  };

  const prod = calcBuildingProduction(building);
  const power = calcBuildingPower(building);
  const outputRate = prod.outputs.length > 0 ? prod.outputs[0].rate : null;

  const hasMkLevels = def.maxMkLevel > 1;

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY });
    },
    [],
  );

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`
          group rounded-lg border-2 flex flex-col items-center justify-center
          transition-colors duration-100 select-none
          ${isSelected
            ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
            : 'border-gray-700/80 bg-gray-900/90 hover:border-gray-600'}
          ${isDragging ? 'opacity-70 shadow-2xl' : ''}
        `}
        onClick={(e) => {
          e.stopPropagation();
          selectBuilding(building.id);
        }}
        onContextMenu={handleContextMenu}
        {...listeners}
        {...attributes}
      >
        <BuildingIcon type={building.type} size={Math.min(width, height) * 0.5} />
        <span className="text-[10px] font-medium text-gray-300 mt-0.5 truncate max-w-full px-1">
          {def.label}
        </span>

        {/* MK Badge (top-right, only for buildings with MK levels) */}
        {hasMkLevels && (
          <div className="absolute -top-2 -right-2 bg-amber-500 text-gray-950 text-[9px] font-bold rounded px-1 py-0.5 leading-none shadow z-20">
            MK{building.mkLevel}
          </div>
        )}

        {/* Production rate overlay */}
        {outputRate !== null && outputRate > 0 && (
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 rounded px-1.5 py-0.5 text-[9px] text-amber-400 font-mono whitespace-nowrap z-20">
            {outputRate.toFixed(1)}/min
          </div>
        )}

        {/* Power overlay */}
        {power > 0 && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 rounded px-1.5 py-0.5 text-[9px] text-blue-400 font-mono whitespace-nowrap z-20">
            {power.toFixed(1)} MW
          </div>
        )}

        {/* Input ports (left side) */}
        {Array.from({ length: def.inputCount }).map((_, i) => (
          <PortDot
            key={`in-${i}`}
            buildingId={building.id}
            portType="input"
            portIndex={i}
            side="left"
            offset={i}
            total={def.inputCount}
            buildingHeight={height}
          />
        ))}

        {/* Output ports (right side) */}
        {Array.from({ length: def.outputCount }).map((_, i) => (
          <PortDot
            key={`out-${i}`}
            buildingId={building.id}
            portType="output"
            portIndex={i}
            side="right"
            offset={i}
            total={def.outputCount}
            buildingHeight={height}
          />
        ))}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <BuildingContextMenu
          building={building}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
