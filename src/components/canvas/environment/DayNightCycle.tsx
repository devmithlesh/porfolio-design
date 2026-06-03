import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'

export function DayNightCycle() {
  const sun = useRef<THREE.DirectionalLight>(null)
  const moon = useRef<THREE.DirectionalLight>(null)
  const ambient = useRef<THREE.AmbientLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const playerLight = useRef<THREE.PointLight>(null)
  const isNight = useGameStore((s) => s.isNight)
  const playerPosition = useGameStore((s) => s.playerPosition)

  useFrame(() => {
    if (sun.current) {
      sun.current.visible = !isNight
      sun.current.intensity = isNight ? 0 : 0.75
      sun.current.position.set(35, 50, 25)
      sun.current.color.set('#fff5e6')
    }
    if (moon.current) {
      moon.current.visible = isNight
      moon.current.intensity = isNight ? 0.35 : 0
      moon.current.position.set(50, 55, -70)
      moon.current.color.set('#dbeafe')
    }
    if (ambient.current) {
      ambient.current.intensity = isNight ? 0.12 : 0.45
      ambient.current.color.set(isNight ? '#0f172a' : '#f8fafc')
    }
    if (hemi.current) {
      hemi.current.intensity = isNight ? 0.08 : 0.42
      hemi.current.color.set(isNight ? '#0a1020' : '#7dd3fc')
      hemi.current.groundColor.set(isNight ? '#010104' : '#0e7490')
    }
    if (playerLight.current) {
      playerLight.current.visible = isNight
      playerLight.current.intensity = isNight ? 1.4 : 0
      playerLight.current.position.set(
        playerPosition[0],
        playerPosition[1] + 2.2,
        playerPosition[2]
      )
    }
  })

  return (
    <>
      <ambientLight ref={ambient} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <directionalLight ref={moon} />
      <hemisphereLight ref={hemi} args={['#7dd3fc', '#0e7490', 0.42]} />
      <pointLight ref={playerLight} distance={11} color="#fef9c3" decay={2} />
    </>
  )
}
