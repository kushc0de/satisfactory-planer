import { useStore } from '../../store/store';

interface Props {
  buildingId: string;
  portType: 'input' | 'output';
  portIndex: number;
  side: 'left' | 'right';
  offset: number;
  total: number;
  buildingHeight: number;
}

export default function PortDot({ buildingId, portType, portIndex, side, offset, total, buildingHeight }: Props) {
  const connectionDraft = useStore((s) => s.connectionDraft);
  const startConnectionDraft = useStore((s) => s.startConnectionDraft);
  const cancelConnectionDraft = useStore((s) => s.cancelConnectionDraft);
  const addConnection = useStore((s) => s.addConnection);

  const spacing = buildingHeight / (total + 1);
  const topPx = spacing * (offset + 1);

  const isSource = portType === 'output';
  const isTarget = portType === 'input';
  const isDraftActive = connectionDraft !== null;
  const isDraftSource = isDraftActive && connectionDraft!.fromBuildingId === buildingId && connectionDraft!.fromPortIndex === portIndex;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isDraftActive && isSource) {
      startConnectionDraft(buildingId, portIndex);
    } else if (isDraftActive && isTarget) {
      // Complete the connection
      addConnection(
        connectionDraft!.fromBuildingId,
        connectionDraft!.fromPortIndex,
        buildingId,
        portIndex,
      );
      cancelConnectionDraft();
    } else if (isDraftActive) {
      cancelConnectionDraft();
    }
  };

  return (
    <div
      className={`
        absolute w-3 h-3 rounded-full border-2 cursor-pointer z-30
        transition-all duration-100
        ${side === 'left' ? '-left-1.5' : '-right-1.5'}
        ${isDraftSource
          ? 'bg-amber-400 border-amber-300 scale-125 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
          : isDraftActive && isTarget
            ? 'bg-green-400 border-green-300 scale-110 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
            : isSource
              ? 'bg-amber-500/60 border-amber-500 hover:bg-amber-400 hover:scale-125'
              : 'bg-blue-500/60 border-blue-500 hover:bg-blue-400 hover:scale-125'
        }
      `}
      style={{ top: topPx - 6 }}
      onClick={handleClick}
      data-port-id={`${buildingId}-${portType}-${portIndex}`}
      title={portType === 'output' ? 'Ausgang (klicken zum Verbinden)' : 'Eingang (klicken zum Verbinden)'}
    />
  );
}
