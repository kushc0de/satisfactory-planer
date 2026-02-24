import { GRID_SIZE } from '../../utils/grid';

export default function GridBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-small" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
          <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid-large" width={GRID_SIZE * 4} height={GRID_SIZE * 4} patternUnits="userSpaceOnUse">
          <rect width={GRID_SIZE * 4} height={GRID_SIZE * 4} fill="url(#grid-small)" />
          <path d={`M ${GRID_SIZE * 4} 0 L 0 0 0 ${GRID_SIZE * 4}`} fill="none" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-large)" />
    </svg>
  );
}
