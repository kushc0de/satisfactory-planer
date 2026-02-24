import { useState, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { PlacedBuilding as PlacedBuildingType } from '../../types';
import { BUILDINGS } from '../../data/buildings';
import { RECIPES } from '../../data/recipes/index';
import { ITEMS } from '../../data/items';
import { gridToPixel } from '../../utils/grid';
import { getVisualDimensions, getInputPorts, getOutputPorts } from '../../utils/ports';
import { useStore } from '../../store/store';
import { usePlacementMode } from '../../store/selectors';
import { calcBuildingProduction } from '../../engine/production';
import { calcBuildingPower } from '../../engine/power';
import BuildingIcon from '../Icons/BuildingIcon';
import PortDot from './PortDot';
import BuildingContextMenu from './BuildingContextMenu';

interface Props {
  building: PlacedBuildingType;
}

export default function PlacedBuilding({ building }: Props) {
  const selectedIds = useStore((s) => s.selectedBuildingIds);
  const selectBuilding = useStore((s) => s.selectBuilding);
  const toggleBuildingSelection = useStore((s) => s.toggleBuildingSelection);
  const placementMode = usePlacementMode();
  const isSelected = selectedIds.includes(building.id);
  const def = BUILDINGS[building.type];
  const rotation = building.rotation;

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: building.id,
    data: { type: 'placed', buildingId: building.id },
    disabled: placementMode !== null,
  });

  const pixelX = gridToPixel(building.gridX);
  const pixelY = gridToPixel(building.gridY);
  const { width, height } = getVisualDimensions(def, rotation);

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

  const inputPorts = getInputPorts(def);
  const outputPorts = getOutputPorts(def);

  // Determine display label: recipe name or ore type takes priority
  let mainLabel = def.label;
  let subLabel: string | null = null;

  if (building.recipeId && RECIPES[building.recipeId]) {
    mainLabel = RECIPES[building.recipeId].label;
    subLabel = def.label;
  } else if (building.type === 'miner' && building.oreType && ITEMS[building.oreType]) {
    mainLabel = ITEMS[building.oreType].label;
    subLabel = def.label;
  }

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
          if (e.ctrlKey || e.metaKey) {
            toggleBuildingSelection(building.id);
          } else {
            selectBuilding(building.id);
          }
        }}
        onContextMenu={handleContextMenu}
        {...listeners}
        {...attributes}
      >
        <BuildingIcon type={building.type} size={Math.min(width, height) * 0.5} />
        <span className="text-[10px] font-medium text-gray-300 mt-0.5 truncate max-w-full px-1">
          {mainLabel}
        </span>
        {subLabel && (
          <span className="text-[8px] text-gray-500 truncate max-w-full px-1 -mt-0.5">
            {subLabel}
          </span>
        )}

        {/* Rotation indicator */}
        {rotation !== 0 && (
          <div className="absolute -top-2 -left-2 bg-gray-700 text-gray-300 text-[8px] font-bold rounded px-1 py-0.5 leading-none shadow z-20">
            {rotation}°
          </div>
        )}

        {/* MK Badge */}
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

        {/* Input ports */}
        {inputPorts.map((port, i) => (
          <PortDot
            key={`in-${i}`}
            buildingId={building.id}
            portType="input"
            portIndex={i}
            port={port}
            rotation={rotation}
            visualWidth={width}
            visualHeight={height}
          />
        ))}

        {/* Output ports */}
        {outputPorts.map((port, i) => (
          <PortDot
            key={`out-${i}`}
            buildingId={building.id}
            portType="output"
            portIndex={i}
            port={port}
            rotation={rotation}
            visualWidth={width}
            visualHeight={height}
          />
        ))}
      </div>

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
