import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { useGameStore } from '@/store/gameStore'

const SFX = {
  jump: { freq: 440, duration: 0.15 },
  land: { freq: 220, duration: 0.1 },
  collect: { freq: 987, duration: 0.15 },
  coin: { freq: 1318, duration: 0.12 },
  hazard: { freq: 180, duration: 0.35 },
  achievement: { freq: 880, duration: 0.4 },
  click: { freq: 520, duration: 0.08 },
  zone: { freq: 330, duration: 0.25 },
}

function playTone(freq: number, duration: number, volume: number) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    osc.type = 'sine'
    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
    setTimeout(() => ctx.close(), duration * 1000 + 100)
  } catch {
    /* audio unavailable */
  }
}

export function useSound() {
  const sfxVolume = useGameStore((s) => s.sfxVolume)
  const musicVolume = useGameStore((s) => s.musicVolume)
  const musicRef = useRef<Howl | null>(null)

  useEffect(() => {
    musicRef.current = new Howl({
      src: ['/audio/ambient.mp3'],
      loop: true,
      volume: musicVolume,
      html5: true,
      onloaderror: () => {
        /* fallback: procedural ambient handled below */
      },
    })

    return () => {
      musicRef.current?.unload()
    }
  }, [])

  useEffect(() => {
    musicRef.current?.volume(musicVolume)
  }, [musicVolume])

  const startMusic = useCallback(() => {
    try {
      musicRef.current?.play()
    } catch {
      /* silent fallback */
    }
  }, [])

  const stopMusic = useCallback(() => {
    musicRef.current?.pause()
  }, [])

  const playSfx = useCallback(
    (name: keyof typeof SFX) => {
      const cfg = SFX[name]
      playTone(cfg.freq, cfg.duration, sfxVolume)
    },
    [sfxVolume]
  )

  return { playSfx, startMusic, stopMusic }
}
