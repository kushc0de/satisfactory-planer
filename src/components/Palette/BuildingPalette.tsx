import { BUILDING_LIST } from '../../data/buildings';
import { BELTS } from '../../data/belts';
import type { BeltMk, BuildingDef } from '../../types';
import PaletteItem from './PaletteItem';
import BeltPaletteItem from './BeltPaletteItem';

const BELT_LIST = ([1, 2, 3, 4, 5, 6] as BeltMk[]).map((mk) => BELTS[mk]);

const CATEGORIES: { key: BuildingDef['category']; label: string }[] = [
  { key: 'extraction', label: 'Abbau' },
  { key: 'smelting', label: 'Verhüttung' },
  { key: 'production', label: 'Fertigung' },
  { key: 'processing', label: 'Verarbeitung' },
  { key: 'logistics', label: 'Logistik' },
];

export default function BuildingPalette() {
  return (
    <aside className="w-60 flex-shrink-0 bg-[#0f0f1a] border-r border-gray-800/80 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-800/80">
        <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Gebäude</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {CATEGORIES.map((cat) => {
          const buildings = BUILDING_LIST.filter((b) => b.category === cat.key);
          if (buildings.length === 0) return null;
          return (
            <div key={cat.key}>
              <div className="px-2 pt-2 pb-1">
                <h3 className="text-xs font-bold text-amber-500/80 uppercase tracking-wider">{cat.label}</h3>
              </div>
              {buildings.map((b) => (
                <PaletteItem key={b.type} building={b} />
              ))}
            </div>
          );
        })}

        {/* Belt section */}
        <div className="pt-3 mt-2 border-t border-gray-800/60">
          <div className="px-2 pb-2">
            <h3 className="text-xs font-bold text-amber-500/80 uppercase tracking-wider">Förderband</h3>
          </div>
          {BELT_LIST.map((belt) => (
            <BeltPaletteItem key={belt.mk} belt={belt} />
          ))}
        </div>
      </div>
      <div className="px-4 py-2 border-t border-gray-800/80">
        <p className="text-xs text-gray-600">Klicken um zu platzieren</p>
      </div>
    </aside>
  );
}
