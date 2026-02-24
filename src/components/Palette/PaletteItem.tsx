import type { BuildingDef } from '../../types';
import { useStore } from '../../store/store';
import { usePlacementMode } from '../../store/selectors';
import BuildingIcon from '../Icons/BuildingIcon';

interface Props {
  building: BuildingDef;
}

export default function PaletteItem({ building }: Props) {
  const setPlacementMode = useStore((s) => s.setPlacementMode);
  const placementMode = usePlacementMode();

  const isActive =
    placementMode?.kind === 'building' &&
    placementMode.buildingType === building.type;

  const handleClick = () => {
    if (isActive) {
      setPlacementMode(null);
    } else {
      setPlacementMode({ kind: 'building', buildingType: building.type });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
        border transition-all duration-150 text-left
        ${isActive
          ? 'border-amber-500 bg-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
          : 'border-transparent hover:border-amber-500/40 hover:bg-amber-500/10'}
      `}
    >
      <BuildingIcon type={building.type} size={36} />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-100 truncate">
          {building.label}
          {isActive && (
            <span className="ml-2 text-xs text-amber-400 font-normal">aktiv</span>
          )}
        </div>
        <div className="text-xs text-gray-500 truncate">{building.description}</div>
      </div>
    </button>
  );
}
