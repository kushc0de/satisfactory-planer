import { useEffect } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { useStore } from '../../store/store';
import { pixelToGrid, GRID_SIZE } from '../../utils/grid';
import Toolbar from '../Toolbar/Toolbar';
import BuildingPalette from '../Palette/BuildingPalette';
import Canvas from '../Canvas/Canvas';
import PropertiesPanel from '../Properties/PropertiesPanel';
import FactoryMetrics from '../Overlay/FactoryMetrics';

const snapModifier = createSnapModifier(GRID_SIZE);
const modifiers = [snapModifier];

export default function App() {
  const moveBuilding = useStore((s) => s.moveBuilding);
  const buildings = useStore((s) => s.buildings);
  // ESC key: priority-based cancellation; R key: rotate selected building
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const state = useStore.getState();
        if (state.connectionDraft) {
          state.cancelConnectionDraft();
        } else if (state.placementMode) {
          state.cancelPlacement();
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        const state = useStore.getState();
        // Only rotate selected building when NOT in placement mode
        // (placement rotation is handled in Canvas.tsx)
        if (!state.placementMode && state.selectedBuildingId) {
          e.preventDefault();
          state.rotateBuilding(state.selectedBuildingId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // DndContext now only handles moving already-placed buildings
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const data = active.data.current;

    if (!data) return;

    if (data.type === 'placed') {
      const building = buildings.find((b) => b.id === data.buildingId);
      if (building) {
        const newGridX = building.gridX + pixelToGrid(delta.x);
        const newGridY = building.gridY + pixelToGrid(delta.y);
        moveBuilding(
          data.buildingId,
          Math.max(0, newGridX),
          Math.max(0, newGridY),
        );
      }
    }
  };

  return (
    <DndContext modifiers={modifiers} onDragEnd={handleDragEnd}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0a0a15]">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <BuildingPalette />
          <Canvas />
          <PropertiesPanel />
        </div>
        <FactoryMetrics />
      </div>
    </DndContext>
  );
}
