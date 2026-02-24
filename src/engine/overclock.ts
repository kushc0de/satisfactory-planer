const OVERCLOCK_EXPONENT = 1.321928;

/**
 * Calculate power consumption with overclock applied.
 * Formula: basePower * (clockPercent / 100) ^ 1.321928
 */
export function calcOverclockedPower(basePower: number, clockPercent: number): number {
  const clamped = Math.max(1, Math.min(250, clockPercent));
  return basePower * Math.pow(clamped / 100, OVERCLOCK_EXPONENT);
}

/**
 * Get production multiplier from overclock percentage.
 * Production scales linearly with clock speed.
 */
export function calcClockMultiplier(clockPercent: number): number {
  return Math.max(1, Math.min(250, clockPercent)) / 100;
}
