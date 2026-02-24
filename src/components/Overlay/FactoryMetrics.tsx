import { useTotalPower, useBuildingCount, useConnectionCount, useBottlenecks } from '../../store/selectors';

export default function FactoryMetrics() {
  const totalPower = useTotalPower();
  const buildingCount = useBuildingCount();
  const connectionCount = useConnectionCount();
  const bottlenecks = useBottlenecks();

  return (
    <footer className="h-9 bg-[#0f0f1a] border-t border-gray-800/80 flex items-center px-4 gap-6 flex-shrink-0 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500">Gebäude:</span>
        <span className="font-mono font-semibold text-gray-300">{buildingCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500">Verbindungen:</span>
        <span className="font-mono font-semibold text-gray-300">{connectionCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500">Gesamtleistung:</span>
        <span className="font-mono font-semibold text-yellow-400">{totalPower.toFixed(1)} MW</span>
      </div>
      {bottlenecks.length > 0 && (
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 font-medium">
            {bottlenecks.length} Engpass{bottlenecks.length > 1 ? 'e' : ''}
          </span>
        </div>
      )}
    </footer>
  );
}
