import { useGameStore } from '@/store/gameStore'
import { ModalShell, ModalCloseButton } from './ModalShell'

export function SkillModal() {
  const skill = useGameStore((s) => s.activeSkill)
  const closeModal = useGameStore((s) => s.closeModal)

  if (!skill) return null

  return (
    <ModalShell onClose={closeModal} panelClassName="game-panel p-8 max-w-sm w-full text-center relative">
      <div className="absolute top-4 right-4">
        <ModalCloseButton onClose={closeModal} />
      </div>
      <span className="text-5xl">{skill.icon}</span>
      <h2 className="text-2xl font-bold mt-4" style={{ color: skill.color }}>
        {skill.name}
      </h2>
      <p className="text-gray-300 text-sm mt-3">{skill.description}</p>
      <div
        className="mt-6 h-2 rounded-full"
        style={{ background: `linear-gradient(90deg, ${skill.color}44, ${skill.color})` }}
      />
    </ModalShell>
  )
}
