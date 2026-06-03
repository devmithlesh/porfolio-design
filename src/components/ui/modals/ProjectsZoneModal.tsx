import { projects } from '@/data/projects'
import { useGameStore } from '@/store/gameStore'
import { useGsapModal } from '@/hooks/useGsapModal'
import { ModalShell, ModalCloseButton } from './ModalShell'

export function ProjectsZoneModal() {
  const closeModal = useGameStore((s) => s.closeModal)
  const setActiveProject = useGameStore((s) => s.setActiveProject)
  const panelRef = useGsapModal(true)

  const openProject = (id: string) => {
    const project = projects.find((p) => p.id === id)
    if (project) {
      closeModal()
      setTimeout(() => setActiveProject(project), 100)
    }
  }

  return (
    <ModalShell
      onClose={closeModal}
      panelRef={panelRef}
      panelClassName="game-panel w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
    >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-emerald-400">🚀 Projects Lab</h2>
          <ModalCloseButton onClose={closeModal} />
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Detail ke liye kisi project par click karo — island par monuments bhi hain.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => openProject(p.id)}
              className="text-left p-4 rounded-xl bg-white/5 border border-emerald-500/30 hover:border-emerald-400 hover:bg-white/10 transition"
            >
              <p className="font-bold text-white">{p.title}</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.tech.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
    </ModalShell>
  )
}
