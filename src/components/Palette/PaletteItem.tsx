import { useDraggable } from '@dnd-kit/core';
import type { BuildingDef } from '../../types';
import BuildingIcon from '../Icons/BuildingIcon';

interface Props {
  building: BuildingDef;
}

export default function PaletteItem({ building }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${building.type}`,
    data: { type: 'palette', buildingType: building.type },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing
        border border-transparent
        hover:border-amber-500/40 hover:bg-amber-500/10
        transition-all duration-150
        ${isDragging ? 'opacity-50 scale-95 border-amber-500/60 bg-amber-500/15' : ''}
      `}
    >
      <BuildingIcon type={building.type} size={36} />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-100 truncate">{building.label}</div>
        <div className="text-xs text-gray-500 truncate">{building.description}</div>
      </div>
    </div>
  );
}
