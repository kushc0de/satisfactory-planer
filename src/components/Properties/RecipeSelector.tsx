import { getStandardRecipesForBuilding, getAlternateRecipesForBuilding } from '../../data/recipes/index';
import type { BuildingType } from '../../types';

interface Props {
  buildingType: BuildingType;
  value: string | null;
  onChange: (recipeId: string | null) => void;
}

export default function RecipeSelector({ buildingType, value, onChange }: Props) {
  const standardRecipes = getStandardRecipesForBuilding(buildingType);
  const alternateRecipes = getAlternateRecipesForBuilding(buildingType);

  if (standardRecipes.length === 0 && alternateRecipes.length === 0) return null;

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
        {standardRecipes.length > 0 && (
          <optgroup label="Standard">
            {standardRecipes.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </optgroup>
        )}
        {alternateRecipes.length > 0 && (
          <optgroup label="Alternativ">
            {alternateRecipes.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
}
