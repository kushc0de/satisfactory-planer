import { describe, it, expect } from 'vitest';
import { calcBuildingPower, calcTotalPower } from '../power';
import type { PlacedBuilding } from '../../types';

const makeBuilding = (overrides: Partial<PlacedBuilding>): PlacedBuilding => ({
  id: 'test',
  type: 'smelter',
  gridX: 0,
  gridY: 0,
  mkLevel: 1,
  overclock: 100,
  purity: 'normal',
  recipeId: null,
  rotation: 0,
  oreType: null,
  ...overrides,
});

describe('calcBuildingPower', () => {
  it('smelter at 100% = 4 MW', () => {
    expect(calcBuildingPower(makeBuilding({ type: 'smelter' }))).toBeCloseTo(4, 5);
  });

  it('miner at 100% = 5 MW', () => {
    expect(calcBuildingPower(makeBuilding({ type: 'miner' }))).toBeCloseTo(5, 5);
  });

  it('splitter = 0 MW', () => {
    expect(calcBuildingPower(makeBuilding({ type: 'splitter' }))).toBe(0);
  });

  it('merger = 0 MW', () => {
    expect(calcBuildingPower(makeBuilding({ type: 'merger' }))).toBe(0);
  });

  it('assembler at 150% uses overclock formula', () => {
    const result = calcBuildingPower(makeBuilding({ type: 'assembler', overclock: 150 }));
    expect(result).toBeCloseTo(15 * Math.pow(1.5, 1.321928), 3);
  });
});

describe('calcTotalPower', () => {
  it('sums power of all buildings', () => {
    const buildings = [
      makeBuilding({ id: '1', type: 'smelter' }),
      makeBuilding({ id: '2', type: 'miner' }),
      makeBuilding({ id: '3', type: 'splitter' }),
    ];
    expect(calcTotalPower(buildings)).toBeCloseTo(9, 5); // 4 + 5 + 0
  });

  it('returns 0 for empty factory', () => {
    expect(calcTotalPower([])).toBe(0);
  });
});
