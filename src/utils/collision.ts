import type { PlacedBuilding, BuildingType, Rotation } from '../types';
import { BUILDINGS } from '../data/buildings';

interface AABB {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Get the axis-aligned bounding box for a building, accounting for rotation.
 */
function getBuildingAABB(building: PlacedBuilding): AABB {
  const def = BUILDINGS[building.type];
  if (!def) return { x: building.gridX, y: building.gridY, w: 1, h: 1 };

  const isRotated = building.rotation === 90 || building.rotation === 270;
  const w = isRotated ? def.gridHeight : def.gridWidth;
  const h = isRotated ? def.gridWidth : def.gridHeight;

  return { x: building.gridX, y: building.gridY, w, h };
}

/**
 * Check if two AABBs overlap.
 */
function aabbOverlap(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Check if placing a building at a position would collide with existing buildings.
 * Returns the ID of the first colliding building, or null if no collision.
 */
export function checkCollision(
  type: BuildingType,
  gridX: number,
  gridY: number,
  rotation: Rotation,
  existingBuildings: PlacedBuilding[],
  excludeId?: string,
): string | null {
  const def = BUILDINGS[type];
  if (!def) return null;

  const isRotated = rotation === 90 || rotation === 270;
  const newAABB: AABB = {
    x: gridX,
    y: gridY,
    w: isRotated ? def.gridHeight : def.gridWidth,
    h: isRotated ? def.gridWidth : def.gridHeight,
  };

  for (const building of existingBuildings) {
    if (excludeId && building.id === excludeId) continue;
    const existingAABB = getBuildingAABB(building);
    if (aabbOverlap(newAABB, existingAABB)) {
      return building.id;
    }
  }

  return null;
}

/**
 * Check if a building can be placed at a position.
 */
export function canPlace(
  type: BuildingType,
  gridX: number,
  gridY: number,
  rotation: Rotation,
  existingBuildings: PlacedBuilding[],
  excludeId?: string,
): boolean {
  return checkCollision(type, gridX, gridY, rotation, existingBuildings, excludeId) === null;
}
