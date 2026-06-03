import { achievements } from '@/data/achievements'
import { useGameStore } from '@/store/gameStore'
import { useGsapModal } from '@/hooks/useGsapModal'
import { ModalShell, ModalCloseButton } from './ModalShell'

export function AchievementsZoneModal() {
  const closeModal = useGameStore((s) => s.closeModal)
  const setActiveAchievement = useGameStore((s) => s.setActiveAchievement)
  const panelRef = useGsapModal(true)

  const openAchievement = (id: string) => {
    const item = achievements.find((a) => a.id === id)
    if (item) {
      closeModal()
      setTimeout(() => setActiveAchievement(item), 100)
    }
  }

  return (
    <ModalShell
      onClose={closeModal}
      panelRef={panelRef}
      panelClassName="game-panel w-full max-w-xl max-h-[85vh] overflow-y-auto p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-amber-400">🏆 Trophy Room</h2>
        <ModalCloseButton onClose={closeModal} />
      </div>
      <div className="space-y-2">
        {achievements.map((a) => (
          <button
            key={a.id}
            onClick={() => openAchievement(a.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-amber-500/30 hover:bg-white/10 text-left transition cursor-pointer"
          >
            <span className="text-2xl">{a.icon}</span>
            <div>
              <p className="font-bold text-white">{a.title}</p>
              <p className="text-xs text-gray-400">{a.description}</p>
            </div>
          </button>
        ))}
      </div>
    </ModalShell>
  )
}
