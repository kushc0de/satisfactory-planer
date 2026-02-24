import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createBuildingsSlice, type BuildingsSlice } from './slices/buildingsSlice';
import { createConnectionsSlice, type ConnectionsSlice } from './slices/connectionsSlice';
import { createUiSlice, type UiSlice } from './slices/uiSlice';

export type StoreState = BuildingsSlice & ConnectionsSlice & UiSlice;

const CURRENT_VERSION = 2;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createBuildingsSlice(...a),
      ...createConnectionsSlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: 'satisfactory-planner',
      version: CURRENT_VERSION,
      partialize: (state) => ({
        buildings: state.buildings,
        connections: state.connections,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 1) {
          // v0 → v1: halve gridX/gridY (old GRID_SIZE=32 → new GRID_SIZE=64)
          const buildings = state.buildings as Array<{ gridX: number; gridY: number }> | undefined;
          if (buildings) {
            for (const b of buildings) {
              b.gridX = Math.round(b.gridX / 2);
              b.gridY = Math.round(b.gridY / 2);
            }
          }
        }
        if (version < 2) {
          // v1 → v2: add rotation/oreType to buildings, clear connections (port indices changed)
          const buildings = state.buildings as Array<Record<string, unknown>> | undefined;
          if (buildings) {
            for (const b of buildings) {
              if (b.rotation === undefined) b.rotation = 0;
              if (b.oreType === undefined) b.oreType = null;
            }
          }
          // Port indices are now flat in def.ports — old indices are incompatible
          state.connections = [];
        }
        return state as unknown as StoreState;
      },
    },
  ),
);
