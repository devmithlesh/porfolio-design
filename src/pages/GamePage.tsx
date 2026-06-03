import { useGameStore } from '@/store/gameStore'
import { GameCanvas } from '@/components/canvas/GameCanvas'
import { GameHUD } from '@/components/ui/GameHUD'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

export function GamePage() {
  const phase = useGameStore((s) => s.phase)

  return (
    <div className="relative w-full h-full">
      {phase === 'loading' && <LoadingScreen />}
      <GameCanvas />
      {phase === 'playing' && <GameHUD />}
    </div>
  )
}
