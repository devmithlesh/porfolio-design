import { useRef } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import type { ZoneId } from '@/utils/constants'
import { useGameStore } from '@/store/gameStore'

interface ZoneTriggerProps {
  zoneId: ZoneId
  position: [number, number, number]
  size: [number, number, number]
  onEnter: (zoneId: ZoneId) => void
}

export function ZoneTrigger({ zoneId, position, size, onEnter }: ZoneTriggerProps) {
  const entered = useRef(false)

  return (
    <RigidBody type="fixed" sensor position={position} colliders={false}>
      <CuboidCollider
        args={[size[0] / 2, size[1] / 2, size[2] / 2]}
        sensor
        onIntersectionEnter={() => {
          if (entered.current) return
          entered.current = true
          onEnter(zoneId)
          useGameStore.getState().enterZone(zoneId)
        }}
        onIntersectionExit={() => {
          entered.current = false
        }}
      />
    </RigidBody>
  )
}
