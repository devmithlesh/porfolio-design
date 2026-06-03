import { useState } from 'react'
import { profile } from '@/data/profile'
import { useGameStore } from '@/store/gameStore'
import { ModalShell, ModalCloseButton } from './ModalShell'

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
      <div>
        <p className="text-[10px] text-gray-500 uppercase">{label}</p>
        <p className="text-sm text-white truncate">{value}</p>
      </div>
      <button onClick={copy} className="game-btn-secondary text-xs shrink-0">
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  )
}

export function ContactModal() {
  const closeModal = useGameStore((s) => s.closeModal)

  const links = [
    { label: 'LinkedIn', value: profile.linkedin },
    { label: 'GitHub', value: profile.github },
    { label: 'Portfolio', value: profile.portfolio },
  ]

  return (
    <ModalShell onClose={closeModal} panelClassName="game-panel p-6 md:p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-pink-400">📡 Contact Terminal</h2>
          <ModalCloseButton onClose={closeModal} />
        </div>

        <div className="space-y-3">
          <CopyField label="Email" value={profile.email} />
          <CopyField label="Phone" value={profile.phone} />
          {links.map((l) => (
            <CopyField key={l.label} label={l.label} value={l.value} />
          ))}
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Press ESC or × to return to the world
        </p>
    </ModalShell>
  )
}
