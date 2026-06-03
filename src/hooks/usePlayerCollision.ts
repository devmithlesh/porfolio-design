import type { CollisionPayload } from '@react-three/rapier'
import { isPlayerBody } from '@/utils/player'

/** Rapier sensor callback — runs only when player touches */
export function useOnPlayerTouch(onTouch: () => void) {
  return (payload: CollisionPayload) => {
    if (isPlayerBody(payload.other.rigidBody)) onTouch()
  }
}
