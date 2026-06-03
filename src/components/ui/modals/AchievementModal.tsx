import { useGameStore } from '@/store/gameStore'
import { ModalShell, ModalCloseButton } from './ModalShell'

export function AchievementModal() {
  const achievement = useGameStore((s) => s.activeAchievement)
  const unlocked = useGameStore((s) => s.unlockedAchievements)
  const closeModal = useGameStore((s) => s.closeModal)

  if (!achievement) return null
  const isUnlocked = unlocked.includes(achievement.id)

  return (
    <ModalShell
      onClose={closeModal}
      panelClassName="game-panel p-8 max-w-sm w-full text-center border-game-gold/30"
    >
      <div className="flex justify-end mb-2">
        <ModalCloseButton onClose={closeModal} />
      </div>
      <span className="text-5xl">{achievement.icon}</span>
      <h2 className="text-xl font-bold text-game-gold mt-4">{achievement.title}</h2>
      <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-white/10 text-gray-400 capitalize">
        {achievement.category}
      </span>
      <p className="text-gray-300 text-sm mt-4">{achievement.description}</p>
      <p className={`mt-4 text-sm font-bold ${isUnlocked ? 'text-game-gold' : 'text-gray-500'}`}>
        {isUnlocked ? '✓ Unlocked' : '🔒 Walk near to unlock'}
      </p>
    </ModalShell>
  )
}
