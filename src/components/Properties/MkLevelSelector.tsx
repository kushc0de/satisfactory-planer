import type { MkLevel } from '../../types';

interface Props {
  value: MkLevel;
  maxLevel: MkLevel;
  onChange: (level: MkLevel) => void;
}

export default function MkLevelSelector({ value, maxLevel, onChange }: Props) {
  if (maxLevel <= 1) return null;

  const levels: MkLevel[] = [1, 2, 3].filter((l) => l <= maxLevel) as MkLevel[];

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        MK-Stufe
      </label>
      <div className="flex gap-1">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`
              flex-1 py-1.5 text-sm font-bold rounded-md border transition-all
              ${value === level
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
              }
            `}
          >
            MK{level}
          </button>
        ))}
      </div>
    </div>
  );
}
