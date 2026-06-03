import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SEABED_Y } from '@/utils/water'

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

function UnderwaterGrassClump({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(t * 1.5 + i) * 0.12
    })
  })

  return (
    <group ref={group} position={position}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (seededRandom(i + position[0]) - 0.5) * 1.2,
            0.2,
            (seededRandom(i + position[2]) - 0.5) * 1.2,
          ]}
          rotation={[0.1, seededRandom(i) * Math.PI, 0]}
        >
          <coneGeometry args={[0.06, 0.45 + seededRandom(i + 1) * 0.2, 4]} />
          <meshToonMaterial color={i % 2 === 0 ? '#4ade80' : '#22c55e'} />
        </mesh>
      ))}
    </group>
  )
}

function UnderwaterKelp({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.08
  })

  return (
    <group ref={ref} position={position}>
      <mesh>
        <coneGeometry args={[0.12, 1.4, 5]} />
        <meshToonMaterial color="#15803d" />
      </mesh>
      <mesh position={[0.15, 0.3, 0]}>
        <coneGeometry args={[0.1, 1, 5]} />
        <meshToonMaterial color="#22c55e" />
      </mesh>
    </group>
  )
}

export function UnderwaterTerrain() {
  const patches = useMemo(() => {
    const soil: { pos: [number, number, number]; scale: number }[] = []
    const grass: [number, number, number][] = []
    const kelp: [number, number, number][] = []

    for (let i = 0; i < 45; i++) {
      const x = (seededRandom(i * 3) - 0.5) * 100
      const z = (seededRandom(i * 7) - 0.5) * 100
      soil.push({
        pos: [x, SEABED_Y + 0.06, z],
        scale: 1.5 + seededRandom(i * 11) * 3,
      })
    }

    for (let i = 0; i < 55; i++) {
      grass.push([
        (seededRandom(i * 13) - 0.5) * 90,
        SEABED_Y + 0.08,
        (seededRandom(i * 17) - 0.5) * 90,
      ])
    }

    for (let i = 0; i < 25; i++) {
      kelp.push([
        (seededRandom(i * 19) - 0.5) * 80,
        SEABED_Y + 0.7,
        (seededRandom(i * 23) - 0.5) * 80,
      ])
    }

    return { soil, grass, kelp }
  }, [])

  return (
    <group>
      {patches.soil.map((s, i) => (
        <mesh
          key={`soil-${i}`}
          position={s.pos}
          rotation={[-Math.PI / 2, 0, seededRandom(i) * 0.5]}
          receiveShadow
        >
          <circleGeometry args={[s.scale, 8]} />
          <meshToonMaterial color={i % 3 === 0 ? '#57534e' : '#78716c'} />
        </mesh>
      ))}
      {patches.grass.map((p, i) => (
        <UnderwaterGrassClump key={`grass-${i}`} position={p} />
      ))}
      {patches.kelp.map((p, i) => (
        <UnderwaterKelp key={`kelp-${i}`} position={p} />
      ))}
    </group>
  )
}
