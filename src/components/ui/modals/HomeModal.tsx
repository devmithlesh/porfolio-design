import { profile } from '@/data/profile'
import { useGameStore } from '@/store/gameStore'
import { useGsapModal } from '@/hooks/useGsapModal'
import { ModalShell, ModalCloseButton } from './ModalShell'

export function HomeModal() {
  const closeModal = useGameStore((s) => s.closeModal)
  const panelRef = useGsapModal(true)

  return (
    <ModalShell onClose={closeModal} panelRef={panelRef}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-emerald-400">🏠 Portfolio HQ</h2>
        <ModalCloseButton onClose={closeModal} />
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{profile.tagline}</p>
      <p className="text-gray-400 text-sm mt-4">
        Har island par <strong className="text-cyan-400">computer</strong> hai — uske saamne
        jao, info popup khul jayegi.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-gray-400">
        <li>🟣 About Me · 🟢 Projects · 🔵 Skills</li>
        <li>🟡 Achievements · 🩷 Contact</li>
      </ul>
      <p className="text-[11px] text-gray-500 mt-6">
        × ya ESC se band · bahar click bhi band karega
      </p>
    </ModalShell>
  )
}
