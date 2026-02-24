import { BUILDING_LIST } from '../../data/buildings';
import PaletteItem from './PaletteItem';

export default function BuildingPalette() {
  return (
    <aside className="w-60 flex-shrink-0 bg-[#0f0f1a] border-r border-gray-800/80 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-800/80">
        <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Gebäude</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {BUILDING_LIST.map((b) => (
          <PaletteItem key={b.type} building={b} />
        ))}
      </div>
      <div className="px-4 py-2 border-t border-gray-800/80">
        <p className="text-xs text-gray-600">Ziehen um zu platzieren</p>
      </div>
    </aside>
  );
}
