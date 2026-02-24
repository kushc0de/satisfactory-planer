import { useStore, type StoreState } from './store';
import { useShallow } from 'zustand/react/shallow';
import { calcBuildingPower, calcTotalPower, calcPowerConsumed, calcPowerProduced } from '../engine/power';
import { calcBuildingProduction } from '../engine/production';
import { findAllBottlenecks } from '../engine/throughput';
import type { PlacedBuilding, BuildingProduction, PlacementMode } from '../types';
import { BUILDINGS } from '../data/buildings';

export function usePlacementMode(): PlacementMode | null {
  return useStore((s) => s.placementMode);
}

/** Returns first selected building (for properties panel single-edit) */
export function useSelectedBuilding(): PlacedBuilding | null {
  return useStore((s) => {
    if (s.selectedBuildingIds.length === 0) return null;
    return s.buildings.find((b) => b.id === s.selectedBuildingIds[0]) ?? null;
  });
}

/** Returns all selected buildings */
export function useSelectedBuildings(): PlacedBuilding[] {
  return useStore(
    useShallow((s) =>
      s.selectedBuildingIds
        .map((id) => s.buildings.find((b) => b.id === id))
        .filter((b): b is PlacedBuilding => b != null),
    ),
  );
}

export function useTotalPower(): number {
  return useStore((s) => calcTotalPower(s.buildings));
}

export function usePowerConsumed(): number {
  return useStore((s) => calcPowerConsumed(s.buildings));
}

export function usePowerProduced(): number {
  return useStore((s) => calcPowerProduced(s.buildings));
}

export function useBuildingCount(): number {
  return useStore((s) => s.buildings.length);
}

export function useConnectionCount(): number {
  return useStore((s) => s.connections.length);
}

export function useBottlenecks() {
  return useStore(
    useShallow((s) => findAllBottlenecks(s.connections, s.buildings)),
  );
}

export function useBuildingProduction(buildingId: string): BuildingProduction | null {
  return useStore(
    useShallow((s) => {
      const building = s.buildings.find((b) => b.id === buildingId);
      if (!building) return null;
      const prod = calcBuildingProduction(building);
      const power = calcBuildingPower(building);
      return { buildingId, ...prod, power };
    }),
  );
}

export function useAllBuildingProductions(): BuildingProduction[] {
  return useStore(
    useShallow((s) =>
      s.buildings.map((b) => {
        const prod = calcBuildingProduction(b);
        const power = calcBuildingPower(b);
        return { buildingId: b.id, ...prod, power };
      }),
    ),
  );
}
