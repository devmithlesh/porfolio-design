import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { profile } from '@/data/profile'
import { ProgressBar } from './ProgressBar'
import { CoinCounter } from './CoinCounter'
import { AchievementToast } from './AchievementToast'
import { MiniMap } from './MiniMap'
import { PauseMenu } from './PauseMenu'
import { SettingsMenu } from './SettingsMenu'
import { VirtualJoystick, MobileActionButtons } from './VirtualJoystick'
import { AboutModal } from './modals/AboutModal'
import { ProjectModal } from './modals/ProjectModal'
import { SkillModal } from './modals/SkillModal'
import { AchievementModal } from './modals/AchievementModal'
import { ContactModal } from './modals/ContactModal'
import { HomeModal } from './modals/HomeModal'
import { ProjectsZoneModal } from './modals/ProjectsZoneModal'
import { SkillsZoneModal } from './modals/SkillsZoneModal'
import { AchievementsZoneModal } from './modals/AchievementsZoneModal'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useModalUi } from '@/hooks/useModalUi'

export function GameHUD() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const activeModal = useGameStore((s) => s.activeModal)
  const togglePause = useGameStore((s) => s.togglePause)
  const toggleNight = useGameStore((s) => s.toggleNight)
  const isNight = useGameStore((s) => s.isNight)
  const setFullscreen = useGameStore((s) => s.setFullscreen)
  const isMobile = useIsMobile()
  useModalUi()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  return (
    <>
      <div className="absolute top-4 left-4 right-4 md:right-auto z-20 flex flex-col gap-3 md:w-72 pointer-events-none">
        <div className="pointer-events-auto">
          <ProgressBar />
        </div>
        <div className="pointer-events-auto">
          <CoinCounter />
        </div>
      </div>
      <MiniMap />
      <AchievementToast />
      <PauseMenu />

      {activeModal === 'home' && <HomeModal />}
      {activeModal === 'about' && <AboutModal />}
      {activeModal === 'projects' && <ProjectsZoneModal />}
      {activeModal === 'skills' && <SkillsZoneModal />}
      {activeModal === 'achievements' && <AchievementsZoneModal />}
      {activeModal === 'project' && <ProjectModal />}
      {activeModal === 'skill' && <SkillModal />}
      {activeModal === 'achievement' && <AchievementModal />}
      {activeModal === 'contact' && <ContactModal />}

      <SettingsMenu open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Top bar — night toggle prominent */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 items-center">
        <button
          onClick={toggleNight}
          className={`game-btn text-xs px-4 py-2 font-bold ${isNight ? 'ring-2 ring-yellow-300' : ''}`}
          title={isNight ? 'Day mode' : 'Night mode'}
        >
          {isNight ? '☀️ Day' : '🌙 Night'}
        </button>
        <a
          href={profile.resumeUrl}
          download
          className="game-btn-secondary text-xs hidden sm:inline-flex items-center gap-1"
        >
          📄 Resume
        </a>
        <button onClick={() => setSettingsOpen(true)} className="game-btn-secondary text-xs px-3">
          ⚙️
        </button>
        <button onClick={togglePause} className="game-btn-secondary text-xs px-3">
          ⏸
        </button>
        <button onClick={toggleFullscreen} className="game-btn-secondary text-xs px-3 hidden sm:block">
          ⛶
        </button>
      </div>

      {/* Controls hint */}
      {!activeModal && !isMobile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <p className="text-[10px] text-gray-500/80 bg-black/30 px-4 py-1 rounded-full backdrop-blur">
            Scroll = zoom · 💻 Computer = info · Paani: ramp ↑ Home · ESC
          </p>
        </div>
      )}

      {isMobile && (
        <>
          <VirtualJoystick />
          <MobileActionButtons />
        </>
      )}
    </>
  )
}
