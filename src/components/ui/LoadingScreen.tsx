import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGameStore } from '@/store/gameStore'

export function LoadingScreen() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const loadingProgress = useGameStore((s) => s.loadingProgress)
  const setLoadingProgress = useGameStore((s) => s.setLoadingProgress)
  const setPhase = useGameStore((s) => s.setPhase)

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
    }
  }, [])

  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setLoadingProgress(100)
        setTimeout(() => setPhase('playing'), 600)
      } else {
        setLoadingProgress(Math.min(progress, 99))
      }
    }, 200)
    return () => clearInterval(interval)
  }, [setLoadingProgress, setPhase])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-game-dark via-indigo-950 to-game-dark">
      <div className="mb-8 text-center">
        <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse-glow">
          Quest Portfolio
        </h1>
        <p className="mt-2 text-gray-400 text-sm md:text-base">
          Loading your adventure...
        </p>
      </div>

      <div className="w-64 md:w-80 h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 rounded-full"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <p className="mt-3 text-cyan-400 font-mono text-sm">{Math.round(loadingProgress)}%</p>

      <div className="mt-12 grid grid-cols-2 gap-4 text-xs text-gray-500 max-w-md px-4">
        <div className="game-panel p-3 text-center">
          <span className="text-lg">🎮</span>
          <p className="mt-1">WASD to move</p>
        </div>
        <div className="game-panel p-3 text-center">
          <span className="text-lg">🖱️</span>
          <p className="mt-1">Mouse to look</p>
        </div>
        <div className="game-panel p-3 text-center">
          <span className="text-lg">␣</span>
          <p className="mt-1">Space to jump</p>
        </div>
        <div className="game-panel p-3 text-center">
          <span className="text-lg">🏝️</span>
          <p className="mt-1">Explore islands</p>
        </div>
      </div>
    </div>
  )
}
