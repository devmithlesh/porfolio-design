import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import type { RapierRigidBody } from '@react-three/rapier'
import { applySpawnToBody } from '@/utils/player'
import { SPAWN_POSITION } from '@/utils/constants'

/** Listens for respawn requests (hazard hit, fall, etc.) */
export function usePlayerRespawn(bodyRef: React.RefObject<RapierRigidBody | null>) {
  const respawnTick = useGameStore((s) => s.respawnTick)
  const respawnPosition = useGameStore((s) => s.respawnPosition)
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition)
  const lastTick = useRef(0)

  useEffect(() => {
    if (!respawnTick || respawnTick === lastTick.current) return
    lastTick.current = respawnTick

    const pos = respawnPosition ?? SPAWN_POSITION
    const body = bodyRef.current
    if (body) applySpawnToBody(body, pos)
    setPlayerPosition([...pos])
    useGameStore.setState({ respawnPosition: null })
  }, [respawnTick, respawnPosition, bodyRef, setPlayerPosition])
}
