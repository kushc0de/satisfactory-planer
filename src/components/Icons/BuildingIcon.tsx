import type { BuildingType } from '../../types';

type ShapeType = 'pickaxe' | 'flame' | 'gear' | 'gears' | 'foundry' | 'split' | 'merge'
  | 'manufacturer' | 'refinery' | 'packager' | 'blender' | 'particle' | 'water' | 'oil'
  | 'converter' | 'quantum' | 'power' | 'sink' | 'storage' | 'buffer' | 'junction';

const ICON_CONFIGS: Record<BuildingType, { color: string; shape: ShapeType }> = {
  miner: { color: '#F59E0B', shape: 'pickaxe' },
  smelter: { color: '#EF4444', shape: 'flame' },
  constructor: { color: '#3B82F6', shape: 'gear' },
  assembler: { color: '#8B5CF6', shape: 'gears' },
  foundry: { color: '#F97316', shape: 'foundry' },
  splitter: { color: '#10B981', shape: 'split' },
  merger: { color: '#06B6D4', shape: 'merge' },
  manufacturer: { color: '#A855F7', shape: 'manufacturer' },
  refinery: { color: '#FB923C', shape: 'refinery' },
  packager: { color: '#22D3EE', shape: 'packager' },
  blender: { color: '#84CC16', shape: 'blender' },
  particle_accelerator: { color: '#EC4899', shape: 'particle' },
  converter: { color: '#D946EF', shape: 'converter' },
  quantum_encoder: { color: '#7C3AED', shape: 'quantum' },
  water_extractor: { color: '#0EA5E9', shape: 'water' },
  oil_extractor: { color: '#854D0E', shape: 'oil' },
  coal_generator: { color: '#16A34A', shape: 'power' },
  fuel_generator: { color: '#22C55E', shape: 'power' },
  nuclear_power_plant: { color: '#FACC15', shape: 'power' },
  biomass_burner: { color: '#65A30D', shape: 'power' },
  geothermal_generator: { color: '#EA580C', shape: 'power' },
  awesome_sink: { color: '#F472B6', shape: 'sink' },
  storage_container: { color: '#9CA3AF', shape: 'storage' },
  fluid_buffer: { color: '#67E8F9', shape: 'buffer' },
  pipeline_junction: { color: '#0891B2', shape: 'junction' },
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
      {/* Manufacturer — 4 input arrows into a box */}
      {config.shape === 'manufacturer' && (
        <>
          <rect x="12" y="8" width="14" height="16" rx="2" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
          {[11, 14, 17, 20].map((y) => (
            <line key={y} x1="5" y1={y} x2="12" y2={y} stroke={config.color} strokeWidth="1.5" strokeLinecap="round" />
          ))}
          <circle cx="19" cy="16" r="3" fill={config.color} fillOpacity="0.5" />
        </>
      )}
      {/* Refinery — distillation tower */}
      {config.shape === 'refinery' && (
        <>
          <rect x="10" y="6" width="12" height="20" rx="2" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
          <line x1="10" y1="12" x2="22" y2="12" stroke={config.color} strokeWidth="1" />
          <line x1="10" y1="18" x2="22" y2="18" stroke={config.color} strokeWidth="1" />
          <circle cx="16" cy="9" r="1.5" fill={config.color} />
          <circle cx="16" cy="15" r="1.5" fill={config.color} />
          <circle cx="16" cy="21" r="1.5" fill={config.color} />
        </>
      )}
      {/* Packager — box with lid */}
      {config.shape === 'packager' && (
        <>
          <rect x="8" y="12" width="16" height="12" rx="2" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
          <path d="M8 12L12 8H20L24 12" stroke={config.color} strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="16" y1="8" x2="16" y2="24" stroke={config.color} strokeWidth="1" strokeDasharray="2 2" />
        </>
      )}
      {/* Blender — mixing vessel */}
      {config.shape === 'blender' && (
        <>
          <path d="M10 8L8 24H24L22 8Z" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} strokeLinejoin="round" />
          <line x1="16" y1="10" x2="16" y2="22" stroke={config.color} strokeWidth="1.5" />
          <line x1="12" y1="14" x2="20" y2="14" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="18" x2="19" y2="18" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {/* Particle Accelerator — atom symbol */}
      {config.shape === 'particle' && (
        <>
          <circle cx="16" cy="16" r="3" fill={config.color} fillOpacity="0.6" />
          <ellipse cx="16" cy="16" rx="10" ry="4" stroke={config.color} strokeWidth="1.5" fill="none" />
          <ellipse cx="16" cy="16" rx="10" ry="4" stroke={config.color} strokeWidth="1.5" fill="none" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="10" ry="4" stroke={config.color} strokeWidth="1.5" fill="none" transform="rotate(120 16 16)" />
        </>
      )}
      {/* Water Extractor */}
      {config.shape === 'water' && (
        <>
          <path d="M16 8C16 8 10 16 10 20C10 23.3 12.7 26 16 26C19.3 26 22 23.3 22 20C22 16 16 8 16 8Z" fill={config.color + '44'} stroke={config.color} strokeWidth="1.5" />
        </>
      )}
      {/* Oil Extractor */}
      {config.shape === 'oil' && (
        <>
          <rect x="12" y="14" width="8" height="12" rx="1" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
          <path d="M14 14V8L16 6L18 8V14" stroke={config.color} strokeWidth="1.5" />
        </>
      )}
      {/* Converter */}
      {config.shape === 'converter' && (
        <>
          <path d="M8 16L16 8L24 16L16 24Z" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
          <circle cx="16" cy="16" r="3" fill={config.color} fillOpacity="0.5" />
        </>
      )}
      {/* Quantum Encoder */}
      {config.shape === 'quantum' && (
        <>
          <circle cx="16" cy="16" r="8" stroke={config.color} strokeWidth="1.5" fill={config.color + '22'} />
          <circle cx="16" cy="16" r="3" fill={config.color} />
          <path d="M16 8V6M16 26V24M8 16H6M26 16H24" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {/* Power Generator */}
      {config.shape === 'power' && (
        <path d="M18 6L10 18H16L14 26L22 14H16L18 6Z" fill={config.color} fillOpacity="0.6" stroke={config.color} strokeWidth="1.5" strokeLinejoin="round" />
      )}
      {/* AWESOME Sink */}
      {config.shape === 'sink' && (
        <>
          <rect x="8" y="10" width="16" height="14" rx="2" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
          <path d="M12 16L16 20L20 16" stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {/* Storage Container */}
      {config.shape === 'storage' && (
        <rect x="8" y="8" width="16" height="16" rx="2" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
      )}
      {/* Fluid Buffer */}
      {config.shape === 'buffer' && (
        <>
          <rect x="10" y="8" width="12" height="16" rx="6" stroke={config.color} strokeWidth="1.5" fill={config.color + '33'} />
          <line x1="10" y1="16" x2="22" y2="16" stroke={config.color} strokeWidth="1" strokeDasharray="2 2" />
        </>
      )}
      {/* Pipeline Junction */}
      {config.shape === 'junction' && (
        <>
          <line x1="6" y1="16" x2="26" y2="16" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="6" x2="16" y2="26" stroke={config.color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="3" fill={config.color} />
        </>
      )}
    </svg>
  );
}
