import { memo, useCallback, Suspense } from 'react'
import { PATH_COINS, PATH_ROCKS, PATH_CUTTERS } from '@/utils/pathLayout'
import { useGameStore } from '@/store/gameStore'
import { Coin } from './Coin'
import { PathRock } from './PathRock'
import { PathCutter } from './PathCutter'
import { useSound } from '@/hooks/useSound'

function CoinLayer({ onCollect }: { onCollect: () => void }) {
  const coinSession = useGameStore((s) => s.coinSession)
  return (
    <>
      {PATH_COINS.map((c) => (
        <Coin
          key={`${c.id}-${coinSession}`}
          id={c.id}
          position={c.position}
          onCollect={onCollect}
        />
      ))}
    </>
  )
}

function PathGameplayInner() {
  const { playSfx } = useSound()
  const onCoinCollect = useCallback(() => playSfx('coin'), [playSfx])

  return (
    <group name="path-gameplay">
      <CoinLayer onCollect={onCoinCollect} />
      {PATH_ROCKS.map((r) => (
        <PathRock key={r.id} rock={r} />
      ))}
      <Suspense fallback={null}>
        {PATH_CUTTERS.map((c) => (
          <PathCutter key={c.id} cutter={c} />
        ))}
      </Suspense>
    </group>
  )
}

export const PathGameplay = memo(PathGameplayInner)
