import type { StateCreator } from 'zustand';
import type { BuildingType, ConnectionDraft, PlacementMode, Rotation } from '../../types';

const ROTATION_CYCLE: Rotation[] = [0, 90, 180, 270];

export interface BuildingClipboard {
  buildingType: BuildingType;
  recipeId: string | null;
  overclock: number;
  mkLevel: number;
  purity: string;
  oreType: string | null;
}

export interface UiSlice {
  selectedBuildingIds: string[];
  selectedConnectionId: string | null;
  connectionDraft: ConnectionDraft | null;
  placementMode: PlacementMode | null;
  clipboard: BuildingClipboard | null;
  selectBuilding: (id: string) => void;
  toggleBuildingSelection: (id: string) => void;
  selectConnection: (id: string | null) => void;
  startConnectionDraft: (fromBuildingId: string, fromPortIndex: number) => void;
  cancelConnectionDraft: () => void;
  clearSelection: () => void;
  setPlacementMode: (mode: PlacementMode | null) => void;
  cancelPlacement: () => void;
  cyclePlacementRotation: () => void;
  setClipboard: (clip: BuildingClipboard) => void;
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  selectedBuildingIds: [],
  selectedConnectionId: null,
  connectionDraft: null,
  placementMode: null,
  clipboard: null,

  selectBuilding: (id) =>
    set({ selectedBuildingIds: [id], selectedConnectionId: null }),

  toggleBuildingSelection: (id) =>
    set((state) => {
      const ids = state.selectedBuildingIds;
      if (ids.includes(id)) {
        return { selectedBuildingIds: ids.filter((x) => x !== id) };
      }
      return { selectedBuildingIds: [...ids, id], selectedConnectionId: null };
    }),

  selectConnection: (id) =>
    set({ selectedConnectionId: id, selectedBuildingIds: [] }),

  startConnectionDraft: (fromBuildingId, fromPortIndex) =>
    set({ connectionDraft: { fromBuildingId, fromPortIndex } }),

  cancelConnectionDraft: () => set({ connectionDraft: null }),

  clearSelection: () =>
    set({ selectedBuildingIds: [], selectedConnectionId: null, connectionDraft: null }),

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

  setClipboard: (clip) => set({ clipboard: clip }),
});
