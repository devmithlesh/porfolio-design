import type { Vector3Tuple } from 'three'

export interface PathSegment {
  position: Vector3Tuple
  size: [number, number, number]
}

export type PathRouteId = 'about' | 'projects' | 'skills' | 'achievements' | 'contact'

export interface PathRoute {
  id: PathRouteId
  segments: PathSegment[]
}

const HUB_TOP: Vector3Tuple = [0, 2, 0]

function buildPath(
  from: Vector3Tuple,
  to: Vector3Tuple,
  width = 4,
  step = 1.65
): PathSegment[] {
  const segments: PathSegment[] = []
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const dz = to[2] - from[2]
  const dist = Math.sqrt(dx * dx + dz * dz)
  const steps = Math.max(1, Math.ceil(dist / step))

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    segments.push({
      position: [from[0] + dx * t, from[1] + dy * t, from[2] + dz * t],
      size: [width, 0.6, step + 1],
    })
  }
  return segments
}

export const PATH_ROUTES: PathRoute[] = [
  {
    id: 'about',
    segments: [
      ...buildPath(HUB_TOP, [-20, 2.5, -10], 4),
      ...buildPath([-20, 2.5, -10], [-28, 3, -12], 4),
    ],
  },
  {
    id: 'projects',
    segments: [
      ...buildPath(HUB_TOP, [18, 2.5, -12], 4),
      ...buildPath([18, 2.5, -12], [28, 3, -18], 4),
    ],
  },
  {
    id: 'skills',
    segments: [
      ...buildPath(HUB_TOP, [-14, 2.5, 16], 4),
      ...buildPath([-14, 2.5, 16], [-22, 3, 28], 4),
    ],
  },
  {
    id: 'achievements',
    segments: [
      ...buildPath(HUB_TOP, [14, 2.5, 16], 4),
      ...buildPath([14, 2.5, 16], [26, 3, 28], 4),
    ],
  },
  {
    id: 'contact',
    segments: [
      ...buildPath(HUB_TOP, [0, 2.5, -20], 4),
      ...buildPath([0, 2.5, -20], [0, 3, -32], 4),
    ],
  },
]

export const WORLD_PATHS: PathSegment[] = PATH_ROUTES.flatMap((r) => r.segments)
