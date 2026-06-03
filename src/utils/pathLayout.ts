import type { Vector3Tuple } from 'three'
import { PATH_ROUTES, WORLD_PATHS, type PathSegment, type PathRouteId } from './paths'

const COINS_PER_PATH = 5
const LIGHTS_PER_PATH = 3
const CUTTERS_PER_PATH = 2

export function pathSurfaceY(seg: PathSegment): number {
  return seg.position[1] + seg.size[1] * 0.28
}

export function pathRunsAlongZ(seg: PathSegment): boolean {
  return seg.size[2] >= seg.size[0]
}

export function pathHalfWidth(seg: PathSegment): number {
  return (pathRunsAlongZ(seg) ? seg.size[0] : seg.size[2]) / 2
}

export interface PathCoin {
  id: string
  position: Vector3Tuple
  routeId: PathRouteId
}

export interface PathRock {
  id: string
  position: Vector3Tuple
  scale: number
}

/** Saw cutter — half on path, half off, slides left-right */
export interface PathCutter {
  id: string
  routeId: PathRouteId
  /** Center sits on path edge */
  edgeCenter: Vector3Tuple
  /** Slide direction (perpendicular to path travel) */
  slideAxis: 'x' | 'z'
  slideRange: number
  bladeRotationY: number
  speed: number
}

export interface PathLight {
  id: string
  position: Vector3Tuple
  routeId: PathRouteId
}

function pickIndices(count: number, total: number, offset = 1): number[] {
  if (total <= 0) return []
  const indices: number[] = []
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1)
    indices.push(Math.min(total - 1, Math.max(0, Math.floor(t * total) + offset)))
  }
  return [...new Set(indices)]
}

function buildRouteCoins(routeId: PathRouteId, segments: PathSegment[]): PathCoin[] {
  const coins: PathCoin[] = []
  const indices = pickIndices(COINS_PER_PATH, segments.length)

  indices.forEach((idx, i) => {
    const seg = segments[idx]
    const y = pathSurfaceY(seg)
    // Thoda upar — jump se collect (pehle bahut zyada upar the)
    const jump = i % 3 === 1
    coins.push({
      id: `coin-${routeId}-${i}`,
      routeId,
      position: [seg.position[0], jump ? y + 0.75 : y + 0.45, seg.position[2]],
    })
  })
  return coins
}

function buildRouteLights(routeId: PathRouteId, segments: PathSegment[]): PathLight[] {
  const lights: PathLight[] = []
  const indices = pickIndices(LIGHTS_PER_PATH, segments.length, 0)

  indices.forEach((idx, i) => {
    const seg = segments[idx]
    const alongZ = pathRunsAlongZ(seg)
    const side = 1.5
    lights.push({
      id: `light-${routeId}-${i}`,
      routeId,
      position: alongZ
        ? [seg.position[0] + side, pathSurfaceY(seg) + 0.45, seg.position[2]]
        : [seg.position[0], pathSurfaceY(seg) + 0.45, seg.position[2] + side],
    })
  })
  return lights
}

function buildRouteCutters(routeId: PathRouteId, segments: PathSegment[]): PathCutter[] {
  const cutters: PathCutter[] = []
  const indices = pickIndices(CUTTERS_PER_PATH, segments.length, 2)
  indices.forEach((idx, i) => {
    const seg = segments[idx]
    const y = pathSurfaceY(seg) + 0.55
    const alongZ = pathRunsAlongZ(seg)
    const halfW = pathHalfWidth(seg)
    // Blade center on path edge — half inside, half outside
    const edgeSign = i % 2 === 0 ? 1 : -1

    if (alongZ) {
      cutters.push({
        id: `cutter-${routeId}-${i}`,
        routeId,
        edgeCenter: [seg.position[0] + edgeSign * halfW, y, seg.position[2]],
        slideAxis: 'x',
        slideRange: halfW * 0.9,
        bladeRotationY: 0,
        speed: 0.85 + i * 0.15,
      })
    } else {
      cutters.push({
        id: `cutter-${routeId}-${i}`,
        routeId,
        edgeCenter: [seg.position[0], y, seg.position[2] + edgeSign * halfW],
        slideAxis: 'z',
        slideRange: halfW * 0.9,
        bladeRotationY: Math.PI / 2,
        speed: 0.9 + i * 0.12,
      })
    }
  })

  return cutters
}

function buildPathRocks(): PathRock[] {
  const rocks: PathRock[] = []
  let id = 0
  WORLD_PATHS.forEach((seg, i) => {
    if (i % 9 !== 4) return
    const alongZ = pathRunsAlongZ(seg)
    rocks.push({
      id: `rock-${id++}`,
      position: alongZ
        ? [seg.position[0] + 1, pathSurfaceY(seg) + 0.2, seg.position[2]]
        : [seg.position[0], pathSurfaceY(seg) + 0.2, seg.position[2] + 1],
      scale: 0.7,
    })
  })
  return rocks
}

export const PATH_COINS = PATH_ROUTES.flatMap((r) => buildRouteCoins(r.id, r.segments))
export const PATH_LIGHTS = PATH_ROUTES.flatMap((r) => buildRouteLights(r.id, r.segments))
export const PATH_CUTTERS = PATH_ROUTES.flatMap((r) => buildRouteCutters(r.id, r.segments))
export const PATH_ROCKS = buildPathRocks()
export const TOTAL_COINS = PATH_COINS.length
