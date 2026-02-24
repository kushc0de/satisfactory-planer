interface Props {
  value: number;
  onChange: (percent: number) => void;
}

export default function OverclockSlider({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Übertakten
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={250}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500
            [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(245,158,11,0.5)]
            [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={1}
            max={250}
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= 250) onChange(v);
            }}
            className="w-14 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-center text-amber-400 font-mono
              focus:outline-none focus:border-amber-500"
          />
          <span className="text-xs text-gray-500">%</span>
        </div>
      </div>
      {value > 100 && (
        <p className="text-[10px] text-amber-600 mt-1">
          Erhöhter Energieverbrauch bei Übertaktung
        </p>
      )}
    </div>
  );
}
