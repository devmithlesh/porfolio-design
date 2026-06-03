import { create } from 'zustand'
import type { Project } from '@/data/projects'
import type { Skill } from '@/data/skills'
import type { Achievement } from '@/data/achievements'
import type { ZoneId } from '@/utils/constants'
import { loadSave, persistSave } from '@/utils/storage'
import { PATH_COINS, TOTAL_COINS } from '@/utils/pathLayout'

const VALID_COIN_IDS = new Set(PATH_COINS.map((c) => c.id))

function normalizeCollectedIds(ids: string[]): string[] {
  return [...new Set(ids.filter((id) => VALID_COIN_IDS.has(id)))]
}
import { getNearestSafePosition } from '@/utils/nearestPath'

export type GamePhase = 'loading' | 'playing' | 'paused'
export type ModalType =
  | 'about'
  | 'project'
  | 'skill'
  | 'achievement'
  | 'contact'
  | 'projects'
  | 'skills'
  | 'achievements'
  | 'home'
  | null

interface GameState {
  phase: GamePhase
  loadingProgress: number
  isPaused: boolean
  activeModal: ModalType
  activeProject: Project | null
  activeSkill: Skill | null
  activeAchievement: Achievement | null
  currentZone: ZoneId | null
  unlockedAchievements: string[]
  visitedZones: string[]
  progress: number
  achievementToast: { title: string; description: string } | null
  musicVolume: number
  sfxVolume: number
  sensitivity: number
  isFullscreen: boolean
  playerPosition: [number, number, number]
  cameraZoomTarget: number | null
  mobileInput: { x: number; y: number; jump: boolean; run: boolean }
  coinCount: number
  collectedCoinIds: string[]
  coinPop: boolean
  totalCoins: number
  respawnTick: number
  respawnPosition: [number, number, number] | null
  isNight: boolean
  coinSession: number
  nearComputerId: string | null

  setPhase: (phase: GamePhase) => void
  collectCoin: (id: string) => boolean
  resetCoins: () => void
  requestRespawn: () => void
  requestUnstuck: () => void
  toggleNight: () => void
  setLoadingProgress: (p: number) => void
  setPaused: (paused: boolean) => void
  togglePause: () => void
  openModal: (type: ModalType) => void
  closeModal: () => void
  setActiveProject: (project: Project | null) => void
  setActiveSkill: (skill: Skill | null) => void
  setActiveAchievement: (achievement: Achievement | null) => void
  enterZone: (zoneId: ZoneId) => void
  unlockAchievement: (id: string, title: string, description: string) => void
  setMusicVolume: (v: number) => void
  setSfxVolume: (v: number) => void
  setSensitivity: (v: number) => void
  setFullscreen: (v: boolean) => void
  setPlayerPosition: (pos: [number, number, number]) => void
  setCameraZoomTarget: (distance: number | null) => void
  setMobileInput: (input: Partial<GameState['mobileInput']>) => void
  setNearComputerId: (id: string | null) => void
  hydrate: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'loading',
  loadingProgress: 0,
  isPaused: false,
  activeModal: null,
  activeProject: null,
  activeSkill: null,
  activeAchievement: null,
  currentZone: null,
  unlockedAchievements: [],
  visitedZones: [],
  progress: 0,
  achievementToast: null,
  musicVolume: 0.4,
  sfxVolume: 0.6,
  sensitivity: 1,
  isFullscreen: false,
  playerPosition: [0, 3, 0],
  cameraZoomTarget: null,
  mobileInput: { x: 0, y: 0, jump: false, run: false },
  coinCount: 0,
  collectedCoinIds: [],
  coinPop: false,
  totalCoins: TOTAL_COINS,
  respawnTick: 0,
  respawnPosition: null,
  isNight: false,
  coinSession: 0,
  nearComputerId: null,

