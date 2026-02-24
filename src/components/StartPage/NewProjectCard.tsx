import { useState, useRef, useEffect } from 'react';

interface NewProjectCardProps {
  onCreate: (name: string) => void;
  onImport: (file: File) => void;
}

export default function NewProjectCard({ onCreate, onImport }: NewProjectCardProps) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onCreate(trimmed);
      setName('');
      setCreating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = '';
  };

  if (creating) {
    return (
      <div className="bg-[#12121f] border border-amber-500/50 rounded-lg p-5 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-amber-400">Neues Projekt</h3>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') { setName(''); setCreating(false); }
          }}
          placeholder="Projektname..."
          className="bg-[#0a0a15] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200
            placeholder-gray-600 outline-none focus:border-amber-500/50"
          maxLength={50}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-amber-500/20 border border-amber-500/50
              text-amber-400 hover:bg-amber-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Erstellen
          </button>
          <button
            onClick={() => { setName(''); setCreating(false); }}
            className="px-3 py-1.5 text-xs font-medium rounded border border-gray-700 text-gray-400
              hover:text-gray-300 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setCreating(true)}
        className="bg-[#12121f] border border-dashed border-gray-700 rounded-lg p-5 cursor-pointer
          hover:border-amber-500/50 hover:bg-[#16162a] transition-all duration-200
          flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-amber-400 min-h-[120px]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="text-sm font-medium">Neues Projekt</span>
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-[#12121f] border border-dashed border-gray-700 rounded-lg px-4 py-3 cursor-pointer
          hover:border-amber-500/50 hover:bg-[#16162a] transition-all duration-200
          flex items-center justify-center gap-2 text-gray-500 hover:text-amber-400"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 10V2M8 2L5 5M8 2l3 3M2 10v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3" />
        </svg>
        <span className="text-xs font-medium">JSON importieren</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
