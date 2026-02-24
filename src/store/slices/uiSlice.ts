import type { StateCreator } from 'zustand';
import type { ConnectionDraft } from '../../types';

export interface UiSlice {
  selectedBuildingId: string | null;
  selectedConnectionId: string | null;
  connectionDraft: ConnectionDraft | null;
  selectBuilding: (id: string | null) => void;
  selectConnection: (id: string | null) => void;
  startConnectionDraft: (fromBuildingId: string, fromPortIndex: number) => void;
  cancelConnectionDraft: () => void;
  clearSelection: () => void;
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  selectedBuildingId: null,
  selectedConnectionId: null,
  connectionDraft: null,

  selectBuilding: (id) =>
    set({ selectedBuildingId: id, selectedConnectionId: null }),

  selectConnection: (id) =>
    set({ selectedConnectionId: id, selectedBuildingId: null }),

  startConnectionDraft: (fromBuildingId, fromPortIndex) =>
    set({ connectionDraft: { fromBuildingId, fromPortIndex } }),

  cancelConnectionDraft: () => set({ connectionDraft: null }),

  clearSelection: () =>
    set({ selectedBuildingId: null, selectedConnectionId: null, connectionDraft: null }),
});
