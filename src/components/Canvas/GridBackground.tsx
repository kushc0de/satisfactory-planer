import { GRID_SIZE } from '../../utils/grid';

const TILE = GRID_SIZE;
const GROUP = TILE * 4;

// Two slightly different grays for checkerboard concrete tiles
const TILE_A = '#1e1e2a';
const TILE_B = '#22222f';

export default function GridBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Single concrete tile with subtle cross pattern */}
        <pattern
          id="tile-a"
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
        >
          <rect width={TILE} height={TILE} fill={TILE_A} />
          {/* Subtle cross */}
          <line
            x1={TILE / 2} y1={4} x2={TILE / 2} y2={TILE - 4}
            stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"
          />
          <line
            x1={4} y1={TILE / 2} x2={TILE - 4} y2={TILE / 2}
            stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"
          />
          {/* Tile edge lines */}
          <path
            d={`M ${TILE} 0 L 0 0 0 ${TILE}`}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"
          />
        </pattern>

        <pattern
          id="tile-b"
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
        >
          <rect width={TILE} height={TILE} fill={TILE_B} />
          <line
            x1={TILE / 2} y1={4} x2={TILE / 2} y2={TILE - 4}
            stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"
          />
          <line
            x1={4} y1={TILE / 2} x2={TILE - 4} y2={TILE / 2}
            stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"
          />
          <path
            d={`M ${TILE} 0 L 0 0 0 ${TILE}`}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"
          />
        </pattern>

        {/* 2x2 checkerboard of tiles */}
        <pattern
          id="checkerboard"
          width={TILE * 2}
          height={TILE * 2}
          patternUnits="userSpaceOnUse"
        >
          <rect x={0} y={0} width={TILE} height={TILE} fill={TILE_A} />
          <rect x={TILE} y={0} width={TILE} height={TILE} fill={TILE_B} />
          <rect x={0} y={TILE} width={TILE} height={TILE} fill={TILE_B} />
          <rect x={TILE} y={TILE} width={TILE} height={TILE} fill={TILE_A} />
          {/* Cross marks on each tile */}
          {[0, TILE].map((tx) =>
            [0, TILE].map((ty) => (
              <g key={`${tx}-${ty}`}>
                <line
                  x1={tx + TILE / 2} y1={ty + 8}
                  x2={tx + TILE / 2} y2={ty + TILE - 8}
                  stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"
                />
                <line
                  x1={tx + 8} y1={ty + TILE / 2}
                  x2={tx + TILE - 8} y2={ty + TILE / 2}
                  stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"
                />
              </g>
            )),
          )}
          {/* Tile edge lines */}
          <line x1={TILE} y1={0} x2={TILE} y2={TILE * 2} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <line x1={0} y1={TILE} x2={TILE * 2} y2={TILE} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        </pattern>

        {/* Group pattern: amber accent lines every 4 tiles */}
        <pattern
          id="foundation"
          width={GROUP}
          height={GROUP}
          patternUnits="userSpaceOnUse"
        >
          <rect width={GROUP} height={GROUP} fill="url(#checkerboard)" />
          {/* Amber accent lines at group boundaries */}
          <line
            x1={0} y1={0} x2={GROUP} y2={0}
            stroke="rgba(245,158,11,0.1)" strokeWidth="1"
          />
          <line
            x1={0} y1={0} x2={0} y2={GROUP}
            stroke="rgba(245,158,11,0.1)" strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#foundation)" />
    </svg>
  );
}
