import { describe, it, expect } from 'vitest';
import { calcMinerOutput, calcRecipeProduction, calcBuildingProduction } from '../production';
import type { PlacedBuilding } from '../../types';

describe('calcMinerOutput', () => {
  it('MK1 Normal 100% = 60/min', () => {
    expect(calcMinerOutput(1, 'normal', 100)).toBe(60);
  });

  it('MK2 Normal 100% = 120/min', () => {
    expect(calcMinerOutput(2, 'normal', 100)).toBe(120);
  });

  it('MK3 Normal 100% = 240/min', () => {
    expect(calcMinerOutput(3, 'normal', 100)).toBe(240);
  });

  it('MK3 Pure 150% = 720/min', () => {
    expect(calcMinerOutput(3, 'pure', 150)).toBe(720);
  });

  it('MK1 Impure 100% = 30/min', () => {
    expect(calcMinerOutput(1, 'impure', 100)).toBe(30);
  });

  it('MK2 Pure 200% = 480/min', () => {
    expect(calcMinerOutput(2, 'pure', 200)).toBe(480);
  });
});

describe('calcRecipeProduction', () => {
  it('iron ingot at 100%: 30 ore/min in, 30 ingot/min out', () => {
    const result = calcRecipeProduction('iron_ingot', 100);
    expect(result).not.toBeNull();
    expect(result!.inputs[0].itemId).toBe('iron_ore');
    expect(result!.inputs[0].rate).toBe(30);
    expect(result!.outputs[0].itemId).toBe('iron_ingot');
    expect(result!.outputs[0].rate).toBe(30);
  });

  it('iron plate at 100%: 30 ingot/min in, 20 plate/min out', () => {
    const result = calcRecipeProduction('iron_plate', 100);
    expect(result).not.toBeNull();
    expect(result!.inputs[0].rate).toBe(30); // 3 per 6s = 30/min
    expect(result!.outputs[0].rate).toBe(20); // 2 per 6s = 20/min
  });

  it('scales linearly with overclock', () => {
    const result = calcRecipeProduction('iron_ingot', 200);
    expect(result).not.toBeNull();
    expect(result!.outputs[0].rate).toBe(60); // 30 * 2.0
  });

  it('returns null for unknown recipe', () => {
    expect(calcRecipeProduction('nonexistent', 100)).toBeNull();
  });

  it('steel_ingot foundry recipe at 100%', () => {
    const result = calcRecipeProduction('steel_ingot', 100);
    expect(result).not.toBeNull();
    // 3 iron_ore per 4s = 45/min, 3 coal per 4s = 45/min
    expect(result!.inputs).toHaveLength(2);
    expect(result!.inputs[0].rate).toBe(45);
    expect(result!.inputs[1].rate).toBe(45);
    // 3 steel_ingot per 4s = 45/min
    expect(result!.outputs[0].rate).toBe(45);
  });
});

describe('calcBuildingProduction', () => {
  it('miner building', () => {
    const building: PlacedBuilding = {
      id: 'test',
      type: 'miner',
      gridX: 0,
      gridY: 0,
      mkLevel: 3,
      overclock: 100,
      purity: 'pure',
      recipeId: null,
    };
    const result = calcBuildingProduction(building);
    expect(result.outputs[0].rate).toBe(480); // MK3 pure 100%
  });

  it('splitter returns empty', () => {
    const building: PlacedBuilding = {
      id: 'test',
      type: 'splitter',
      gridX: 0,
      gridY: 0,
      mkLevel: 1,
      overclock: 100,
      purity: 'normal',
      recipeId: null,
    };
    const result = calcBuildingProduction(building);
    expect(result.inputs).toHaveLength(0);
    expect(result.outputs).toHaveLength(0);
  });

  it('smelter with recipe', () => {
    const building: PlacedBuilding = {
      id: 'test',
      type: 'smelter',
      gridX: 0,
      gridY: 0,
      mkLevel: 1,
      overclock: 150,
      purity: 'normal',
      recipeId: 'iron_ingot',
    };
    const result = calcBuildingProduction(building);
    expect(result.outputs[0].rate).toBe(45); // 30 * 1.5
  });
});
