import { useGameStore } from '@/store/gameStore'

export function CoinCounter() {
  const coinCount = useGameStore((s) => s.coinCount)
  const totalCoins = useGameStore((s) => s.totalCoins)
  const coinPop = useGameStore((s) => s.coinPop)

  return (
    <div
      className={`w-full transition-transform duration-200 ${
        coinPop ? 'scale-105' : 'scale-100'
      }`}
    >
      <div className="game-panel px-4 py-2 flex items-center gap-2 border-yellow-500/40">
        <span className="text-2xl">🪙</span>
        <div>
          <p className="text-[10px] text-yellow-400/80 uppercase font-bold tracking-wider">Coins</p>
          <p className="text-lg font-bold text-yellow-300 font-mono">
            {coinCount}
            <span className="text-gray-500 text-sm"> / {totalCoins}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
