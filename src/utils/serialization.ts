import type { FactoryLayout, PlacedBuilding, Connection } from '../types';

export function exportFactory(buildings: PlacedBuilding[], connections: Connection[]): string {
  const layout: FactoryLayout = {
    version: 1,
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
    if (data.version !== 1) {
      return { error: `Unbekannte Version: ${data.version}` };
    }
    if (!Array.isArray(data.buildings)) {
      return { error: 'Fehlende oder ungültige Gebäudeliste' };
    }
    if (!Array.isArray(data.connections)) {
      return { error: 'Fehlende oder ungültige Verbindungsliste' };
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
