import type { PipeDef } from '../../types';
import { useStore } from '../../store/store';
import { usePlacementMode } from '../../store/selectors';

interface Props {
  pipe: PipeDef;
}

export default function PipePaletteItem({ pipe }: Props) {
  const setPlacementMode = useStore((s) => s.setPlacementMode);
  const placementMode = usePlacementMode();

  const isActive =
    placementMode?.kind === 'pipe' && placementMode.pipeMk === pipe.mk;

  const handleClick = () => {
    if (isActive) {
      setPlacementMode(null);
    } else {
      setPlacementMode({ kind: 'pipe', pipeMk: pipe.mk });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
        border transition-all duration-150 text-left h-[52px]
        ${isActive
          ? 'border-cyan-500 bg-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
          : 'border-transparent hover:border-cyan-500/40 hover:bg-cyan-500/10'}
      `}
    >
      {/* Pipe icon */}
      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="10" width="24" height="8" rx="4" fill="#0E7490" />
          <rect x="4" y="12" width="20" height="4" rx="2" fill="#06B6D4" opacity="0.4" />
          <path d="M22 14 L26 14 M24 12 L26 14 L24 16" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-100 truncate">
          MK{pipe.mk}
          {isActive && (
            <span className="ml-2 text-xs text-cyan-400 font-normal">aktiv</span>
          )}
        </div>
        <div className="text-xs text-gray-500 truncate">{pipe.throughput} m³/min</div>
      </div>
    </button>
  );
}
