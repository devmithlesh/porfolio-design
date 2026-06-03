import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { BillboardText } from '@/components/canvas/BillboardText'
import * as THREE from 'three'
import type { Achievement } from '@/data/achievements'
import { useGameStore } from '@/store/gameStore'

interface AchievementOrbProps {
  achievement: Achievement
}

export function AchievementOrb({ achievement }: AchievementOrbProps) {
  const orb = useRef<THREE.Mesh>(null)
  const unlocked = useGameStore((s) => s.unlockedAchievements.includes(achievement.id))
  const unlockAchievement = useGameStore((s) => s.unlockAchievement)
  const setActiveAchievement = useGameStore((s) => s.setActiveAchievement)
  const triggered = useRef(false)

  useFrame((state) => {
    if (orb.current) {
      orb.current.rotation.y = state.clock.elapsedTime * 0.5
      orb.current.position.y =
        achievement.position[1] + 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <group position={achievement.position}>
      <RigidBody type="fixed" sensor colliders={false}>
        <CuboidCollider
          args={[1.5, 2, 1.5]}
          sensor
          onIntersectionEnter={() => {
            if (triggered.current) return
            triggered.current = true
            if (!unlocked) {
              unlockAchievement(achievement.id, achievement.title, achievement.description)
            }
            setActiveAchievement(achievement)
            setTimeout(() => {
              triggered.current = false
            }, 2000)
          }}
        />
      </RigidBody>

      <mesh ref={orb} castShadow>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshToonMaterial
          color={unlocked ? '#fbbf24' : '#6b7280'}
          emissive={unlocked ? '#fbbf24' : '#374151'}
          emissiveIntensity={unlocked ? 0.5 : 0.1}
          transparent
          opacity={unlocked ? 1 : 0.6}
        />
      </mesh>

      {!unlocked && (
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[0.8, 0.05, 8, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} />
        </mesh>
      )}

      <BillboardText
        position={[0, 3, 0]}
        fontSize={0.3}
        color={unlocked ? '#fbbf24' : '#9ca3af'}
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        {achievement.icon} {achievement.title}
      </BillboardText>
    </group>
  )
}
