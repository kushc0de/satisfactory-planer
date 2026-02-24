import type { BeltDef, BeltMk } from '../types';

export const BELTS: Record<BeltMk, BeltDef> = {
  1: { mk: 1, label: 'Förderband MK1', throughput: 60 },
  2: { mk: 2, label: 'Förderband MK2', throughput: 120 },
  3: { mk: 3, label: 'Förderband MK3', throughput: 270 },
  4: { mk: 4, label: 'Förderband MK4', throughput: 480 },
  5: { mk: 5, label: 'Förderband MK5', throughput: 780 },
  6: { mk: 6, label: 'Förderband MK6', throughput: 1200 },
};

export function getBeltThroughput(mk: BeltMk): number {
  return BELTS[mk].throughput;
}
