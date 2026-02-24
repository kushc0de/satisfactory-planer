import { describe, it, expect } from 'vitest';
import { calcOverclockedPower, calcClockMultiplier } from '../overclock';

describe('calcOverclockedPower', () => {
  it('returns base power at 100%', () => {
    expect(calcOverclockedPower(4, 100)).toBeCloseTo(4, 5);
  });

  it('returns lower power at 50%', () => {
    // 4 * (0.5)^1.321928 ≈ 1.6
    const result = calcOverclockedPower(4, 50);
    expect(result).toBeCloseTo(4 * Math.pow(0.5, 1.321928), 5);
  });

  it('returns higher power at 200%', () => {
    // 4 * (2.0)^1.321928
    const result = calcOverclockedPower(4, 200);
    expect(result).toBeCloseTo(4 * Math.pow(2.0, 1.321928), 5);
  });

  it('returns 0 for 0 MW base power (logistics)', () => {
    expect(calcOverclockedPower(0, 150)).toBe(0);
  });

  it('clamps clock to minimum 1%', () => {
    const result = calcOverclockedPower(4, -50);
    expect(result).toBeCloseTo(4 * Math.pow(0.01, 1.321928), 3);
  });

  it('clamps clock to maximum 250%', () => {
    const at250 = calcOverclockedPower(4, 250);
    const at300 = calcOverclockedPower(4, 300);
    expect(at250).toBeCloseTo(at300, 5);
  });

  it('calculates correctly for miner at 5 MW, 150%', () => {
    const result = calcOverclockedPower(5, 150);
    expect(result).toBeCloseTo(5 * Math.pow(1.5, 1.321928), 5);
  });
});

describe('calcClockMultiplier', () => {
  it('returns 1.0 at 100%', () => {
    expect(calcClockMultiplier(100)).toBe(1.0);
  });

  it('returns 1.5 at 150%', () => {
    expect(calcClockMultiplier(150)).toBe(1.5);
  });

  it('returns 2.5 at 250%', () => {
    expect(calcClockMultiplier(250)).toBe(2.5);
  });

  it('clamps to minimum 0.01', () => {
    expect(calcClockMultiplier(0)).toBe(0.01);
  });

  it('clamps to maximum 2.5', () => {
    expect(calcClockMultiplier(999)).toBe(2.5);
  });
});
