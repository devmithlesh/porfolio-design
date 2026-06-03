import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { damp } from '@/utils/math'
import { CAMERA_DISTANCE, CAMERA_SMOOTH } from '@/utils/constants'
import { useGameStore } from '@/store/gameStore'

interface ThirdPersonCameraProps {
  target: React.MutableRefObject<THREE.Vector3 | null>
  cameraYaw: React.MutableRefObject<number>
  cameraPitch: React.MutableRefObject<number>
  cameraZoom: React.MutableRefObject<number>
}

export function ThirdPersonCamera({
  target,
  cameraYaw,
  cameraPitch,
  cameraZoom,
}: ThirdPersonCameraProps) {
  const { camera } = useThree()
  const currentDistance = useRef(CAMERA_DISTANCE)
  const lookAt = useRef(new THREE.Vector3())
  const zoomTarget = useGameStore((s) => s.cameraZoomTarget)

  useFrame((_, dt) => {
    const t = target.current
    if (!t) return

    const targetDist = zoomTarget ?? cameraZoom.current
    currentDistance.current = damp(currentDistance.current, targetDist, 4, dt)

    const yaw = cameraYaw.current
    // pitch: kam = aasman, zyada = neeche — camera HAMESHA player ke upar
    const pitch = THREE.MathUtils.clamp(cameraPitch.current, -0.55, 0.9)
    const dist = currentDistance.current

    const horizontal = dist * 0.92
    const offsetX = Math.sin(yaw) * horizontal
    const offsetZ = Math.cos(yaw) * horizontal
    const offsetY = 4.2 + Math.max(0, pitch) * 2.2

    const camY = Math.max(t.y + 2.5, t.y + offsetY)
    camera.position.lerp(
      new THREE.Vector3(t.x + offsetX, camY, t.z + offsetZ),
      CAMERA_SMOOTH * 60 * dt
    )

    const lookAtY = t.y + 1.1 - pitch * 2.5
    lookAt.current.lerp(new THREE.Vector3(t.x, lookAtY, t.z), CAMERA_SMOOTH * 60 * dt)
    camera.lookAt(lookAt.current)
  })

  return null
}
