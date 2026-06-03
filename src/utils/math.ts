import * as THREE from 'three'

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function damp(current: number, target: number, smooth: number, dt: number): number {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-smooth * dt))
}

export function angleLerp(current: number, target: number, t: number): number {
  const diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI
  return current + diff * t
}

export function distance2D(a: THREE.Vector3, b: THREE.Vector3): number {
  const dx = a.x - b.x
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dz * dz)
}
