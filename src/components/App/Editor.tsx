import { useEffect, useRef, useCallback, useState } from 'react';
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
import SolverPanel from '../Solver/SolverPanel';
import type { BuildingClipboard } from '../../store/slices/uiSlice';

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

  const [showSolver, setShowSolver] = useState(false);

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

  // Keyboard handler: ESC, R-rotate, WASD/Arrow movement, Ctrl+C/V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keys when typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const state = useStore.getState();

      if (e.key === 'Escape') {
        if (state.connectionDraft) {
          state.cancelConnectionDraft();
        } else if (state.placementMode) {
          state.cancelPlacement();
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        // Only rotate selected building when NOT in placement mode
        // (placement rotation is handled in Canvas.tsx)
        if (!state.placementMode && state.selectedBuildingIds.length > 0) {
          e.preventDefault();
          for (const id of state.selectedBuildingIds) {
            state.rotateBuilding(id);
          }
        }
        return;
      }

      // WASD / Arrow key movement
      const moveMap: Record<string, { dx: number; dy: number }> = {
        w: { dx: 0, dy: -1 },
        W: { dx: 0, dy: -1 },
        a: { dx: -1, dy: 0 },
        A: { dx: -1, dy: 0 },
        s: { dx: 0, dy: 1 },
        S: { dx: 0, dy: 1 },
        d: { dx: 1, dy: 0 },
        D: { dx: 1, dy: 0 },
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 },
      };

      const move = moveMap[e.key];
      if (move && state.selectedBuildingIds.length > 0 && !state.placementMode) {
        e.preventDefault();
        for (const id of state.selectedBuildingIds) {
          const b = state.buildings.find((building) => building.id === id);
          if (b) {
            state.moveBuilding(id, Math.max(0, b.gridX + move.dx), Math.max(0, b.gridY + move.dy));
          }
        }
        return;
      }

      // Ctrl+C: Copy settings from first selected building
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (state.selectedBuildingIds.length > 0) {
          const b = state.buildings.find((building) => building.id === state.selectedBuildingIds[0]);
          if (b) {
            const clip: BuildingClipboard = {
              buildingType: b.type,
              recipeId: b.recipeId,
              overclock: b.overclock,
              mkLevel: b.mkLevel,
              purity: b.purity,
              oreType: b.oreType,
            };
            state.setClipboard(clip);
          }
        }
        return;
      }

      // Ctrl+V: Paste settings to all selected buildings of matching type
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        const clip = state.clipboard;
        if (clip && state.selectedBuildingIds.length > 0) {
          for (const id of state.selectedBuildingIds) {
            const b = state.buildings.find((building) => building.id === id);
            if (b && b.type === clip.buildingType) {
              if (clip.recipeId !== undefined) state.setRecipe(id, clip.recipeId);
              state.setOverclock(id, clip.overclock);
              state.setMkLevel(id, clip.mkLevel as 1 | 2 | 3);
              if (b.type === 'miner') {
                state.setPurity(id, clip.purity as 'impure' | 'normal' | 'pure');
                if (clip.oreType !== undefined) state.setOreType(id, clip.oreType);
              }
            }
          }
        }
        return;
      }

      // Delete / Backspace: delete selected buildings
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedBuildingIds.length > 0) {
          e.preventDefault();
          for (const id of state.selectedBuildingIds) {
            state.removeConnectionsForBuilding(id);
            state.removeBuilding(id);
          }
          state.clearSelection();
        }
        return;
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
        <Toolbar onOpenSolver={() => setShowSolver(true)} />
        <div className="flex flex-1 overflow-hidden">
          <BuildingPalette />
          <Canvas />
          <PropertiesPanel />
        </div>
        <FactoryMetrics />
        {showSolver && <SolverPanel onClose={() => setShowSolver(false)} />}
      </div>
    </DndContext>
  );
}
