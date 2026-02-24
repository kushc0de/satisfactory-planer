import type { Purity } from '../types';

export const PURITY_MULTIPLIERS: Record<Purity, number> = {
  impure: 0.5,
  normal: 1.0,
  pure: 2.0,
};

export const PURITY_LABELS: Record<Purity, string> = {
  impure: 'Unrein',
  normal: 'Normal',
  pure: 'Rein',
};

export const MINER_BASE_RATES: Record<number, number> = {
  1: 60,  // MK1: 60 items/min
  2: 120, // MK2: 120 items/min
  3: 240, // MK3: 240 items/min
};
