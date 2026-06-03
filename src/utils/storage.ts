import { STORAGE_KEY } from './constants'

export interface SaveData {
  unlockedAchievements: string[]
  visitedZones: string[]
  checkpoints: string[]
  progress: number
  collectedCoinIds: string[]
  coinCount: number
  settings: {
    musicVolume: number
    sfxVolume: number
    sensitivity: number
  }
}

const DEFAULT_SAVE: SaveData = {
  unlockedAchievements: [],
  visitedZones: [],
  checkpoints: ['spawn'],
  progress: 0,
  collectedCoinIds: [],
  coinCount: 0,
  settings: {
    musicVolume: 0.4,
    sfxVolume: 0.6,
    sensitivity: 1,
  },
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SAVE }
    return { ...DEFAULT_SAVE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SAVE }
  }
}

export function persistSave(data: Partial<SaveData>): void {
  const current = loadSave()
  const merged = { ...current, ...data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
}

export function resetSave(): void {
  localStorage.removeItem(STORAGE_KEY)
}
