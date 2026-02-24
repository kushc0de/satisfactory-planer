import { create } from 'zustand';
import { createBuildingsSlice, type BuildingsSlice } from './slices/buildingsSlice';
import { createConnectionsSlice, type ConnectionsSlice } from './slices/connectionsSlice';
import { createUiSlice, type UiSlice } from './slices/uiSlice';

export type StoreState = BuildingsSlice & ConnectionsSlice & UiSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createBuildingsSlice(...a),
  ...createConnectionsSlice(...a),
  ...createUiSlice(...a),
}));
