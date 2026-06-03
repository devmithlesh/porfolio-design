import { useRef, useCallback } from 'react'
import { useGameStore } from '@/store/gameStore'

export function VirtualJoystick() {
  const baseRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const setMobileInput = useGameStore((s) => s.setMobileInput)

  const updateStick = useCallback(
    (clientX: number, clientY: number) => {
      const base = baseRef.current
      const stick = stickRef.current
      if (!base || !stick) return

      const rect = base.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const maxDist = rect.width / 2 - 20

      let dx = clientX - cx
      let dy = clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > maxDist) {
        dx = (dx / dist) * maxDist
        dy = (dy / dist) * maxDist
      }

      stick.style.transform = `translate(${dx}px, ${dy}px)`
      // Stick up = forward (positive Z input)
      setMobileInput({ x: dx / maxDist, y: -(dy / maxDist) })
    },
    [setMobileInput]
  )

  const onStart = (e: React.TouchEvent | React.MouseEvent) => {
    dragging.current = true
    const touch = 'touches' in e ? e.touches[0] : e
    updateStick(touch.clientX, touch.clientY)
  }

  const onMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging.current) return
    const touch = 'touches' in e ? e.touches[0] : e
    updateStick(touch.clientX, touch.clientY)
  }

  const onEnd = () => {
    dragging.current = false
    if (stickRef.current) stickRef.current.style.transform = 'translate(0, 0)'
    setMobileInput({ x: 0, y: 0 })
  }

  return (
    <div className="md:hidden fixed bottom-24 left-6 z-30">
      <div
        ref={baseRef}
        className="w-28 h-28 rounded-full bg-white/10 border-2 border-white/20 relative touch-none"
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
        <div
          ref={stickRef}
          className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-cyan-500/60 border-2 border-cyan-400 shadow-lg shadow-cyan-500/30"
        />
      </div>
    </div>
  )
}

export function MobileActionButtons() {
  const setMobileInput = useGameStore((s) => s.setMobileInput)

  return (
    <div className="md:hidden fixed bottom-24 right-6 z-30 flex flex-col gap-3">
      <button
        className="w-16 h-16 rounded-full game-btn text-lg font-bold"
        onTouchStart={() => setMobileInput({ jump: true })}
        onTouchEnd={() => setMobileInput({ jump: false })}
        onMouseDown={() => setMobileInput({ jump: true })}
        onMouseUp={() => setMobileInput({ jump: false })}
      >
        ⬆
      </button>
      <button
        className="w-14 h-14 rounded-full game-btn-secondary text-sm"
        onTouchStart={() => setMobileInput({ run: true })}
        onTouchEnd={() => setMobileInput({ run: false })}
        onMouseDown={() => setMobileInput({ run: true })}
        onMouseUp={() => setMobileInput({ run: false })}
      >
        🏃
      </button>
    </div>
  )
}
