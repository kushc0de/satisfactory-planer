import { useEffect, useRef } from 'react';
import type { PlacedBuilding, MkLevel } from '../../types';
import { BUILDINGS } from '../../data/buildings';
import { useStore } from '../../store/store';

interface Props {
  building: PlacedBuilding;
  x: number;
  y: number;
  onClose: () => void;
}

export default function BuildingContextMenu({ building, x, y, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const setMkLevel = useStore((s) => s.setMkLevel);
  const removeBuilding = useStore((s) => s.removeBuilding);
  const removeConnectionsForBuilding = useStore((s) => s.removeConnectionsForBuilding);

  const def = BUILDINGS[building.type];
  const hasMkLevels = def.maxMkLevel > 1;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSetMk = (level: MkLevel) => {
    setMkLevel(building.id, level);
    onClose();
  };

  const handleDelete = () => {
    removeConnectionsForBuilding(building.id);
    removeBuilding(building.id);
    onClose();
  };

  return (
    <div
      ref={ref}
      className="fixed z-[200] bg-[#1a1a2e] border border-gray-700 rounded-lg shadow-xl py-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-700/60 mb-1">
        {def.label}
      </div>

      {hasMkLevels && (
        <>
          <div className="px-3 py-1 text-xs text-gray-500">MK-Stufe</div>
          {([1, 2, 3] as MkLevel[])
            .filter((mk) => mk <= def.maxMkLevel)
            .map((mk) => (
              <button
                key={mk}
                onClick={() => handleSetMk(mk)}
                className={`
                  w-full text-left px-3 py-1.5 text-sm transition-colors
                  ${building.mkLevel === mk
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-gray-100'}
                `}
              >
                MK{mk}
                {building.mkLevel === mk && (
                  <span className="ml-2 text-xs text-amber-500">aktiv</span>
                )}
              </button>
            ))}
          <div className="border-t border-gray-700/60 my-1" />
        </>
      )}

      <button
        onClick={handleDelete}
        className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
      >
        Löschen
      </button>
    </div>
  );
}
