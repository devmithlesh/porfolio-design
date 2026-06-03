import { skills } from '@/data/skills'
import { useGameStore } from '@/store/gameStore'
import { useGsapModal } from '@/hooks/useGsapModal'
import { ModalShell, ModalCloseButton } from './ModalShell'

export function SkillsZoneModal() {
  const closeModal = useGameStore((s) => s.closeModal)
  const setActiveSkill = useGameStore((s) => s.setActiveSkill)
  const panelRef = useGsapModal(true)

  const openSkill = (id: string) => {
    const skill = skills.find((s) => s.id === id)
    if (skill) {
      closeModal()
      setTimeout(() => setActiveSkill(skill), 100)
    }
  }

  return (
    <ModalShell
      onClose={closeModal}
      panelRef={panelRef}
      panelClassName="game-panel w-full max-w-xl max-h-[85vh] overflow-y-auto p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-sky-400">⚡ Skills Studio</h2>
        <ModalCloseButton onClose={closeModal} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {skills.map((s) => (
          <button
            key={s.id}
            onClick={() => openSkill(s.id)}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-sky-500/30 hover:bg-white/10 text-left transition cursor-pointer"
          >
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="font-bold text-white">{s.name}</p>
              <p className="text-[11px] text-gray-400 line-clamp-1">{s.description}</p>
            </div>
          </button>
        ))}
      </div>
    </ModalShell>
  )
}
