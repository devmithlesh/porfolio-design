import { useGameStore } from '@/store/gameStore'

export function AchievementToast() {
  const toast = useGameStore((s) => s.achievementToast)
  if (!toast) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-up">
      <div className="game-panel p-4 border-game-gold/50 max-w-xs">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="text-game-gold font-bold text-sm uppercase">Achievement Unlocked!</p>
            <p className="text-white font-semibold">{toast.title}</p>
            <p className="text-gray-400 text-xs mt-0.5">{toast.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
