import type { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { PlacedBuilding, BuildingType, MkLevel, Purity } from '../../types';
import { BUILDINGS } from '../../data/buildings';

export interface BuildingsSlice {
  buildings: PlacedBuilding[];
  addBuilding: (type: BuildingType, gridX: number, gridY: number) => string;
  removeBuilding: (id: string) => void;
  moveBuilding: (id: string, gridX: number, gridY: number) => void;
  setMkLevel: (id: string, level: MkLevel) => void;
  setOverclock: (id: string, percent: number) => void;
  setPurity: (id: string, purity: Purity) => void;
  setRecipe: (id: string, recipeId: string | null) => void;
  clearBuildings: () => void;
  loadBuildings: (buildings: PlacedBuilding[]) => void;
}

export const createBuildingsSlice: StateCreator<BuildingsSlice, [], [], BuildingsSlice> = (set) => ({
  buildings: [],

  addBuilding: (type, gridX, gridY) => {
    const id = nanoid();
    const def = BUILDINGS[type];
    set((state) => ({
      buildings: [
        ...state.buildings,
        {
          id,
          type,
          gridX,
          gridY,
          mkLevel: 1 as MkLevel,
          overclock: 100,
          purity: 'normal' as Purity,
          recipeId: null,
        },
      ],
    }));
    return id;
  },

  removeBuilding: (id) =>
    set((state) => ({
      buildings: state.buildings.filter((b) => b.id !== id),
    })),

  moveBuilding: (id, gridX, gridY) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, gridX, gridY } : b,
      ),
    })),

  setMkLevel: (id, level) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, mkLevel: level } : b,
      ),
    })),

  setOverclock: (id, percent) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, overclock: Math.max(1, Math.min(250, percent)) } : b,
      ),
    })),

  setPurity: (id, purity) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, purity } : b,
      ),
    })),

  setRecipe: (id, recipeId) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, recipeId } : b,
      ),
    })),

  clearBuildings: () => set({ buildings: [] }),

  loadBuildings: (buildings) => set({ buildings }),
});
