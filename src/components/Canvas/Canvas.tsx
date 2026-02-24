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

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.0;
const CANVAS_SIZE = 12800; // Large virtual canvas size

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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const ghostPosRef = useRef(ghostPos);
  ghostPosRef.current = ghostPos;

  const containerRef = useRef<HTMLDivElement>(null);

  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [setNodeRef],
  );

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top - pan.y) / zoom;
    return { x, y };
  }, [zoom, pan]);

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

  // Zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * delta));

    // Zoom towards mouse position
    const scale = newZoom / zoom;
    const newPanX = mouseX - (mouseX - pan.x) * scale;
    const newPanY = mouseY - (mouseY - pan.y) * scale;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [zoom, pan]);

  // Pan with middle mouse button or space+drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      setIsPanning(false);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Handle panning
      if (isPanning) {
        setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
        return;
      }

      // Handle ghost building
      if (!placementMode || placementMode.kind !== 'building') {
        setGhostPos(null);
        return;
      }

      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      const def = BUILDINGS[placementMode.buildingType];
      const { gridWidth, gridHeight } = getVisualGridDimensions(def, placementMode.rotation);
      const gridX = Math.max(0, pixelToGrid(x) - Math.floor(gridWidth / 2));
      const gridY = Math.max(0, pixelToGrid(y) - Math.floor(gridHeight / 2));
      setGhostPos({ gridX, gridY });
    },
    [placementMode, isPanning, panStart, screenToCanvas],
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isPanning) return;

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

      if (pm?.kind === 'belt' || pm?.kind === 'pipe') {
        return;
      }

      clearSelection();
    },
    [placementMode, addBuilding, cancelConnectionDraft, clearSelection, isPanning],
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
    setIsPanning(false);
  }, []);

  const isPlacing = placementMode?.kind === 'building';
  const isBeltMode = placementMode?.kind === 'belt';
  const isPipeMode = placementMode?.kind === 'pipe';
  const isConnectionMode = isBeltMode || isPipeMode;

  return (
    <div
      ref={combinedRef}
      className={`flex-1 relative overflow-hidden bg-[#0a0a15] ${
        isPanning ? 'cursor-grabbing' : isPlacing ? 'cursor-crosshair' : isConnectionMode ? 'cursor-pointer' : 'cursor-grab'
      }`}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
    >
      <div
        className="relative origin-top-left"
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <GridBackground />

        {/* Connection SVG layer */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
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
      </div>

      {/* Status indicators (fixed position, outside transform) */}
      {connectionDraft && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg pointer-events-none">
          Klicke auf einen Eingang zum Verbinden — ESC zum Abbrechen
        </div>
      )}

      {isConnectionMode && !connectionDraft && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg pointer-events-none ${
          isPipeMode ? 'bg-cyan-500/90' : 'bg-amber-500/90'
        }`}>
          Klicke auf einen Ausgang, dann auf einen Eingang — ESC / Rechtsklick zum Abbrechen
        </div>
      )}

      {isPlacing && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg pointer-events-none">
          Klicken zum Platzieren — R zum Drehen — ESC / Rechtsklick zum Abbrechen
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-2 right-2 bg-gray-900/80 text-gray-400 text-xs px-2 py-1 rounded font-mono pointer-events-none">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
