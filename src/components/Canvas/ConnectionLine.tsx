import type { Connection as ConnectionType, PlacedBuilding } from '../../types';
import { BUILDINGS } from '../../data/buildings';
import { gridToPixel, GRID_SIZE } from '../../utils/grid';
import { useStore } from '../../store/store';
import { checkBottleneck } from '../../engine/throughput';
import { BELTS } from '../../data/belts';

interface Props {
  connection: ConnectionType;
  buildings: PlacedBuilding[];
}

function getPortPosition(
  building: PlacedBuilding,
  portType: 'input' | 'output',
  portIndex: number,
): { x: number; y: number } | null {
  const def = BUILDINGS[building.type];
  if (!def) return null;

  const px = gridToPixel(building.gridX);
  const py = gridToPixel(building.gridY);
  const width = def.gridWidth * GRID_SIZE;
  const height = def.gridHeight * GRID_SIZE;

  const total = portType === 'input' ? def.inputCount : def.outputCount;
  const spacing = height / (total + 1);

  return {
    x: portType === 'output' ? px + width : px,
    y: py + spacing * (portIndex + 1),
  };
}

export default function ConnectionLine({ connection, buildings }: Props) {
  const selectedConnectionId = useStore((s) => s.selectedConnectionId);
  const selectConnection = useStore((s) => s.selectConnection);
  const isSelected = selectedConnectionId === connection.id;

  const fromBuilding = buildings.find((b) => b.id === connection.fromBuildingId);
  const toBuilding = buildings.find((b) => b.id === connection.toBuildingId);
  if (!fromBuilding || !toBuilding) return null;

  const from = getPortPosition(fromBuilding, 'output', connection.fromPortIndex);
  const to = getPortPosition(toBuilding, 'input', connection.toPortIndex);
  if (!from || !to) return null;

  const bottleneck = checkBottleneck(connection, buildings);
  const beltLabel = BELTS[connection.beltMk].label;

  // Bezier control points for smooth curves
  const dx = Math.abs(to.x - from.x) * 0.5;
  const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        selectConnection(connection.id);
      }}
    >
      {/* Hit area */}
      <path d={path} fill="none" stroke="transparent" strokeWidth="12" />
      {/* Visible line */}
      <path
        d={path}
        fill="none"
        stroke={
          bottleneck.isBottleneck
            ? '#EF4444'
            : isSelected
              ? '#F59E0B'
              : '#6B7280'
        }
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={bottleneck.isBottleneck ? '6 3' : undefined}
      />
      {/* Belt label */}
      {isSelected && (
        <g>
          <rect
            x={midX - 30}
            y={midY - 10}
            width="60"
            height="20"
            rx="4"
            fill="#1a1a2e"
            stroke={bottleneck.isBottleneck ? '#EF4444' : '#F59E0B'}
            strokeWidth="1"
          />
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fill={bottleneck.isBottleneck ? '#EF4444' : '#F59E0B'}
            fontSize="9"
            fontFamily="monospace"
          >
            MK{connection.beltMk}
          </text>
        </g>
      )}
      {/* Bottleneck warning */}
      {bottleneck.isBottleneck && (
        <g>
          <circle cx={midX} cy={midY - (isSelected ? 20 : 0)} r="8" fill="#EF4444" />
          <text
            x={midX}
            y={midY - (isSelected ? 20 : 0) + 4}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            !
          </text>
        </g>
      )}
    </g>
  );
}
