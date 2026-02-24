import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../../store/store';
import GridBackground from './GridBackground';
import PlacedBuilding from './PlacedBuilding';
import ConnectionLine from './ConnectionLine';

export default function Canvas() {
  const buildings = useStore((s) => s.buildings);
  const connections = useStore((s) => s.connections);
  const clearSelection = useStore((s) => s.clearSelection);
  const connectionDraft = useStore((s) => s.connectionDraft);
  const cancelConnectionDraft = useStore((s) => s.cancelConnectionDraft);

  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const handleCanvasClick = () => {
    if (connectionDraft) {
      cancelConnectionDraft();
    } else {
      clearSelection();
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-1 relative overflow-auto bg-[#0a0a15]"
      onClick={handleCanvasClick}
    >
      <div className="relative" style={{ width: 3200, height: 2400 }}>
        <GridBackground />

        {/* Connection SVG layer */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="3200"
          height="2400"
          style={{ zIndex: 5 }}
        >
          <g style={{ pointerEvents: 'auto' }}>
            {connections.map((c) => (
              <ConnectionLine key={c.id} connection={c} buildings={buildings} />
            ))}
          </g>
        </svg>

        {/* Buildings layer */}
        {buildings.map((b) => (
          <PlacedBuilding key={b.id} building={b} />
        ))}

        {/* Connection draft indicator */}
        {connectionDraft && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg pointer-events-none">
            Klicke auf einen Eingang zum Verbinden — ESC zum Abbrechen
          </div>
        )}
      </div>
    </div>
  );
}
