import { useStore } from '../../store/store';
import { useProjectsStore, saveProjectData } from '../../store/projectsStore';
import { exportFactory, importFactory, downloadJson } from '../../utils/serialization';
import { useRef, useState, useEffect } from 'react';

export default function Toolbar({ onOpenSolver }: { onOpenSolver: () => void }) {
  const buildings = useStore((s) => s.buildings);
  const connections = useStore((s) => s.connections);
  const loadBuildings = useStore((s) => s.loadBuildings);
  const loadConnections = useStore((s) => s.loadConnections);
  const clearBuildings = useStore((s) => s.clearBuildings);
  const clearConnections = useStore((s) => s.clearConnections);
  const clearSelection = useStore((s) => s.clearSelection);

  const currentProjectId = useProjectsStore((s) => s.currentProjectId);
  const projects = useProjectsStore((s) => s.projects);
  const closeProject = useProjectsStore((s) => s.closeProject);
  const renameProject = useProjectsStore((s) => s.renameProject);
  const updateProjectMeta = useProjectsStore((s) => s.updateProjectMeta);

  const currentProject = projects.find((p) => p.id === currentProjectId);
  const projectName = currentProject?.name ?? '';

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(projectName);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const handleBack = () => {
    // Save before going back
    if (currentProjectId) {
      const state = useStore.getState();
      saveProjectData(currentProjectId, {
        version: 2,
        buildings: state.buildings,
        connections: state.connections,
      });
      updateProjectMeta(currentProjectId, {
        updatedAt: Date.now(),
        buildingCount: state.buildings.length,
      });
    }
    clearSelection();
    closeProject();
  };

  const handleRenameSubmit = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== projectName && currentProjectId) {
      renameProject(currentProjectId, trimmed);
    } else {
      setEditName(projectName);
    }
    setEditing(false);
  };

  const handleExport = () => {
    const json = exportFactory(buildings, connections, projectName);
    const filename = projectName
      ? `${projectName.replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')}.json`
      : 'fabrik-layout.json';
    downloadJson(json, filename);
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
      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md
          text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
        title="Zurück zur Projektübersicht"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 2L4 7l5 5" />
        </svg>
        Projekte
      </button>

      <div className="w-px h-5 bg-gray-800" />

      {/* Logo + project name */}
      <div className="flex items-center gap-2 mr-auto">
        <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="#F59E0B" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.6" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.6" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.3" />
          </svg>
        </div>
        {editing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') { setEditName(projectName); setEditing(false); }
            }}
            className="text-sm font-bold text-gray-200 bg-transparent border-b border-amber-500/50
              outline-none max-w-[200px]"
            maxLength={50}
          />
        ) : (
          <h1
            className="text-sm font-bold text-gray-200 tracking-wide cursor-pointer hover:text-amber-400 transition-colors"
            onDoubleClick={() => { setEditName(projectName); setEditing(true); }}
            title="Doppelklick zum Umbenennen"
          >
            {projectName || 'Satisfactory Fabrikplaner'}
          </h1>
        )}
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
        onClick={onOpenSolver}
        className="px-3 py-1.5 text-xs font-medium rounded-md border border-amber-500/50 text-amber-400
          hover:bg-amber-500/10 transition-colors"
      >
        Solver
      </button>

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
