import { memo, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, BallCollider, type RapierRigidBody } from '@react-three/rapier'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { PathCutter as PathCutterData } from '@/utils/pathLayout'
import { useGameStore } from '@/store/gameStore'
import { useOnPlayerTouch } from '@/hooks/usePlayerCollision'
import { useSound } from '@/hooks/useSound'

const BLADE_RADIUS = 0.85

interface PathCutterProps {
  cutter: PathCutterData
}

function PathCutterInner({ cutter }: PathCutterProps) {
  const body = useRef<RapierRigidBody>(null)
  const blade = useRef<THREE.Group>(null)
  const sawTexture = useTexture('/saw-blade.png')
  sawTexture.colorSpace = THREE.SRGBColorSpace

  const requestRespawn = useGameStore((s) => s.requestRespawn)
  const { playSfx } = useSound()
  const onHit = useCallback(() => {
    playSfx('hazard')
    requestRespawn()
  }, [playSfx, requestRespawn])
  const onPlayerTouch = useOnPlayerTouch(onHit)

  const base = useRef(new THREE.Vector3(...cutter.edgeCenter))

  useFrame((state) => {
    const rb = body.current
    if (!rb) return

    const t = state.clock.elapsedTime * cutter.speed
    const slide = Math.sin(t) * cutter.slideRange
    const pos = base.current.clone()

    if (cutter.slideAxis === 'x') pos.x += slide
    else pos.z += slide

    rb.setNextKinematicTranslation(pos)
    if (blade.current) blade.current.rotation.z += 0.14
  })

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={cutter.edgeCenter}
      rotation={[Math.PI / 2, cutter.bladeRotationY, 0]}
    >
      <BallCollider args={[BLADE_RADIUS * 0.85]} sensor onIntersectionEnter={onPlayerTouch} />
      <group ref={blade}>
        <mesh castShadow>
          <cylinderGeometry args={[BLADE_RADIUS, BLADE_RADIUS, 0.06, 32]} />
          <meshStandardMaterial map={sawTexture} metalness={0.7} roughness={0.35} />
        </mesh>
      </group>
    </RigidBody>
  )
}

export const PathCutter = memo(PathCutterInner)
