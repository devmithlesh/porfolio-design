import type { Vector3Tuple } from 'three'
import { WORLD_PATHS } from './paths'
import { pathSurfaceY } from './pathLayout'
import { SPAWN_POSITION } from './constants'

/** Nearest walkable point on path or hub — unstuck ke liye */
export function getNearestSafePosition(x: number, z: number): Vector3Tuple {
  let bestX = SPAWN_POSITION[0]
  let bestY = SPAWN_POSITION[1]
  let bestZ = SPAWN_POSITION[2]
  let bestDist = Infinity

  const hubDist = x * x + z * z
  if (hubDist < 144) {
    return [0, 4, 0]
  }

  for (const seg of WORLD_PATHS) {
    const dx = x - seg.position[0]
    const dz = z - seg.position[2]
    const d = dx * dx + dz * dz
    if (d < bestDist) {
      bestDist = d
      bestX = seg.position[0]
      bestY = pathSurfaceY(seg) + 1.3
      bestZ = seg.position[2]
    }
  }

  return [bestX, bestY, bestZ]
}
