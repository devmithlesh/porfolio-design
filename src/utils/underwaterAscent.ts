import type { Vector3Tuple } from 'three'

export interface AscentStep {
  id: string
  position: Vector3Tuple
  size: [number, number, number]
  color: string
}

/** Underwater ramp — Home island tak wapas */
export const HOME_ASCENT_STEPS: AscentStep[] = [
  { id: 'a0', position: [0, -7.05, 14], size: [6, 0.45, 5], color: '#78716c' },
  { id: 'a1', position: [0, -6.35, 11], size: [5.5, 0.45, 4.5], color: '#a8a29e' },
  { id: 'a2', position: [0, -5.65, 8.5], size: [5, 0.45, 4], color: '#78716c' },
  { id: 'a3', position: [0, -4.9, 6], size: [4.5, 0.45, 3.5], color: '#a8a29e' },
  { id: 'a4', position: [0, -4.1, 3.5], size: [4, 0.45, 3], color: '#78716c' },
  { id: 'a5', position: [0, -3.2, 1.5], size: [3.8, 0.45, 2.8], color: '#65a30d' },
  { id: 'a6', position: [0, -2.2, -0.2], size: [3.5, 0.45, 2.5], color: '#4ade80' },
  { id: 'a7', position: [0, -0.8, -1.5], size: [3.2, 0.5, 2.2], color: '#22c55e' },
  { id: 'a8', position: [0, 0.6, -2.2], size: [3, 0.55, 2], color: '#4ade80' },
]

/** Side ramp — About path ke paas */
export const SIDE_ASCENT_STEPS: AscentStep[] = [
  { id: 'b0', position: [-12, -7.05, 10], size: [5, 0.45, 4], color: '#78716c' },
  { id: 'b1', position: [-14, -6.3, 7.5], size: [4.5, 0.45, 3.5], color: '#a8a29e' },
  { id: 'b2', position: [-16, -5.5, 5], size: [4, 0.45, 3], color: '#78716c' },
  { id: 'b3', position: [-18, -4.5, 2.5], size: [3.8, 0.45, 2.8], color: '#65a30d' },
  { id: 'b4', position: [-20, -3.2, 0], size: [3.5, 0.5, 2.5], color: '#4ade80' },
]

export const ALL_ASCENT_STEPS = [...HOME_ASCENT_STEPS, ...SIDE_ASCENT_STEPS]
