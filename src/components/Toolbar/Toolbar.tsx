import { useStore } from '../../store/store';
import { exportFactory, importFactory, downloadJson } from '../../utils/serialization';
import { useRef } from 'react';

export default function Toolbar() {
  const buildings = useStore((s) => s.buildings);
  const connections = useStore((s) => s.connections);
  const loadBuildings = useStore((s) => s.loadBuildings);
  const loadConnections = useStore((s) => s.loadConnections);
  const clearBuildings = useStore((s) => s.clearBuildings);
  const clearConnections = useStore((s) => s.clearConnections);
  const clearSelection = useStore((s) => s.clearSelection);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportFactory(buildings, connections);
    downloadJson(json, 'fabrik-layout.json');
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = importFactory(text);
      if ('error' in result) {
        alert(`Import-Fehler: ${result.error}`);
        return;
      }
      clearSelection();
      loadBuildings(result.buildings);
      loadConnections(result.connections);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    if (buildings.length === 0 && connections.length === 0) return;
    if (confirm('Gesamte Fabrik löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      clearSelection();
      clearBuildings();
      clearConnections();
    }
  };

  return (
    <header className="h-12 bg-[#0f0f1a] border-b border-gray-800/80 flex items-center px-4 gap-3 flex-shrink-0">
      <div className="flex items-center gap-2 mr-auto">
        <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="#F59E0B" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.6" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.6" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.3" />
          </svg>
        </div>
        <h1 className="text-sm font-bold text-gray-200 tracking-wide">
          Satisfactory <span className="text-amber-500">Fabrikplaner</span>
        </h1>
      </div>

      <button
        onClick={handleExport}
        className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-700 text-gray-300
          hover:border-amber-500/50 hover:text-amber-400 transition-colors"
      >
        Exportieren
      </button>

      <button
        onClick={handleImport}
        className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-700 text-gray-300
          hover:border-amber-500/50 hover:text-amber-400 transition-colors"
      >
        Importieren
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-px h-5 bg-gray-800" />

      <button
        onClick={handleClear}
        className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-700 text-gray-300
          hover:border-red-500/50 hover:text-red-400 transition-colors"
      >
        Zurücksetzen
      </button>
    </header>
  );
}
