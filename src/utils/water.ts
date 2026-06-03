/** Sea surface height (matches Ocean mesh) */
export const WATER_SURFACE_Y = -6.5

/** Sandy / soil floor under water */
export const SEABED_Y = -7.35

/** Player center below this = swimming */
export const WATER_ENTER_Y = WATER_SURFACE_Y + 1.15

/** Too deep = respawn */
export const WATER_DROWN_Y = -10.5

export function isInWater(playerY: number): boolean {
  return playerY < WATER_ENTER_Y
}

export function shouldDrown(playerY: number): boolean {
  return playerY < WATER_DROWN_Y
}
