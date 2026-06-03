import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useGsapModal(active: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (active) {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }
      )
    }
  }, [active])

  return ref
}
