import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export interface KeyboardState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  run: boolean
}

const KEY_MAP: Record<string, keyof KeyboardState> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'jump',
  ShiftLeft: 'run',
  ShiftRight: 'run',
}

export function useKeyboard(enabled = true): KeyboardState {
  const keys = useRef<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
  })

  useEffect(() => {
    if (!enabled) return

    const onDown = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.code]
      if (key) {
        keys.current[key] = true
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault()
        }
      }
    }

    const onUp = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.code]
      if (key) keys.current[key] = false
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [enabled])

  return keys.current
}

export function getKeyboardRef() {
  return {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
  } as KeyboardState
}

// Shared mutable ref for game loop (avoids re-renders)
export const keyboardRef = getKeyboardRef()

export function initKeyboardListeners(movementEnabled: boolean): () => void {
  const onDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      const { phase, togglePause, activeModal, closeModal, isPaused } =
        useGameStore.getState()
      if (phase !== 'playing') return
      e.preventDefault()
      if (activeModal) closeModal()
      else if (isPaused) closeModal()
      else togglePause()
      return
    }

    if (!movementEnabled) return

    const key = KEY_MAP[e.code]
    if (key) {
      keyboardRef[key] = true
      if (e.code === 'Space') e.preventDefault()
    }
    if (e.code === 'KeyR') {
      const { phase, isPaused, activeModal, requestUnstuck } = useGameStore.getState()
      if (phase === 'playing' && !isPaused && !activeModal) requestUnstuck()
    }
  }
  const onUp = (e: KeyboardEvent) => {
    const key = KEY_MAP[e.code]
    if (key) keyboardRef[key] = false
  }
  window.addEventListener('keydown', onDown)
  window.addEventListener('keyup', onUp)
  return () => {
    window.removeEventListener('keydown', onDown)
    window.removeEventListener('keyup', onUp)
  }
}
