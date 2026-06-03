import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RapierRigidBody } from '@react-three/rapier'
import { useGameStore } from '@/store/gameStore'
import { keyboardRef } from '@/hooks/useKeyboard'
import { getNearestSafePosition } from '@/utils/nearestPath'
import { applySpawnToBody } from '@/utils/player'

const STUCK_SECONDS = 0.85
const MIN_MOVE = 0.04

export function useStuckRecovery(
  bodyRef: React.RefObject<RapierRigidBody | null>,
  isGrounded: React.RefObject<boolean>,
  enabled: boolean,
  isSwimming?: React.RefObject<boolean>
) {
  const lastPos = useRef({ x: 0, y: 0, z: 0 })
  const stuckTimer = useRef(0)
  const initialized = useRef(false)

  useFrame((_, dt) => {
    if (!enabled || !bodyRef.current) return
    if (isSwimming?.current) return

    const rb = bodyRef.current
    const pos = rb.translation()
    const vel = rb.linvel()
    const { mobileInput } = useGameStore.getState()
    const moving =
      keyboardRef.forward ||
      keyboardRef.backward ||
      keyboardRef.left ||
      keyboardRef.right ||
      Math.abs(mobileInput.x) > 0.1 ||
      Math.abs(mobileInput.y) > 0.1

    if (!initialized.current) {
      lastPos.current = { x: pos.x, y: pos.y, z: pos.z }
      initialized.current = true
      return
    }

    const dx = pos.x - lastPos.current.x
    const dz = pos.z - lastPos.current.z
    const moved = Math.sqrt(dx * dx + dz * dz)

    const wedged =
      !isGrounded.current &&
      pos.y > 0.8 &&
      pos.y < 4.5 &&
      Math.abs(vel.y) < 1.5

    const inGap = !isGrounded.current && pos.y < 3.5 && pos.y > 0.3

    const tryingButStuck = moving && moved < MIN_MOVE && isGrounded.current

    if (wedged || inGap || tryingButStuck) {
      stuckTimer.current += dt
    } else {
      stuckTimer.current = Math.max(0, stuckTimer.current - dt * 2)
    }

    lastPos.current = { x: pos.x, y: pos.y, z: pos.z }

    if (stuckTimer.current >= STUCK_SECONDS) {
      stuckTimer.current = 0
      const safe = getNearestSafePosition(pos.x, pos.z)
      applySpawnToBody(rb, safe)
      useGameStore.getState().setPlayerPosition([...safe])
    }
  })
}
