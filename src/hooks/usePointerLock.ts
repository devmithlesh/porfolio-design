import { useEffect, useRef } from 'react'

export function usePointerLock(enabled: boolean, canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const rotation = useRef({ x: 0, y: 0.3 })

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const onClick = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock()
      }
    }

    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      const sensitivity = 0.003
      rotation.current.x -= e.movementX * sensitivity
      rotation.current.y = Math.max(
        0.1,
        Math.min(1.2, rotation.current.y + e.movementY * sensitivity)
      )
    }

    canvas.addEventListener('click', onClick)
    document.addEventListener('mousemove', onMove)
    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('mousemove', onMove)
    }
  }, [enabled, canvasRef])

  return rotation
}
