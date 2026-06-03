import { useGameStore } from '@/store/gameStore'
import { resetSave } from '@/utils/storage'

interface SettingsMenuProps {
  open: boolean
  onClose: () => void
}

export function SettingsMenu({ open, onClose }: SettingsMenuProps) {
  const musicVolume = useGameStore((s) => s.musicVolume)
  const sfxVolume = useGameStore((s) => s.sfxVolume)
  const sensitivity = useGameStore((s) => s.sensitivity)
  const setMusicVolume = useGameStore((s) => s.setMusicVolume)
  const setSfxVolume = useGameStore((s) => s.setSfxVolume)
  const setSensitivity = useGameStore((s) => s.setSensitivity)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="game-panel p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">⚙️ Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <label className="block mb-4">
          <span className="text-xs text-gray-400 uppercase">Music Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            className="w-full mt-1 accent-cyan-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-xs text-gray-400 uppercase">SFX Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sfxVolume}
            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            className="w-full mt-1 accent-cyan-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-xs text-gray-400 uppercase">Mouse Sensitivity</span>
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="w-full mt-1 accent-cyan-500"
          />
        </label>

        <button
          onClick={() => {
            resetSave()
            window.location.reload()
          }}
          className="game-btn-secondary w-full text-red-400 border-red-400/30"
        >
          Reset Progress
        </button>
      </div>
    </div>
  )
}
