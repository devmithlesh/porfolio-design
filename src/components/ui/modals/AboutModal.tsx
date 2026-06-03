import { profile } from '@/data/profile'
import { useGameStore } from '@/store/gameStore'
import { useGsapModal } from '@/hooks/useGsapModal'
import { ModalShell, ModalCloseButton } from './ModalShell'

export function AboutModal() {
  const closeModal = useGameStore((s) => s.closeModal)
  const panelRef = useGsapModal(true)

  return (
    <ModalShell
      onClose={closeModal}
      panelRef={panelRef}
      panelClassName="game-panel w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8"
    >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">About Me</h2>
          <ModalCloseButton onClose={closeModal} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-lg mx-auto md:mx-0"
          />
          <div>
            <h3 className="text-xl font-bold text-white">{profile.name}</h3>
            <p className="text-cyan-400 text-sm">{profile.title}</p>
            <p className="text-gray-300 text-sm mt-3 leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        <section className="mt-8">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💼</span> Experience
          </h4>
          <div className="space-y-4">
            {profile.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-cyan-500/50 pl-4">
                <p className="font-semibold text-white">{exp.role}</p>
                <p className="text-cyan-400 text-sm">
                  {exp.company} · {exp.period}
                </p>
                <p className="text-gray-400 text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>🎓</span> Education
          </h4>
          {profile.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-white">{edu.degree}</p>
              <p className="text-gray-400 text-sm">
                {edu.school} · {edu.year}
              </p>
            </div>
          ))}
        </section>

        <a
          href={profile.resumeUrl}
          download
          className="game-btn mt-6 inline-flex items-center gap-2"
        >
          📄 Download Resume
        </a>
    </ModalShell>
  )
}
