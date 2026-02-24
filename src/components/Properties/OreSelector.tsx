import { ITEMS } from '../../data/items';

const ORE_TYPES = [
  'iron_ore',
  'copper_ore',
  'limestone',
  'coal',
  'caterium_ore',
  'bauxite',
  'raw_quartz',
  'sulfur',
  'uranium',
] as const;

interface Props {
  value: string | null;
  onChange: (oreType: string) => void;
}

export default function OreSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
        Erz-Typ
      </label>
      <select
        value={value ?? 'iron_ore'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200
          focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
      >
        {ORE_TYPES.map((oreId) => (
          <option key={oreId} value={oreId}>
            {ITEMS[oreId]?.label ?? oreId}
          </option>
        ))}
      </select>
    </div>
  );
}
