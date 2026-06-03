import { FloatingIsland } from './environment/FloatingIsland'
import { Ocean } from './environment/Ocean'
import { BridgePath } from './environment/BridgePath'
import { PathLights } from './environment/PathLights'
import { PathGameplay } from './collectibles/PathGameplay'
import { LowPolyTree, LowPolyRock } from './environment/LowPolyTree'
import { ZONES as ZONE_LIST, ZONE_IDS } from '@/utils/constants'
import { ZoneTrigger } from './zones/ZoneTrigger'
import { ZoneComputerSystem } from './zones/ZoneComputer'
import { ProjectMonument } from './zones/ProjectMonument'
import { SkillPedestal } from './zones/SkillPedestal'
import { AchievementOrb } from './zones/AchievementOrb'
import { projects } from '@/data/projects'
import { skills } from '@/data/skills'
import { achievements } from '@/data/achievements'
import { useGameStore } from '@/store/gameStore'

export function World() {
  const enterZone = useGameStore((s) => s.enterZone)

  return (
    <group>
      <Ocean />

      <FloatingIsland
        position={[0, 0, 0]}
        size={[20, 3, 20]}
        color="#4ade80"
        label="🏠 Home"
        decoration="trees"
      />

      {ZONE_LIST.map((zone) => (
        <FloatingIsland
          key={zone.id}
          position={zone.position}
          size={zone.size}
          color={zone.color}
          label={zone.label}
          decoration={zone.id === ZONE_IDS.PROJECTS ? 'rocks' : 'trees'}
        />
      ))}

      <BridgePath />
      <PathLights />
      <PathGameplay />

      <LowPolyTree position={[-5, 2, 5]} scale={1.2} />
      <LowPolyTree position={[6, 2, -4]} scale={1} />
      <LowPolyTree position={[-3, 2, -6]} scale={0.9} />
      <LowPolyRock position={[4, 2, 6]} scale={1.5} />
      <LowPolyRock position={[-7, 2, -3]} scale={1} />

      {/* Har zone + home par computer — saamne jao to popup */}
      <ZoneComputerSystem />

      {ZONE_LIST.map((zone) => (
        <ZoneTrigger
          key={`trigger-${zone.id}`}
          zoneId={zone.id}
          position={zone.position}
          size={zone.size}
          onEnter={enterZone}
        />
      ))}

      {projects.map((p) => (
        <ProjectMonument key={p.id} project={p} />
      ))}

      {skills.map((s) => (
        <SkillPedestal key={s.id} skill={s} />
      ))}

      {achievements.map((a) => (
        <AchievementOrb key={a.id} achievement={a} />
      ))}
    </group>
  )
}
