import type { ProductionRate } from '../../types';
import { ITEMS } from '../../data/items';

interface Props {
  inputs: ProductionRate[];
  outputs: ProductionRate[];
  power: number;
}

function getItemLabel(itemId: string): string {
  return ITEMS[itemId]?.label ?? itemId;
}

export default function ProductionDisplay({ inputs, outputs, power }: Props) {
  const hasData = inputs.length > 0 || outputs.length > 0;

  return (
    <div className="space-y-3">
      {outputs.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Produktion
          </label>
          <div className="space-y-1">
            {outputs.map((o) => (
              <div key={o.itemId} className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-md px-3 py-1.5">
                <span className="text-xs text-green-300">{getItemLabel(o.itemId)}</span>
                <span className="text-sm font-mono font-bold text-green-400">{o.rate.toFixed(1)}/min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {inputs.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Verbrauch
          </label>
          <div className="space-y-1">
            {inputs.map((i) => (
              <div key={i.itemId} className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-md px-3 py-1.5">
                <span className="text-xs text-blue-300">{getItemLabel(i.itemId)}</span>
                <span className="text-sm font-mono font-bold text-blue-400">{i.rate.toFixed(1)}/min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {power > 0 && (
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Energieverbrauch
          </label>
          <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-md px-3 py-1.5">
            <span className="text-xs text-yellow-300">Leistung</span>
            <span className="text-sm font-mono font-bold text-yellow-400">{power.toFixed(1)} MW</span>
          </div>
        </div>
      )}

      {!hasData && power === 0 && (
        <p className="text-xs text-gray-600 italic">Kein Rezept ausgewählt</p>
      )}
    </div>
  );
}
