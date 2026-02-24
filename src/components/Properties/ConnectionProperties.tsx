import { useStore } from '../../store/store';
import { BELTS } from '../../data/belts';
import { PIPES } from '../../data/pipes';
import { checkBottleneck } from '../../engine/throughput';
import type { BeltMk, PipeMk } from '../../types';

const BELT_MKS: BeltMk[] = [1, 2, 3, 4, 5, 6];
const PIPE_MKS: PipeMk[] = [1, 2];

export default function ConnectionProperties() {
  const selectedConnectionId = useStore((s) => s.selectedConnectionId);
  const connections = useStore((s) => s.connections);
  const buildings = useStore((s) => s.buildings);
  const setBeltMk = useStore((s) => s.setBeltMk);
  const setPipeMk = useStore((s) => s.setPipeMk);
  const removeConnection = useStore((s) => s.removeConnection);

  const connection = connections.find((c) => c.id === selectedConnectionId);
  if (!connection) return null;

  const bottleneck = checkBottleneck(connection, buildings);
  const isPipe = connection.connectionKind === 'pipe';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-amber-400 mb-1">Verbindung</h3>
        <p className="text-xs text-gray-500">
          {isPipe ? 'Pipeline-Konfiguration' : 'Förderband-Konfiguration'}
        </p>
      </div>

      {isPipe ? (
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Pipeline
          </label>
          <div className="grid grid-cols-2 gap-1">
            {PIPE_MKS.map((mk) => (
              <button
                key={mk}
                onClick={() => setPipeMk(connection.id, mk)}
                className={`
                  py-1.5 text-xs font-bold rounded-md border transition-all
                  ${connection.pipeMk === mk
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                  }
                `}
              >
                MK{mk}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Förderband
          </label>
          <div className="grid grid-cols-3 gap-1">
            {BELT_MKS.map((mk) => (
              <button
                key={mk}
                onClick={() => setBeltMk(connection.id, mk)}
                className={`
                  py-1.5 text-xs font-bold rounded-md border transition-all
                  ${connection.beltMk === mk
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                  }
                `}
              >
                MK{mk}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-md p-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Kapazität</span>
          <span className="text-gray-200 font-mono">
            {bottleneck.capacity}{isPipe ? ' m³' : ''}/min
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Benötigt</span>
          <span className={`font-mono ${bottleneck.isBottleneck ? 'text-red-400' : 'text-gray-200'}`}>
            {bottleneck.requiredRate.toFixed(1)}{isPipe ? ' m³' : ''}/min
          </span>
        </div>
        {bottleneck.isBottleneck && (
          <div className="mt-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
            Engpass! {isPipe ? 'Pipeline' : 'Förderband'} zu langsam.
          </div>
        )}
      </div>

      <button
        onClick={() => removeConnection(connection.id)}
        className="w-full py-2 text-sm font-medium rounded-md border border-red-500/40 text-red-400
          hover:bg-red-500/10 transition-colors"
      >
        Verbindung löschen
      </button>
    </div>
  );
}
