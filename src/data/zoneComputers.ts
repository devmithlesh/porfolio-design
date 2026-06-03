import type { Vector3Tuple } from 'three'
import type { ZoneId } from '@/utils/constants'
import { ZONE_IDS } from '@/utils/constants'
import type { ModalType } from '@/store/gameStore'

export interface ZoneComputerConfig {
  id: string
  zoneId: ZoneId | 'home'
  label: string
  title: string
  position: Vector3Tuple
  screenColor: string
  bodyColor: string
  modal: ModalType
}

export const ZONE_COMPUTERS: ZoneComputerConfig[] = [
  {
    id: 'pc-home',
    zoneId: 'home',
    label: 'Home Terminal',
    title: 'Portfolio HQ',
    position: [0, 2.8, 4],
    screenColor: '#4ade80',
    bodyColor: '#1e293b',
    modal: 'home',
  },
  {
    id: 'pc-about',
    zoneId: ZONE_IDS.ABOUT,
    label: 'About PC',
    title: 'About Me',
    position: [-28, 3.2, -10],
    screenColor: '#a78bfa',
    bodyColor: '#312e81',
    modal: 'about',
  },
  {
    id: 'pc-projects',
    zoneId: ZONE_IDS.PROJECTS,
    label: 'Projects PC',
    title: 'Projects Lab',
    position: [28, 3.2, -16],
    screenColor: '#34d399',
    bodyColor: '#064e3b',
    modal: 'projects',
  },
  {
    id: 'pc-skills',
    zoneId: ZONE_IDS.SKILLS,
    label: 'Skills PC',
    title: 'Skills Studio',
    position: [-22, 3.2, 26],
    screenColor: '#60a5fa',
    bodyColor: '#1e3a5f',
    modal: 'skills',
  },
  {
    id: 'pc-achievements',
    zoneId: ZONE_IDS.ACHIEVEMENTS,
    label: 'Achievements PC',
    title: 'Trophy Room',
    position: [26, 3.2, 26],
    screenColor: '#fbbf24',
    bodyColor: '#78350f',
    modal: 'achievements',
  },
  {
    id: 'pc-contact',
    zoneId: ZONE_IDS.CONTACT,
    label: 'Contact Terminal',
    title: 'Contact',
    position: [0, 3.2, -36],
    screenColor: '#22d3ee',
    bodyColor: '#1e293b',
    modal: 'contact',
  },
]

export const COMPUTER_INTERACT_RADIUS = 2.75
export const COMPUTER_HINT_RADIUS = 5.5
