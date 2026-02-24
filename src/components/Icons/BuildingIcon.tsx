import type { BuildingType } from '../../types';

const ICON_CONFIGS: Record<BuildingType, { color: string; shape: 'pickaxe' | 'flame' | 'gear' | 'gears' | 'foundry' | 'split' | 'merge' }> = {
  miner: { color: '#F59E0B', shape: 'pickaxe' },
  smelter: { color: '#EF4444', shape: 'flame' },
  constructor: { color: '#3B82F6', shape: 'gear' },
  assembler: { color: '#8B5CF6', shape: 'gears' },
  foundry: { color: '#F97316', shape: 'foundry' },
  splitter: { color: '#10B981', shape: 'split' },
  merger: { color: '#06B6D4', shape: 'merge' },
};

interface Props {
  type: BuildingType;
  size?: number;
}

export default function BuildingIcon({ type, size = 32 }: Props) {
  const config = ICON_CONFIGS[type];

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="30" height="30" rx="4" fill={config.color + '22'} stroke={config.color} strokeWidth="1.5" />
      {config.shape === 'pickaxe' && (
        <>
          <path d="M10 22L22 10" stroke={config.color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 8L24 8L24 14" stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {config.shape === 'flame' && (
        <path d="M16 6C16 6 12 12 12 17C12 20 14 24 16 24C18 24 20 20 20 17C20 12 16 6 16 6Z" fill={config.color} fillOpacity="0.6" stroke={config.color} strokeWidth="1.5" />
      )}
      {config.shape === 'gear' && (
        <>
          <circle cx="16" cy="16" r="5" stroke={config.color} strokeWidth="2" />
          <circle cx="16" cy="16" r="2" fill={config.color} />
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 16 + Math.cos(rad) * 5;
            const y1 = 16 + Math.sin(rad) * 5;
            const x2 = 16 + Math.cos(rad) * 8;
            const y2 = 16 + Math.sin(rad) * 8;
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={config.color} strokeWidth="2" strokeLinecap="round" />;
          })}
        </>
      )}
      {config.shape === 'gears' && (
        <>
          <circle cx="12" cy="14" r="4" stroke={config.color} strokeWidth="1.5" />
          <circle cx="12" cy="14" r="1.5" fill={config.color} />
          <circle cx="20" cy="18" r="4" stroke={config.color} strokeWidth="1.5" />
          <circle cx="20" cy="18" r="1.5" fill={config.color} />
        </>
      )}
      {config.shape === 'foundry' && (
        <>
          <rect x="8" y="12" width="16" height="14" rx="2" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
          <path d="M12 12V8L16 6L20 8V12" stroke={config.color} strokeWidth="1.5" strokeLinejoin="round" />
        </>
      )}
      {config.shape === 'split' && (
        <>
          <line x1="6" y1="16" x2="16" y2="16" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="16" x2="26" y2="8" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="16" x2="26" y2="16" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="16" x2="26" y2="24" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {config.shape === 'merge' && (
        <>
          <line x1="6" y1="8" x2="16" y2="16" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="16" x2="16" y2="16" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="24" x2="16" y2="16" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="16" x2="26" y2="16" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
