import { useGameStore } from '@/store/gameStore'

export function ProgressBar() {
  const progress = useGameStore((s) => s.progress)
  const visitedZones = useGameStore((s) => s.visitedZones)

  return (
    <div className="w-full">
      <div className="game-panel p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Exploration
          </span>
          <span className="text-xs text-gray-400">{progress}%</span>
        </div>
        <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-game-health to-emerald-400 transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          {visitedZones.length}/5 zones discovered
        </p>
      </div>
    </div>
  )
}
