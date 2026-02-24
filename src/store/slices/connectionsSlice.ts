import type { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { Connection, BeltMk } from '../../types';

export interface ConnectionsSlice {
  connections: Connection[];
  addConnection: (
    fromBuildingId: string,
    fromPortIndex: number,
    toBuildingId: string,
    toPortIndex: number,
    beltMk?: BeltMk,
  ) => string;
  removeConnection: (id: string) => void;
  setBeltMk: (id: string, mk: BeltMk) => void;
  removeConnectionsForBuilding: (buildingId: string) => void;
  clearConnections: () => void;
  loadConnections: (connections: Connection[]) => void;
}

export const createConnectionsSlice: StateCreator<ConnectionsSlice, [], [], ConnectionsSlice> = (set) => ({
  connections: [],

  addConnection: (fromBuildingId, fromPortIndex, toBuildingId, toPortIndex, beltMk = 1) => {
    const id = nanoid();
    set((state) => ({
      connections: [
        ...state.connections,
        { id, fromBuildingId, fromPortIndex, toBuildingId, toPortIndex, beltMk },
      ],
    }));
    return id;
  },

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
    })),

  setBeltMk: (id, mk) =>
    set((state) => ({
      connections: state.connections.map((c) =>
        c.id === id ? { ...c, beltMk: mk } : c,
      ),
    })),

  removeConnectionsForBuilding: (buildingId) =>
    set((state) => ({
      connections: state.connections.filter(
        (c) => c.fromBuildingId !== buildingId && c.toBuildingId !== buildingId,
      ),
    })),

  clearConnections: () => set({ connections: [] }),

  loadConnections: (connections) => set({ connections }),
});
