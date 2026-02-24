import { useTotalPower, usePowerConsumed, usePowerProduced, useBuildingCount, useConnectionCount, useBottlenecks } from '../../store/selectors';

export default function FactoryMetrics() {
  const totalPower = useTotalPower();
  const powerConsumed = usePowerConsumed();
  const powerProduced = usePowerProduced();
  const buildingCount = useBuildingCount();
  const connectionCount = useConnectionCount();
  const bottlenecks = useBottlenecks();

  const hasGenerators = powerProduced > 0;

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
      {hasGenerators ? (
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Verbrauch:</span>
            <span className="font-mono font-semibold text-yellow-400">{powerConsumed.toFixed(1)} MW</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Erzeugung:</span>
            <span className="font-mono font-semibold text-green-400">{powerProduced.toFixed(1)} MW</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Netto:</span>
            <span className={`font-mono font-semibold ${totalPower > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {totalPower > 0 ? '+' : ''}{totalPower.toFixed(1)} MW
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Gesamtleistung:</span>
          <span className="font-mono font-semibold text-yellow-400">{totalPower.toFixed(1)} MW</span>
        </div>
      )}
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
