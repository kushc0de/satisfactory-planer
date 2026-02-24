import type { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { Connection, BeltMk, PlacedBuilding } from '../../types';
import { BUILDINGS } from '../../data/buildings';

export interface ConnectionsSlice {
  connections: Connection[];
  addConnection: (
    fromBuildingId: string,
    fromPortIndex: number,
    toBuildingId: string,
    toPortIndex: number,
    beltMk?: BeltMk,
  ) => string | null;
  removeConnection: (id: string) => void;
  setBeltMk: (id: string, mk: BeltMk) => void;
  removeConnectionsForBuilding: (buildingId: string) => void;
  clearConnections: () => void;
  loadConnections: (connections: Connection[]) => void;
}

export const createConnectionsSlice: StateCreator<ConnectionsSlice, [], [], ConnectionsSlice> = (set, get) => ({
  connections: [],

  addConnection: (fromBuildingId, fromPortIndex, toBuildingId, toPortIndex, beltMk = 1) => {
    // Validate port types and categories
    const state = get() as unknown as { buildings: PlacedBuilding[] };
    const fromBuilding = state.buildings?.find((b: PlacedBuilding) => b.id === fromBuildingId);
    const toBuilding = state.buildings?.find((b: PlacedBuilding) => b.id === toBuildingId);

    if (fromBuilding && toBuilding) {
      const fromDef = BUILDINGS[fromBuilding.type];
      const toDef = BUILDINGS[toBuilding.type];
      const outputPorts = fromDef.ports.filter((p) => p.type === 'output');
      const inputPorts = toDef.ports.filter((p) => p.type === 'input');
      const fromPort = outputPorts[fromPortIndex];
      const toPort = inputPorts[toPortIndex];

      if (fromPort && toPort && fromPort.category !== toPort.category) {
        // Category mismatch — cannot connect conveyor to pipe
        return null;
      }
    }

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
