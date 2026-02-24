import type { StateCreator } from 'zustand';
import type { ConnectionDraft, PlacementMode, Rotation } from '../../types';

const ROTATION_CYCLE: Rotation[] = [0, 90, 180, 270];

export interface UiSlice {
  selectedBuildingId: string | null;
  selectedConnectionId: string | null;
  connectionDraft: ConnectionDraft | null;
  placementMode: PlacementMode | null;
  selectBuilding: (id: string | null) => void;
  selectConnection: (id: string | null) => void;
  startConnectionDraft: (fromBuildingId: string, fromPortIndex: number) => void;
  cancelConnectionDraft: () => void;
  clearSelection: () => void;
  setPlacementMode: (mode: PlacementMode | null) => void;
  cancelPlacement: () => void;
  cyclePlacementRotation: () => void;
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  selectedBuildingId: null,
  selectedConnectionId: null,
  connectionDraft: null,
  placementMode: null,

  selectBuilding: (id) =>
    set({ selectedBuildingId: id, selectedConnectionId: null }),

  selectConnection: (id) =>
    set({ selectedConnectionId: id, selectedBuildingId: null }),

  startConnectionDraft: (fromBuildingId, fromPortIndex) =>
    set({ connectionDraft: { fromBuildingId, fromPortIndex } }),

  cancelConnectionDraft: () => set({ connectionDraft: null }),

  clearSelection: () =>
    set({ selectedBuildingId: null, selectedConnectionId: null, connectionDraft: null }),

  setPlacementMode: (mode) =>
    set({ placementMode: mode, connectionDraft: null }),

  cancelPlacement: () => set({ placementMode: null, connectionDraft: null }),

  cyclePlacementRotation: () =>
    set((state) => {
      if (!state.placementMode || state.placementMode.kind !== 'building') return state;
      const currentRotation = state.placementMode.rotation;
      const idx = ROTATION_CYCLE.indexOf(currentRotation);
      const nextRotation = ROTATION_CYCLE[(idx + 1) % 4];
      return {
        placementMode: {
          ...state.placementMode,
          rotation: nextRotation,
        },
      };
    }),
});
