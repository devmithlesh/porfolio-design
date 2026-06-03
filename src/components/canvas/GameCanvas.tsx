import { Suspense, useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { World } from './World'
import { CharacterController } from './CharacterController'
import { ThirdPersonCamera } from './ThirdPersonCamera'
import { GameSky, SceneBackground } from './environment/Sky'
import { DayNightCycle } from './environment/DayNightCycle'
import { PostProcessing } from './effects/PostProcessing'
import {
  GRAVITY,
  CAMERA_DISTANCE,
  CAMERA_ZOOM_MIN,
  CAMERA_ZOOM_MAX,
} from '@/utils/constants'
import { initKeyboardListeners } from '@/hooks/useKeyboard'
import { useGameStore } from '@/store/gameStore'
import { useSound } from '@/hooks/useSound'

export function GameCanvas() {
  const playerPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 3, 0))
  const cameraYaw = useRef(Math.PI)
  const cameraPitch = useRef(0.2)
  const cameraZoom = useRef(CAMERA_DISTANCE)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const phase = useGameStore((s) => s.phase)
  const isPaused = useGameStore((s) => s.isPaused)
  const activeModal = useGameStore((s) => s.activeModal)
  const { playSfx, startMusic } = useSound()

  const enabled = phase === 'playing' && !isPaused && !activeModal

  useEffect(() => {
    useGameStore.getState().hydrate()
  }, [])

  const respawnTick = useGameStore((s) => s.respawnTick)
  useEffect(() => {
    if (respawnTick) cameraPitch.current = 0.2
  }, [respawnTick])

  useEffect(() => {
    const movementEnabled =
      phase === 'playing' && !isPaused && !activeModal
    return initKeyboardListeners(movementEnabled)
  }, [phase, isPaused, activeModal])

  useEffect(() => {
    if (phase !== 'playing') return
    startMusic()
  }, [phase, startMusic])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!enabled || document.pointerLockElement !== canvasRef.current) return
      const sens = useGameStore.getState().sensitivity * 0.003
      cameraYaw.current -= e.movementX * sens
      cameraPitch.current = Math.max(
        -0.55,
        Math.min(0.9, cameraPitch.current + e.movementY * sens)
      )
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [enabled])

  const onPositionChange = useCallback((pos: THREE.Vector3) => {
    playerPos.current.copy(pos)
  }, [])

  const requestPointerLock = () => {
    const { activeModal, isPaused } = useGameStore.getState()
    if (enabled && canvasRef.current && !activeModal && !isPaused) {
      canvasRef.current.requestPointerLock()
    }
  }

  return (
    <Canvas
      shadows
      camera={{ fov: 55, near: 0.1, far: 200, position: [0, 8, 12] }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      onCreated={({ gl }) => {
        const el = gl.domElement
        canvasRef.current = el
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap

        const onWheel = (e: WheelEvent) => {
          const { phase, isPaused, activeModal } = useGameStore.getState()
          if (phase !== 'playing' || isPaused || activeModal) return
          e.preventDefault()
          const delta = e.deltaY > 0 ? 1.1 : -1.1
          cameraZoom.current = Math.max(
            CAMERA_ZOOM_MIN,
            Math.min(CAMERA_ZOOM_MAX, cameraZoom.current + delta)
          )
        }
        el.addEventListener('wheel', onWheel, { passive: false })
      }}
      style={{ width: '100%', height: '100%' }}
      onClick={requestPointerLock}
    >
      <SceneBackground />
      <GameSky />
      <DayNightCycle />

      <Suspense fallback={null}>
        <Physics gravity={[0, GRAVITY, 0]} timeStep="vary">
          <World />
          <CharacterController
            onPositionChange={onPositionChange}
            cameraYaw={cameraYaw}
            cameraPitch={cameraPitch}
            onJump={() => playSfx('jump')}
            onLand={() => playSfx('land')}
          />
        </Physics>
        <Preload all />
      </Suspense>

      <ThirdPersonCamera
        target={playerPos}
        cameraYaw={cameraYaw}
        cameraPitch={cameraPitch}
        cameraZoom={cameraZoom}
      />

      <PostProcessing />
    </Canvas>
  )
}
