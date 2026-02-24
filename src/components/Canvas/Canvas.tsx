import { useState, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../../store/store';
import { usePlacementMode } from '../../store/selectors';
import { pixelToGrid, GRID_SIZE } from '../../utils/grid';
import GridBackground from './GridBackground';
import PlacedBuilding from './PlacedBuilding';
import ConnectionLine from './ConnectionLine';
import GhostBuilding from './GhostBuilding';

export default function Canvas() {
  const buildings = useStore((s) => s.buildings);
  const connections = useStore((s) => s.connections);
  const clearSelection = useStore((s) => s.clearSelection);
  const connectionDraft = useStore((s) => s.connectionDraft);
  const cancelConnectionDraft = useStore((s) => s.cancelConnectionDraft);
  const addBuilding = useStore((s) => s.addBuilding);
  const placementMode = usePlacementMode();
  const cancelPlacement = useStore((s) => s.cancelPlacement);

  const [ghostPos, setGhostPos] = useState<{ gridX: number; gridY: number } | null>(null);

  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!placementMode || placementMode.kind !== 'building') {
        if (ghostPos) setGhostPos(null);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const scrollLeft = e.currentTarget.scrollLeft;
      const scrollTop = e.currentTarget.scrollTop;
      const x = e.clientX - rect.left + scrollLeft;
      const y = e.clientY - rect.top + scrollTop;
      const gridX = Math.max(0, pixelToGrid(x) - 1);
      const gridY = Math.max(0, pixelToGrid(y) - 1);
      setGhostPos({ gridX, gridY });
    },
    [placementMode, ghostPos],
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Building placement mode
      if (placementMode?.kind === 'building' && ghostPos) {
        e.stopPropagation();
        addBuilding(placementMode.buildingType, ghostPos.gridX, ghostPos.gridY);
        // Stay in placement mode for multiple placements
        return;
      }

      // Belt placement mode - clicks on canvas do nothing (ports handle it)
      if (placementMode?.kind === 'belt') {
        return;
      }

      if (connectionDraft) {
        cancelConnectionDraft();
      } else {
        clearSelection();
      }
    },
    [placementMode, ghostPos, connectionDraft, addBuilding, cancelConnectionDraft, clearSelection],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (placementMode) {
        e.preventDefault();
        cancelPlacement();
      }
    },
    [placementMode, cancelPlacement],
  );

  const handleMouseLeave = useCallback(() => {
    setGhostPos(null);
  }, []);

  const isPlacing = placementMode?.kind === 'building';
  const isBeltMode = placementMode?.kind === 'belt';

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 relative overflow-auto bg-[#0a0a15] ${
        isPlacing ? 'cursor-crosshair' : isBeltMode ? 'cursor-pointer' : ''
      }`}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      <div className="relative" style={{ width: 3200, height: 2400 }}>
        <GridBackground />

        {/* Connection SVG layer */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="3200"
          height="2400"
          style={{ zIndex: 5 }}
        >
          <g style={{ pointerEvents: 'auto' }}>
            {connections.map((c) => (
              <ConnectionLine key={c.id} connection={c} buildings={buildings} />
            ))}
          </g>
        </svg>

        {/* Buildings layer */}
        {buildings.map((b) => (
          <PlacedBuilding key={b.id} building={b} />
        ))}

        {/* Ghost building preview */}
        {isPlacing && ghostPos && (
          <GhostBuilding
            buildingType={placementMode.buildingType}
            gridX={ghostPos.gridX}
            gridY={ghostPos.gridY}
          />
        )}

        {/* Status indicators */}
        {connectionDraft && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg pointer-events-none">
            Klicke auf einen Eingang zum Verbinden — ESC zum Abbrechen
          </div>
        )}

        {isBeltMode && !connectionDraft && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg pointer-events-none">
            Klicke auf einen Ausgang, dann auf einen Eingang — ESC / Rechtsklick zum Abbrechen
          </div>
        )}

        {isPlacing && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg pointer-events-none">
            Klicken zum Platzieren — ESC / Rechtsklick zum Abbrechen
          </div>
        )}
      </div>
    </div>
  );
}