  setPhase: (phase) => set({ phase }),
  setNearComputerId: (nearComputerId) => set({ nearComputerId }),
  toggleNight: () => set((s) => ({ isNight: !s.isNight })),
  resetCoins: () => {
    set({
      collectedCoinIds: [],
      coinCount: 0,
      coinSession: get().coinSession + 1,
      coinPop: false,
    })
    persistSave({ collectedCoinIds: [], coinCount: 0 })
  },
  requestRespawn: () => {
    set({
      respawnTick: Date.now(),
      respawnPosition: null,
      achievementToast: {
        title: '💥 Start se dubara!',
        description: 'Home island par wapas aa gaye.',
      },
    })
    setTimeout(() => set({ achievementToast: null }), 2500)
  },
  requestUnstuck: () => {
    const { playerPosition } = get()
    const safe = getNearestSafePosition(playerPosition[0], playerPosition[2])
    set({
      respawnTick: Date.now(),
      respawnPosition: safe,
      achievementToast: {
        title: '↩️ Path par wapas',
        description: 'R = unstuck (refresh ki zaroorat nahi)',
      },
    })
    setTimeout(() => set({ achievementToast: null }), 2000)
  },
  collectCoin: (id) => {
    if (!VALID_COIN_IDS.has(id)) return false
    const { collectedCoinIds } = get()
    if (collectedCoinIds.includes(id)) return false

    const updated = [...collectedCoinIds, id]
    const count = updated.length
    set({
      collectedCoinIds: updated,
      coinCount: count,
      coinPop: true,
      achievementToast: {
        title: `+1 Coin! 🪙`,
        description: `Total: ${count} / ${TOTAL_COINS}`,
      },
    })
    persistSave({ collectedCoinIds: updated, coinCount: count })
    setTimeout(() => set({ coinPop: false, achievementToast: null }), 1500)
    return true
  },
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  setPaused: (isPaused) => set({ isPaused }),
  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
  openModal: (activeModal) => set({ activeModal, isPaused: true }),
  closeModal: () =>
    set({
      activeModal: null,
      activeProject: null,
      activeSkill: null,
      activeAchievement: null,
      isPaused: false,
      cameraZoomTarget: null,
    }),
  setActiveProject: (activeProject) =>
    set({ activeProject, activeModal: activeProject ? 'project' : null, isPaused: !!activeProject }),
  setActiveSkill: (activeSkill) =>
    set({ activeSkill, activeModal: activeSkill ? 'skill' : null, isPaused: !!activeSkill }),
  setActiveAchievement: (activeAchievement) =>
    set({
      activeAchievement,
      activeModal: activeAchievement ? 'achievement' : null,
      isPaused: !!activeAchievement,
    }),
  enterZone: (zoneId) => {
    const { visitedZones } = get()
    const updated = visitedZones.includes(zoneId) ? visitedZones : [...visitedZones, zoneId]
    const progress = Math.round((updated.length / 5) * 100)
    set({ currentZone: zoneId, visitedZones: updated, progress })
    persistSave({ visitedZones: updated, progress })
  },
  unlockAchievement: (id, title, description) => {
    const { unlockedAchievements } = get()
    if (unlockedAchievements.includes(id)) return
    const updated = [...unlockedAchievements, id]
    set({
      unlockedAchievements: updated,
      achievementToast: { title, description },
    })
    persistSave({ unlockedAchievements: updated })
    setTimeout(() => set({ achievementToast: null }), 4000)
  },
  setMusicVolume: (musicVolume) => {
    set({ musicVolume })
    persistSave({ settings: { ...loadSave().settings, musicVolume } })
  },
  setSfxVolume: (sfxVolume) => {
    set({ sfxVolume })
    persistSave({ settings: { ...loadSave().settings, sfxVolume } })
  },
  setSensitivity: (sensitivity) => {
    set({ sensitivity })
    persistSave({ settings: { ...loadSave().settings, sensitivity } })
  },
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  setCameraZoomTarget: (cameraZoomTarget) => set({ cameraZoomTarget }),
  setMobileInput: (input) =>
    set((s) => ({ mobileInput: { ...s.mobileInput, ...input } })),
  hydrate: () => {
    const save = loadSave()
    const ids = normalizeCollectedIds(save.collectedCoinIds ?? [])
    const count = ids.length
    if (
      count !== (save.coinCount ?? 0) ||
      ids.length !== (save.collectedCoinIds?.length ?? 0)
    ) {
      persistSave({ collectedCoinIds: ids, coinCount: count })
    }
    set({
      unlockedAchievements: save.unlockedAchievements,
      visitedZones: save.visitedZones,
      progress: save.progress,
      collectedCoinIds: ids,
      coinCount: count,
      musicVolume: save.settings.musicVolume,
      sfxVolume: save.settings.sfxVolume,
      sensitivity: save.settings.sensitivity,
    })
  },
}))
