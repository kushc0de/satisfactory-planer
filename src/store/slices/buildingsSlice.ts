import type { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { PlacedBuilding, BuildingType, MkLevel, Purity, Rotation } from '../../types';

export interface BuildingsSlice {
  buildings: PlacedBuilding[];
  addBuilding: (type: BuildingType, gridX: number, gridY: number, rotation?: Rotation) => string;
  removeBuilding: (id: string) => void;
  moveBuilding: (id: string, gridX: number, gridY: number) => void;
  setMkLevel: (id: string, level: MkLevel) => void;
  setOverclock: (id: string, percent: number) => void;
  setPurity: (id: string, purity: Purity) => void;
  setRecipe: (id: string, recipeId: string | null) => void;
  setRotation: (id: string, rotation: Rotation) => void;
  rotateBuilding: (id: string) => void;
  setOreType: (id: string, oreType: string | null) => void;
  clearBuildings: () => void;
  loadBuildings: (buildings: PlacedBuilding[]) => void;
}

const ROTATION_CYCLE: Rotation[] = [0, 90, 180, 270];

export const createBuildingsSlice: StateCreator<BuildingsSlice, [], [], BuildingsSlice> = (set) => ({
  buildings: [],

  addBuilding: (type, gridX, gridY, rotation = 0) => {
    const id = nanoid();
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
          rotation,
          oreType: null,
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

  setRotation: (id, rotation) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, rotation } : b,
      ),
    })),

  rotateBuilding: (id) =>
    set((state) => ({
      buildings: state.buildings.map((b) => {
        if (b.id !== id) return b;
        const idx = ROTATION_CYCLE.indexOf(b.rotation);
        const nextRotation = ROTATION_CYCLE[(idx + 1) % 4];
        return { ...b, rotation: nextRotation };
      }),
    })),

  setOreType: (id, oreType) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, oreType } : b,
      ),
    })),

  clearBuildings: () => set({ buildings: [] }),

  loadBuildings: (buildings) => set({ buildings }),
});
