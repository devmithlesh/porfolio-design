import { memo } from 'react'
import { PATH_LIGHTS } from '@/utils/pathLayout'
import { useGameStore } from '@/store/gameStore'

function Lamp({ position }: { position: [number, number, number] }) {
  const isNight = useGameStore((s) => s.isNight)

  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 1.1, 6]} />
        <meshToonMaterial color="#44403c" />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshToonMaterial
          color={isNight ? '#fef9c3' : '#e7e5e4'}
          emissive={isNight ? '#fbbf24' : '#000000'}
          emissiveIntensity={isNight ? 0.6 : 0}
        />
      </mesh>
      <pointLight
        position={[0, 1.1, 0]}
        intensity={isNight ? 1.8 : 0.08}
        distance={isNight ? 12 : 5}
        color="#fde68a"
      />
    </group>
  )
}

function PathLightsInner() {
  return (
    <group name="path-lights">
      {PATH_LIGHTS.map((l) => (
        <Lamp key={l.id} position={l.position} />
      ))}
    </group>
  )
}

export const PathLights = memo(PathLightsInner)
