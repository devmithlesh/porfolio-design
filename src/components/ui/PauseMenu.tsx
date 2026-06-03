import { useGameStore } from '@/store/gameStore'

export function PauseMenu() {
  const isPaused = useGameStore((s) => s.isPaused)
  const togglePause = useGameStore((s) => s.togglePause)
  const setPhase = useGameStore((s) => s.setPhase)
  const activeModal = useGameStore((s) => s.activeModal)

  if (!isPaused || activeModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md cursor-default">
      <div className="game-panel p-8 text-center max-w-sm w-full mx-4">
        <h2 className="text-3xl font-bold text-white mb-2">Paused</h2>
        <p className="text-gray-400 text-sm mb-8">Take a breather, adventurer</p>
        <div className="space-y-3">
          <button onClick={togglePause} className="game-btn w-full">
            ▶ Resume
          </button>
          <button
            onClick={() => {
              useGameStore.getState().resetCoins()
              setPhase('loading')
              useGameStore.getState().setLoadingProgress(0)
              setTimeout(() => {
                useGameStore.getState().setLoadingProgress(100)
                useGameStore.getState().setPhase('playing')
                togglePause()
              }, 1500)
            }}
            className="game-btn-secondary w-full"
          >
            🔄 Restart
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-6">ESC to resume</p>
      </div>
    </div>
  )
}
