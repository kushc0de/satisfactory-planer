import { getRecipesForBuilding } from '../../data/recipes';
import type { BuildingType } from '../../types';

interface Props {
  buildingType: BuildingType;
  value: string | null;
  onChange: (recipeId: string | null) => void;
}

export default function RecipeSelector({ buildingType, value, onChange }: Props) {
  const recipes = getRecipesForBuilding(buildingType);
  if (recipes.length === 0) return null;

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Rezept
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200
          focus:outline-none focus:border-amber-500 cursor-pointer"
      >
        <option value="">-- Kein Rezept --</option>
        {recipes.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
