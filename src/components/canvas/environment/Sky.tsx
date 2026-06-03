import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Sky as DreiSky, Stars, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'

function NightMoon() {
  return (
    <group position={[62, 58, -95]}>
      <mesh>
        <sphereGeometry args={[9, 48, 48]} />
        <meshStandardMaterial
          color="#f1f5f9"
          emissive="#cbd5e1"
          emissiveIntensity={0.55}
          roughness={0.95}
        />
      </mesh>
      {/* Crater hints */}
      {[
        [2, 1, 7],
        [-3, -2, 6],
        [1, -3, 7],
        [-1, 3, 6],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[1.2 + (i % 2) * 0.4, 12, 12]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
      ))}
      <pointLight color="#e2e8f0" intensity={1.2} distance={180} />
    </group>
  )
}

export function GameSky() {
  const isNight = useGameStore((s) => s.isNight)
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color(isNight ? '#000008' : '#6ec8e8')
    scene.fog = isNight
      ? new THREE.Fog('#000008', 85, 210)
      : new THREE.Fog('#7ec8e3', 50, 155)
  }, [isNight, scene])

  return (
    <group>
      {!isNight ? (
        <>
          <DreiSky
            distance={450000}
            sunPosition={[80, 15, 60]}
            inclination={0.49}
            azimuth={0.22}
            mieCoefficient={0.004}
            mieDirectionalG={0.7}
            rayleigh={0.45}
            turbidity={6}
          />
          <Cloud position={[-40, 25, -30]} speed={0.15} opacity={0.4} />
          <Cloud position={[50, 28, 20]} speed={0.12} opacity={0.3} />
        </>
      ) : (
        <>
          <mesh renderOrder={-2}>
            <sphereGeometry args={[480, 32, 32]} />
            <meshBasicMaterial color="#000008" side={THREE.BackSide} depthWrite={false} />
          </mesh>
          <NightMoon />
          <Stars
            radius={280}
            depth={90}
            count={16000}
            factor={5.5}
            saturation={0}
            fade
            speed={0.12}
          />
        </>
      )}
    </group>
  )
}

/** Canvas background — night par grey na ho */
export function SceneBackground() {
  const isNight = useGameStore((s) => s.isNight)
  return <color attach="background" args={[isNight ? '#000008' : '#6ec8e8']} />
}
