import type { BeltDef } from '../../types';
import { useStore } from '../../store/store';
import { usePlacementMode } from '../../store/selectors';

interface Props {
  belt: BeltDef;
}

export default function BeltPaletteItem({ belt }: Props) {
  const setPlacementMode = useStore((s) => s.setPlacementMode);
  const placementMode = usePlacementMode();

  const isActive =
    placementMode?.kind === 'belt' && placementMode.beltMk === belt.mk;

  const handleClick = () => {
    if (isActive) {
      setPlacementMode(null);
    } else {
      setPlacementMode({ kind: 'belt', beltMk: belt.mk });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
        border transition-all duration-150 text-left
        ${isActive
          ? 'border-amber-500 bg-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
          : 'border-transparent hover:border-amber-500/40 hover:bg-amber-500/10'}
      `}
    >
      {/* Belt icon - simple conveyor line */}
      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="11" width="24" height="6" rx="1" fill="#6B7280" />
          <line x1="6" y1="11" x2="6" y2="17" stroke="#4B5563" strokeWidth="1" />
          <line x1="11" y1="11" x2="11" y2="17" stroke="#4B5563" strokeWidth="1" />
          <line x1="16" y1="11" x2="16" y2="17" stroke="#4B5563" strokeWidth="1" />
          <line x1="21" y1="11" x2="21" y2="17" stroke="#4B5563" strokeWidth="1" />
          {/* Arrow */}
          <path d="M22 14 L26 14 M24 12 L26 14 L24 16" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-100 truncate">
          MK{belt.mk}
          {isActive && (
            <span className="ml-2 text-xs text-amber-400 font-normal">aktiv</span>
          )}
        </div>
        <div className="text-xs text-gray-500 truncate">{belt.throughput}/min</div>
      </div>
    </button>
  );
}
