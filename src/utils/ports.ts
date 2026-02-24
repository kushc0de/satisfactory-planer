import type { PortSide, PortDefinition, Rotation, BuildingDef } from '../types';
import { GRID_SIZE } from './grid';

const SIDE_ORDER: PortSide[] = ['top', 'right', 'bottom', 'left'];

/**
 * Rotate a port side by a given rotation.
 * 0° = no change, 90° = top→right→bottom→left→top, etc.
 */
export function rotateSide(side: PortSide, rotation: Rotation): PortSide {
  const steps = rotation / 90;
  const idx = SIDE_ORDER.indexOf(side);
  return SIDE_ORDER[(idx + steps) % 4];
}

/**
 * Get the visual pixel dimensions of a building after rotation.
 * At 90° and 270°, width and height are swapped.
 */
export function getVisualDimensions(
  def: BuildingDef,
  rotation: Rotation,
): { width: number; height: number } {
  const baseW = def.gridWidth * GRID_SIZE;
  const baseH = def.gridHeight * GRID_SIZE;
  if (rotation === 90 || rotation === 270) {
    return { width: baseH, height: baseW };
  }
  return { width: baseW, height: baseH };
}

/**
 * Get the visual grid dimensions of a building after rotation.
 * At 90° and 270°, gridWidth and gridHeight are swapped.
 */
export function getVisualGridDimensions(
  def: BuildingDef,
  rotation: Rotation,
): { gridWidth: number; gridHeight: number } {
  if (rotation === 90 || rotation === 270) {
    return { gridWidth: def.gridHeight, gridHeight: def.gridWidth };
  }
  return { gridWidth: def.gridWidth, gridHeight: def.gridHeight };
}

/**
 * Calculate the pixel offset of a port relative to the building's top-left corner,
 * accounting for rotation.
 */
export function getPortPixelOffset(
  port: PortDefinition,
  rotation: Rotation,
  visW: number,
  visH: number,
): { x: number; y: number } {
  const effectiveSide = rotateSide(port.side, rotation);
  // The offset along the edge (fractional 0–1)
  const t = port.offset;

  switch (effectiveSide) {
    case 'top':
      return { x: visW * t, y: 0 };
    case 'bottom':
      return { x: visW * t, y: visH };
    case 'left':
      return { x: 0, y: visH * t };
    case 'right':
      return { x: visW, y: visH * t };
  }
}

/**
 * Get the tangent direction offset for Bézier control points based on port side.
 */
export function tangentOffset(
  side: PortSide,
  magnitude: number,
): { dx: number; dy: number } {
  switch (side) {
    case 'top':
      return { dx: 0, dy: -magnitude };
    case 'bottom':
      return { dx: 0, dy: magnitude };
    case 'left':
      return { dx: -magnitude, dy: 0 };
    case 'right':
      return { dx: magnitude, dy: 0 };
  }
}

/**
 * Get input ports from a building definition.
 */
export function getInputPorts(def: BuildingDef): PortDefinition[] {
  return def.ports.filter((p) => p.type === 'input');
}

/**
 * Get output ports from a building definition.
 */
export function getOutputPorts(def: BuildingDef): PortDefinition[] {
  return def.ports.filter((p) => p.type === 'output');
}
