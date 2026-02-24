import { useEffect } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { useStore } from '../../store/store';
import { pixelToGrid, GRID_SIZE } from '../../utils/grid';
import type { BuildingType } from '../../types';
import Toolbar from '../Toolbar/Toolbar';
import BuildingPalette from '../Palette/BuildingPalette';
import Canvas from '../Canvas/Canvas';
import PropertiesPanel from '../Properties/PropertiesPanel';
import FactoryMetrics from '../Overlay/FactoryMetrics';

const snapModifier = createSnapModifier(GRID_SIZE);

export default function App() {
  const addBuilding = useStore((s) => s.addBuilding);
  const moveBuilding = useStore((s) => s.moveBuilding);
  const buildings = useStore((s) => s.buildings);
  const cancelConnectionDraft = useStore((s) => s.cancelConnectionDraft);

  // ESC key to cancel connection draft
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelConnectionDraft();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancelConnectionDraft]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    const data = active.data.current;

    if (!data) return;

    if (data.type === 'palette' && over?.id === 'canvas') {
      // New building from palette: place at a default position offset by the drop delta
      const canvasEl = document.querySelector('[data-canvas]') ?? over.rect;
      const gridX = Math.max(0, pixelToGrid(delta.x + 320)); // offset from palette width
      const gridY = Math.max(0, pixelToGrid(delta.y + 100));
      addBuilding(data.buildingType as BuildingType, gridX, gridY);
    } else if (data.type === 'placed') {
      // Move existing building
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
    <DndContext modifiers={[snapModifier]} onDragEnd={handleDragEnd}>
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
