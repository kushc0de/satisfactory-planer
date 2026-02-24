import type { PipeDef, PipeMk } from '../types';

export const PIPES: Record<PipeMk, PipeDef> = {
  1: { mk: 1, label: 'Pipeline MK1', throughput: 300 },
  2: { mk: 2, label: 'Pipeline MK2', throughput: 600 },
};

export function getPipeThroughput(mk: PipeMk): number {
  return PIPES[mk].throughput;
}
