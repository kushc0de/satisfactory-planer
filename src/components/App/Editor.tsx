import { useEffect, useRef, useCallback } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { useStore } from '../../store/store';
import { useProjectsStore, loadProjectData, saveProjectData } from '../../store/projectsStore';
import { pixelToGrid, GRID_SIZE } from '../../utils/grid';
import Toolbar from '../Toolbar/Toolbar';
import BuildingPalette from '../Palette/BuildingPalette';
import Canvas from '../Canvas/Canvas';
import PropertiesPanel from '../Properties/PropertiesPanel';
import FactoryMetrics from '../Overlay/FactoryMetrics';

const snapModifier = createSnapModifier(GRID_SIZE);
const modifiers = [snapModifier];

export default function Editor() {
  const moveBuilding = useStore((s) => s.moveBuilding);
  const buildings = useStore((s) => s.buildings);
  const connections = useStore((s) => s.connections);
  const loadBuildings = useStore((s) => s.loadBuildings);
  const loadConnections = useStore((s) => s.loadConnections);
  const clearSelection = useStore((s) => s.clearSelection);

  const currentProjectId = useProjectsStore((s) => s.currentProjectId);
  const updateProjectMeta = useProjectsStore((s) => s.updateProjectMeta);

  const projectIdRef = useRef(currentProjectId);
  projectIdRef.current = currentProjectId;

  // Load project data when editor mounts
  useEffect(() => {
    if (!currentProjectId) return;
    const data = loadProjectData(currentProjectId);
    if (data) {
      loadBuildings(data.buildings);
      loadConnections(data.connections);
    } else {
      loadBuildings([]);
      loadConnections([]);
    }
    clearSelection();
  }, [currentProjectId, loadBuildings, loadConnections, clearSelection]);

  // Save function
  const save = useCallback(() => {
    const id = projectIdRef.current;
    if (!id) return;
    const state = useStore.getState();
    saveProjectData(id, {
      version: 2,
      buildings: state.buildings,
      connections: state.connections,
    });
    useProjectsStore.getState().updateProjectMeta(id, {
      updatedAt: Date.now(),
      buildingCount: state.buildings.length,
    });
  }, []);

  // Auto-save every 2 seconds
  useEffect(() => {
    const interval = setInterval(save, 2000);
    return () => clearInterval(interval);
  }, [save]);

  // Save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => save();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [save]);

  // Require 5px movement before drag starts, so simple clicks aren't swallowed
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const sensors = useSensors(pointerSensor);

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
    <DndContext sensors={sensors} modifiers={modifiers} onDragEnd={handleDragEnd}>
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
