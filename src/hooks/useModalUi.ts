import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

/** Popup/pause par pointer lock hatao + cursor dikhao */
export function useModalUi() {
  const activeModal = useGameStore((s) => s.activeModal)
  const isPaused = useGameStore((s) => s.isPaused)

  useEffect(() => {
    const uiOpen = Boolean(activeModal) || isPaused
    if (!uiOpen) return

    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
    document.body.style.cursor = 'default'

    return () => {
      document.body.style.cursor = ''
    }
  }, [activeModal, isPaused])
}
