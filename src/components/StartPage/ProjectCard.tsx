import { useState, useRef, useEffect } from 'react';
import type { ProjectMeta } from '../../types';

interface ProjectCardProps {
  project: ProjectMeta;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ProjectCard({ project, onOpen, onRename, onDelete }: ProjectCardProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const handleSubmitRename = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== project.name) {
      onRename(project.id, trimmed);
    } else {
      setEditName(project.name);
    }
    setEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Projekt "${project.name}" wirklich löschen?`)) {
      onDelete(project.id);
    }
  };

  return (
    <div
      onClick={() => onOpen(project.id)}
      className="group relative bg-[#12121f] border border-gray-800/80 rounded-lg p-5 cursor-pointer
        hover:border-amber-500/50 hover:bg-[#16162a] transition-all duration-200"
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 w-7 h-7 rounded flex items-center justify-center
          text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all"
        title="Löschen"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4h10M5 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M11 4v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4" />
        </svg>
      </button>

      {/* Project name */}
      {editing ? (
        <input
          ref={inputRef}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSubmitRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmitRename();
            if (e.key === 'Escape') { setEditName(project.name); setEditing(false); }
          }}
          onClick={(e) => e.stopPropagation()}
          className="text-base font-semibold text-gray-100 bg-transparent border-b border-amber-500/50
            outline-none w-full mb-3 pb-0.5"
          maxLength={50}
        />
      ) : (
        <h3
          className="text-base font-semibold text-gray-100 mb-3 truncate pr-8"
          onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
          title="Doppelklick zum Umbenennen"
        >
          {project.name}
        </h3>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="3" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3 3V1.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V3" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {project.buildingCount} Gebäude
        </span>
        <span>{formatDate(project.updatedAt)}</span>
      </div>
    </div>
  );
}
