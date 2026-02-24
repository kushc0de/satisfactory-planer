import { useStore } from '../../store/store';
import { usePlacementMode } from '../../store/selectors';
import type { PortDefinition, Rotation, PortSide } from '../../types';
import { rotateSide, getPortPixelOffset } from '../../utils/ports';

interface Props {
  buildingId: string;
  portType: 'input' | 'output';
  portIndex: number;
  port: PortDefinition;
  rotation: Rotation;
  visualWidth: number;
  visualHeight: number;
}

export default function PortDot({ buildingId, portType, portIndex, port, rotation, visualWidth, visualHeight }: Props) {
  const connectionDraft = useStore((s) => s.connectionDraft);
  const startConnectionDraft = useStore((s) => s.startConnectionDraft);
  const cancelConnectionDraft = useStore((s) => s.cancelConnectionDraft);
  const addConnection = useStore((s) => s.addConnection);
  const placementMode = usePlacementMode();

  const isSource = portType === 'output';
  const isTarget = portType === 'input';
  const isDraftActive = connectionDraft !== null;
  const isDraftSource = isDraftActive && connectionDraft!.fromBuildingId === buildingId && connectionDraft!.fromPortIndex === portIndex;
  const isBeltMode = placementMode?.kind === 'belt';

  const effectiveSide: PortSide = rotateSide(port.side, rotation);
  const pos = getPortPixelOffset(port, rotation, visualWidth, visualHeight);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDraftActive && isTarget) {
      addConnection(
        connectionDraft!.fromBuildingId,
        connectionDraft!.fromPortIndex,
        buildingId,
        portIndex,
        placementMode?.kind === 'belt' ? placementMode.beltMk : undefined,
      );
      cancelConnectionDraft();
    } else if (!isDraftActive && isSource) {
      startConnectionDraft(buildingId, portIndex);
    } else if (isDraftActive) {
      cancelConnectionDraft();
    }
  };

  const pulsing = isBeltMode && isSource && !isDraftActive;
  const isPipe = port.category === 'pipe';

  // Position the dot centered on the port position
  const dotSize = 12;
  const left = pos.x - dotSize / 2;
  const top = pos.y - dotSize / 2;

  return (
    <div
      className={`
        absolute w-3 h-3 ${isPipe ? 'rounded-sm' : 'rounded-full'} border-2 cursor-pointer z-30
        transition-all duration-100
        ${isDraftSource
          ? 'bg-amber-400 border-amber-300 scale-125 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
          : isDraftActive && isTarget
            ? 'bg-green-400 border-green-300 scale-110 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
            : pulsing
              ? 'bg-amber-400 border-amber-300 scale-110 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)]'
              : isSource
                ? isPipe
                  ? 'bg-cyan-500/60 border-cyan-500 hover:bg-cyan-400 hover:scale-125'
                  : 'bg-amber-500/60 border-amber-500 hover:bg-amber-400 hover:scale-125'
                : isPipe
                  ? 'bg-teal-500/60 border-teal-500 hover:bg-teal-400 hover:scale-125'
                  : 'bg-blue-500/60 border-blue-500 hover:bg-blue-400 hover:scale-125'
        }
      `}
      style={{ left, top }}
      onClick={handleClick}
      data-port-id={`${buildingId}-${portType}-${portIndex}`}
      title={`${portType === 'output' ? 'Ausgang' : 'Eingang'} (${port.category === 'pipe' ? 'Rohr' : 'Förderband'}) — ${effectiveSide}`}
    />
  );
}
