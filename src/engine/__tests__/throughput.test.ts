import { describe, it, expect } from 'vitest';
import { checkBottleneck, findAllBottlenecks, effectiveThroughput } from '../throughput';
import type { Connection, PlacedBuilding } from '../../types';

const makeMiner = (id: string, mkLevel: 1 | 2 | 3, purity: 'impure' | 'normal' | 'pure', overclock = 100): PlacedBuilding => ({
  id,
  type: 'miner',
  gridX: 0,
  gridY: 0,
  mkLevel,
  overclock,
  purity,
  recipeId: null,
  rotation: 0,
  oreType: null,
});

const makeConnection = (id: string, fromId: string, toId: string, beltMk: 1 | 2 | 3 | 4 | 5 | 6 = 1): Connection => ({
  id,
  fromBuildingId: fromId,
  fromPortIndex: 0,
  toBuildingId: toId,
  toPortIndex: 0,
  beltMk,
  pipeMk: 1,
  connectionKind: 'belt',
});

describe('checkBottleneck', () => {
  it('MK1 belt with MK1 miner normal = no bottleneck', () => {
    const buildings = [makeMiner('m1', 1, 'normal')];
    const conn = makeConnection('c1', 'm1', 's1', 1);
    const result = checkBottleneck(conn, buildings);
    expect(result.isBottleneck).toBe(false);
    expect(result.requiredRate).toBe(60);
    expect(result.capacity).toBe(60);
  });

  it('MK1 belt with MK3 miner pure = bottleneck', () => {
    const buildings = [makeMiner('m1', 3, 'pure')];
    const conn = makeConnection('c1', 'm1', 's1', 1);
    const result = checkBottleneck(conn, buildings);
    expect(result.isBottleneck).toBe(true);
    expect(result.requiredRate).toBe(480);
  });

  it('MK5 belt with MK3 miner pure 150% = bottleneck', () => {
    const buildings = [makeMiner('m1', 3, 'pure', 150)];
    const conn = makeConnection('c1', 'm1', 's1', 5);
    const result = checkBottleneck(conn, buildings);
    // 240 * 2.0 * 1.5 = 720 > 780 = false wait, 720 < 780
    expect(result.isBottleneck).toBe(false);
  });
});

describe('findAllBottlenecks', () => {
  it('returns only bottlenecked connections', () => {
    const buildings = [
      makeMiner('m1', 1, 'normal'),
      makeMiner('m2', 3, 'pure'),
    ];
    const connections = [
      makeConnection('c1', 'm1', 's1', 1), // 60 <= 60 OK
      makeConnection('c2', 'm2', 's2', 1), // 480 > 60 bottleneck
    ];
    const bottlenecks = findAllBottlenecks(connections, buildings);
    expect(bottlenecks).toHaveLength(1);
    expect(bottlenecks[0].connectionId).toBe('c2');
  });
});

describe('effectiveThroughput', () => {
  it('returns rate when below belt capacity', () => {
    expect(effectiveThroughput(30, 1)).toBe(30);
  });

  it('returns belt capacity when rate exceeds it', () => {
    expect(effectiveThroughput(500, 1)).toBe(60);
  });

  it('returns belt capacity for MK3', () => {
    expect(effectiveThroughput(300, 3)).toBe(270);
  });
});
