import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'

interface LowPolyTreeProps {
  position?: [number, number, number]
  scale?: number
}

export function LowPolyTree({ position = [0, 0, 0], scale = 1 }: LowPolyTreeProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime + position[0]) * 0.02
    }
  })

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.2, 6]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.8, 1.2, 6]} />
        <meshToonMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[0.6, 1, 6]} />
        <meshToonMaterial color="#32CD32" />
      </mesh>
    </group>
  )
}

export function LowPolyRock({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
  const s = scale
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[0.55 * s, 0.45 * s, 0.55 * s]} />
      <mesh scale={s} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshToonMaterial color="#6b7280" />
      </mesh>
    </RigidBody>
  )
}

export function GrassPatch({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 2,
            0.15,
            (Math.random() - 0.5) * 2,
          ]}
          rotation={[0, Math.random() * Math.PI, 0]}
        >
          <coneGeometry args={[0.05, 0.3, 3]} />
          <meshToonMaterial color="#4ade80" />
        </mesh>
      ))}
    </group>
  )
}
