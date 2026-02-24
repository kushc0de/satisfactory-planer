import type { FactoryLayout, PlacedBuilding, Connection } from '../types';

export function exportFactory(buildings: PlacedBuilding[], connections: Connection[]): string {
  const layout: FactoryLayout = {
    version: 2,
    buildings,
    connections,
  };
  return JSON.stringify(layout, null, 2);
}

export function importFactory(json: string): FactoryLayout | { error: string } {
  try {
    const data = JSON.parse(json);
    if (!data || typeof data !== 'object') {
      return { error: 'Ungültiges JSON-Format' };
    }
    if (data.version !== 1 && data.version !== 2) {
      return { error: `Unbekannte Version: ${data.version}` };
    }
    if (!Array.isArray(data.buildings)) {
      return { error: 'Fehlende oder ungültige Gebäudeliste' };
    }
    if (!Array.isArray(data.connections)) {
      return { error: 'Fehlende oder ungültige Verbindungsliste' };
    }

    // Normalize buildings: ensure rotation and oreType exist
    for (const b of data.buildings) {
      if (b.rotation === undefined || b.rotation === null) b.rotation = 0;
      if (b.oreType === undefined) b.oreType = null;
    }

    // If importing v1, clear connections since port indices changed
    if (data.version === 1) {
      data.connections = [];
      data.version = 2;
    }

    return data as FactoryLayout;
  } catch {
    return { error: 'JSON konnte nicht gelesen werden' };
  }
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
