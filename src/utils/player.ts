import type { RapierRigidBody } from '@react-three/rapier'
import type { Vector3Tuple } from 'three'
import { SPAWN_POSITION } from './constants'

export const PLAYER_USER_DATA = { isPlayer: true } as const

export function isPlayerBody(
  body: RapierRigidBody | null | undefined
): boolean {
  return !!(body?.userData as { isPlayer?: boolean })?.isPlayer
}

export function applySpawnToBody(
  body: RapierRigidBody,
  position: Vector3Tuple = SPAWN_POSITION
): void {
  body.setTranslation({ x: position[0], y: position[1], z: position[2] }, true)
  body.setLinvel({ x: 0, y: 0, z: 0 }, true)
  body.setAngvel({ x: 0, y: 0, z: 0 }, true)
}
