import { useState, useRef, useCallback, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../../store/store';
import { usePlacementMode } from '../../store/selectors';
import { pixelToGrid, GRID_SIZE } from '../../utils/grid';
import { BUILDINGS } from '../../data/buildings';
import { getVisualGridDimensions } from '../../utils/ports';
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
  const cyclePlacementRotation = useStore((s) => s.cyclePlacementRotation);

  const [ghostPos, setGhostPos] = useState<{ gridX: number; gridY: number } | null>(null);

  const ghostPosRef = useRef(ghostPos);
  ghostPosRef.current = ghostPos;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [setNodeRef],
  );

  // R-key to rotate during building placement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        const pm = useStore.getState().placementMode;
        if (pm?.kind === 'building') {
          e.preventDefault();
          cyclePlacementRotation();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cyclePlacementRotation]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!placementMode || placementMode.kind !== 'building') {
        setGhostPos(null);
        return;
      }
      const container = scrollContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft;
      const scrollTop = container.scrollTop;
      const x = e.clientX - rect.left + scrollLeft;
      const y = e.clientY - rect.top + scrollTop;

      const def = BUILDINGS[placementMode.buildingType];
      const { gridWidth, gridHeight } = getVisualGridDimensions(def, placementMode.rotation);
      const gridX = Math.max(0, pixelToGrid(x) - Math.floor(gridWidth / 2));
      const gridY = Math.max(0, pixelToGrid(y) - Math.floor(gridHeight / 2));
      setGhostPos({ gridX, gridY });
    },
    [placementMode],
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const draft = useStore.getState().connectionDraft;
      if (draft) {
        cancelConnectionDraft();
        return;
      }

      const currentGhost = ghostPosRef.current;
      const pm = useStore.getState().placementMode;
      if (pm?.kind === 'building' && currentGhost) {
        e.stopPropagation();
        addBuilding(pm.buildingType, currentGhost.gridX, currentGhost.gridY, pm.rotation);
        return;
      }

      if (pm?.kind === 'belt') {
        return;
      }

      clearSelection();
    },
    [placementMode, addBuilding, cancelConnectionDraft, clearSelection],
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
      ref={combinedRef}
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
            rotation={placementMode.rotation}
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
            Klicken zum Platzieren — R zum Drehen — ESC / Rechtsklick zum Abbrechen
          </div>
        )}
      </div>
    </div>
  );
}
