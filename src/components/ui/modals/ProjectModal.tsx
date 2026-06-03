import { useGameStore } from '@/store/gameStore'
import { ModalShell, ModalCloseButton } from './ModalShell'

export function ProjectModal() {
  const project = useGameStore((s) => s.activeProject)
  const closeModal = useGameStore((s) => s.closeModal)

  if (!project) return null

  return (
    <ModalShell onClose={closeModal} panelClassName="game-panel w-full max-w-lg overflow-hidden">
      <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-white">{project.title}</h2>
          <ModalCloseButton onClose={closeModal} />
        </div>
        <p className="text-gray-300 text-sm mt-3 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-1 text-xs rounded-full bg-white/10 text-cyan-400 border border-cyan-500/30"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="game-btn-secondary flex-1 text-center"
          >
            GitHub
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="game-btn flex-1 text-center"
          >
            Live Demo
          </a>
        </div>
      </div>
    </ModalShell>
  )
}
