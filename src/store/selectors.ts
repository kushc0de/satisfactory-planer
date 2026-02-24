import { useStore, type StoreState } from './store';
import { calcBuildingPower, calcTotalPower } from '../engine/power';
import { calcBuildingProduction } from '../engine/production';
import { findAllBottlenecks } from '../engine/throughput';
import type { PlacedBuilding, BuildingProduction } from '../types';
import { BUILDINGS } from '../data/buildings';

export function useSelectedBuilding(): PlacedBuilding | null {
  return useStore((s) => {
    if (!s.selectedBuildingId) return null;
    return s.buildings.find((b) => b.id === s.selectedBuildingId) ?? null;
  });
}

export function useTotalPower(): number {
  return useStore((s) => calcTotalPower(s.buildings));
}

export function useBuildingCount(): number {
  return useStore((s) => s.buildings.length);
}

export function useConnectionCount(): number {
  return useStore((s) => s.connections.length);
}

export function useBottlenecks() {
  return useStore((s) => findAllBottlenecks(s.connections, s.buildings));
}

export function useBuildingProduction(buildingId: string): BuildingProduction | null {
  return useStore((s) => {
    const building = s.buildings.find((b) => b.id === buildingId);
    if (!building) return null;
    const prod = calcBuildingProduction(building);
    const power = calcBuildingPower(building);
    return { buildingId, ...prod, power };
  });
}

export function useAllBuildingProductions(): BuildingProduction[] {
  return useStore((s) =>
    s.buildings.map((b) => {
      const prod = calcBuildingProduction(b);
      const power = calcBuildingPower(b);
      return { buildingId: b.id, ...prod, power };
    }),
  );
}
