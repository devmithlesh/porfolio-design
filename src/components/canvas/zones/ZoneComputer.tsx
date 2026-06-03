import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BillboardText } from '@/components/canvas/BillboardText'
import type { ZoneComputerConfig } from '@/data/zoneComputers'
import {
  COMPUTER_HINT_RADIUS,
  COMPUTER_INTERACT_RADIUS,
  ZONE_COMPUTERS,
} from '@/data/zoneComputers'
import { useGameStore } from '@/store/gameStore'
import type { ZoneId } from '@/utils/constants'

function ComputerMesh({
  config,
  isNear,
  isActive,
}: {
  config: ZoneComputerConfig
  isNear: boolean
  isActive: boolean
}) {
  const screen = useRef<THREE.Mesh>(null)
  const glow = isNear || isActive

  useFrame((state) => {
    if (!screen.current) return
    const t = state.clock.elapsedTime
    const pulse = glow ? 0.35 + Math.sin(t * 4) * 0.15 : 0.12
    const mat = screen.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = pulse
  })

  return (
    <group position={config.position}>
      <group rotation={[0, Math.PI, 0]}>
      {/* Desk */}
      <mesh position={[0, 0.35, 0.25]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.12, 0.9]} />
        <meshToonMaterial color="#57534e" />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, 0.55, 0.05]}>
        <boxGeometry args={[0.2, 0.25, 0.15]} />
        <meshToonMaterial color="#44403c" />
      </mesh>
      {/* Monitor */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[1.35, 0.95, 0.1]} />
        <meshToonMaterial color={config.bodyColor} />
      </mesh>
      {/* Screen */}
      <mesh ref={screen} position={[0, 1.05, 0.06]}>
        <planeGeometry args={[1.15, 0.72]} />
        <meshStandardMaterial
          color={config.screenColor}
          emissive={config.screenColor}
          emissiveIntensity={glow ? 0.4 : 0.12}
        />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, 0.48, 0.55]}>
        <boxGeometry args={[0.9, 0.05, 0.35]} />
        <meshToonMaterial color="#292524" />
      </mesh>
      {/* Chair hint */}
      <mesh position={[0, 0.25, 0.95]}>
        <boxGeometry args={[0.7, 0.5, 0.08]} />
        <meshToonMaterial color="#1c1917" />
      </mesh>

      {glow && (
        <pointLight
          position={[0, 1.2, 0.5]}
          color={config.screenColor}
          intensity={0.8}
          distance={4}
        />
      )}

      </group>

      <BillboardText
        position={[0, 2.05, 0]}
        fontSize={0.32}
        color={config.screenColor}
        anchorX="center"
        outlineWidth={0.04}
        outlineColor="#000"
      >
        {config.label}
      </BillboardText>

      {isNear && !isActive && (
        <BillboardText
          position={[0, 2.45, 0]}
          fontSize={0.22}
          color="#fef08a"
          anchorX="center"
          outlineWidth={0.03}
          outlineColor="#000"
        >
          💻 Aage jao — info khulegi
        </BillboardText>
      )}
    </group>
  )
}

/** Proximity check + auto-open info popup when player stands in front */
export function ZoneComputerSystem() {
  const inRangeMap = useRef<Record<string, boolean>>({})
  const prevModal = useRef<ReturnType<typeof useGameStore.getState>['activeModal']>(null)

  const nearId = useGameStore((s) => s.nearComputerId)
  const activeModal = useGameStore((s) => s.activeModal)

  const nearSet = useMemo(() => new Set([nearId].filter(Boolean)), [nearId])

  useFrame(() => {
    const {
      playerPosition,
      activeModal: modal,
      phase,
      isPaused,
      openModal,
      enterZone,
      setNearComputerId,
    } = useGameStore.getState()

    if (prevModal.current && !modal) {
      const [px, py, pz] = playerPosition
      for (const pc of ZONE_COMPUTERS) {
        const dx = pc.position[0] - px
        const dy = pc.position[1] - py
        const dz = pc.position[2] - pz
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < COMPUTER_INTERACT_RADIUS) {
          inRangeMap.current[pc.id] = true
        }
      }
    }
    prevModal.current = modal

    if (phase !== 'playing' || isPaused) return

    const [px, py, pz] = playerPosition
    let closest: { id: string; dist: number } | null = null

    for (const pc of ZONE_COMPUTERS) {
      const dx = pc.position[0] - px
      const dy = pc.position[1] - py
      const dz = pc.position[2] - pz
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const inside = dist < COMPUTER_INTERACT_RADIUS
      const wasInside = inRangeMap.current[pc.id] ?? false

      if (inside && !wasInside && !modal && pc.modal) {
        if (pc.zoneId !== 'home') {
          enterZone(pc.zoneId as ZoneId)
        }
        openModal(pc.modal)
      }

      inRangeMap.current[pc.id] = inside

      if (dist < COMPUTER_HINT_RADIUS && (!closest || dist < closest.dist)) {
        closest = { id: pc.id, dist }
      }
    }

    const hintId =
      closest && closest.dist < COMPUTER_HINT_RADIUS ? closest.id : null
    if (hintId !== useGameStore.getState().nearComputerId) {
      setNearComputerId(hintId)
    }
  })

  return (
    <>
      {ZONE_COMPUTERS.map((config) => (
        <ComputerMesh
          key={config.id}
          config={config}
          isNear={nearSet.has(config.id)}
          isActive={activeModal !== null && nearSet.has(config.id)}
        />
      ))}
    </>
  )
}
