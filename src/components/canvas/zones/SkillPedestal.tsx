import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { Float } from '@react-three/drei'
import { BillboardText } from '@/components/canvas/BillboardText'
import * as THREE from 'three'
import type { Skill } from '@/data/skills'
import { useGameStore } from '@/store/gameStore'

interface SkillPedestalProps {
  skill: Skill
}

export function SkillPedestal({ skill }: SkillPedestalProps) {
  const crystal = useRef<THREE.Mesh>(null)
  const setActiveSkill = useGameStore((s) => s.setActiveSkill)
  const triggered = useRef(false)

  useFrame((state) => {
    if (crystal.current) {
      crystal.current.rotation.y = state.clock.elapsedTime
    }
  })

  return (
    <group position={skill.position}>
      <RigidBody type="fixed" sensor colliders={false}>
        <CuboidCollider
          args={[1, 2, 1]}
          sensor
          onIntersectionEnter={() => {
            if (triggered.current) return
            triggered.current = true
            setActiveSkill(skill)
            setTimeout(() => {
              triggered.current = false
            }, 1500)
          }}
        />
      </RigidBody>

      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1, 0.8, 8]} />
        <meshToonMaterial color="#374151" />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={crystal} position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshToonMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      <BillboardText
        position={[0, 2.8, 0]}
        fontSize={0.35}
        color={skill.color}
        anchorX="center"
        outlineWidth={0.04}
        outlineColor="#000"
      >
        {skill.name}
      </BillboardText>
    </group>
  )
}
