import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createBuildingsSlice, type BuildingsSlice } from './slices/buildingsSlice';
import { createConnectionsSlice, type ConnectionsSlice } from './slices/connectionsSlice';
import { createUiSlice, type UiSlice } from './slices/uiSlice';

export type StoreState = BuildingsSlice & ConnectionsSlice & UiSlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createBuildingsSlice(...a),
      ...createConnectionsSlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: 'satisfactory-planner',
      partialize: (state) => ({
        buildings: state.buildings,
        connections: state.connections,
      }),
    },
  ),
);
