export const GRID_SIZE = 64; // pixels per grid unit (1 tile = 1 foundation = 8m)

export function gridToPixel(gridUnits: number): number {
  return gridUnits * GRID_SIZE;
}

export function pixelToGrid(pixels: number): number {
  return Math.round(pixels / GRID_SIZE);
}

export function snapToGrid(pixels: number): number {
  return Math.round(pixels / GRID_SIZE) * GRID_SIZE;
}
