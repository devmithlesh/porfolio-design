import type { Vector3Tuple } from 'three'

export const WORLD_SIZE = 120
export const GRAVITY = -20
export const WALK_SPEED = 5
export const RUN_SPEED = 9
export const JUMP_FORCE = 13
export const SWIM_SPEED = 6
export const SWIM_RUN_SPEED = 9
export const SWIM_UP_SPEED = 5
export const SWIM_SURFACE_Y = -6.2
export const CAMERA_DISTANCE = 8
export const CAMERA_ZOOM_MIN = 4
export const CAMERA_ZOOM_MAX = 32
export const CAMERA_HEIGHT = 4
export const CAMERA_SMOOTH = 0.08
export const MOUSE_SENSITIVITY = 0.003

export const SPAWN_POSITION: Vector3Tuple = [0, 3, 0]

export const ZONE_IDS = {
  ABOUT: 'about',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  ACHIEVEMENTS: 'achievements',
  CONTACT: 'contact',
} as const

export type ZoneId = (typeof ZONE_IDS)[keyof typeof ZONE_IDS]

export interface ZoneConfig {
  id: ZoneId
  label: string
  position: Vector3Tuple
  size: Vector3Tuple
  color: string
}

export const ZONES: ZoneConfig[] = [
  { id: ZONE_IDS.ABOUT, label: 'About Me', position: [-28, 2, -12], size: [14, 4, 14], color: '#a78bfa' },
  { id: ZONE_IDS.PROJECTS, label: 'Projects', position: [28, 2, -18], size: [18, 4, 16], color: '#34d399' },
  { id: ZONE_IDS.SKILLS, label: 'Skills', position: [-22, 2, 28], size: [16, 4, 14], color: '#60a5fa' },
  { id: ZONE_IDS.ACHIEVEMENTS, label: 'Achievements', position: [26, 2, 28], size: [14, 4, 14], color: '#fbbf24' },
  { id: ZONE_IDS.CONTACT, label: 'Contact', position: [0, 2, -38], size: [12, 4, 12], color: '#f472b6' },
]

export const CHECKPOINTS: { id: string; position: Vector3Tuple; label: string }[] = [
  { id: 'spawn', position: [0, 1, 0], label: 'Home Island' },
  ...ZONES.map((z) => ({ id: z.id, position: z.position, label: z.label })),
]

export const STORAGE_KEY = 'quest-portfolio-save'
