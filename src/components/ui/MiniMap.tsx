import { useGameStore } from '@/store/gameStore'
import { ZONES as ZONE_LIST } from '@/utils/constants'

const MAP_SIZE = 120

export function MiniMap() {
  const playerPosition = useGameStore((s) => s.playerPosition)
  const visitedZones = useGameStore((s) => s.visitedZones)
  const currentZone = useGameStore((s) => s.currentZone)

  const toMap = (x: number, z: number) => ({
    left: `${((x / MAP_SIZE) * 0.5 + 0.5) * 100}%`,
    top: `${((z / MAP_SIZE) * 0.5 + 0.5) * 100}%`,
  })

  const player = toMap(playerPosition[0], playerPosition[2])

  return (
    <div className="absolute bottom-4 right-4 z-20 hidden md:block">
      <div className="game-panel p-2 w-36 h-36 relative overflow-hidden">
        <p className="text-[9px] text-cyan-400 font-bold uppercase mb-1 text-center">Map</p>
        <div
          className="relative w-full h-[calc(100%-16px)] rounded-lg border border-white/10"
          style={{
            background: 'radial-gradient(circle, #1e3a5f 0%, #0a0e1a 100%)',
          }}
        >
          {ZONE_LIST.map((zone) => {
            const pos = toMap(zone.position[0], zone.position[2])
            const visited = visitedZones.includes(zone.id)
            const active = currentZone === zone.id
            return (
              <div
                key={zone.id}
                className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all"
                style={{
                  left: pos.left,
                  top: pos.top,
                  backgroundColor: visited ? zone.color : '#4b5563',
                  boxShadow: active ? `0 0 8px ${zone.color}` : 'none',
                  transform: `translate(-50%, -50%) scale(${active ? 1.5 : 1})`,
                }}
                title={zone.label}
              />
            )
          })}
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 -translate-x-1/2 -translate-y-1/2 z-10 border border-white shadow-lg shadow-cyan-400/50"
            style={{ left: player.left, top: player.top }}
          />
        </div>
      </div>
    </div>
  )
}
