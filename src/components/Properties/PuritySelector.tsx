import type { Purity } from '../../types';
import { PURITY_LABELS } from '../../data/purity';

interface Props {
  value: Purity;
  onChange: (purity: Purity) => void;
}

const PURITIES: Purity[] = ['impure', 'normal', 'pure'];

export default function PuritySelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Reinheit
      </label>
      <div className="flex gap-1">
        {PURITIES.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`
              flex-1 py-1.5 text-sm font-medium rounded-md border transition-all
              ${value === p
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
              }
            `}
          >
            {PURITY_LABELS[p]}
          </button>
        ))}
      </div>
    </div>
  );
}
