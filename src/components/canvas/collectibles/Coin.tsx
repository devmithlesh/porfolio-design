import { memo, useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Vector3Tuple } from 'three'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'

const COIN_GEO = new THREE.CylinderGeometry(0.32, 0.32, 0.07, 16)
const COIN_INNER = new THREE.CylinderGeometry(0.25, 0.25, 0.02, 16)
const COLLECT_RADIUS = 1.25

interface CoinProps {
  id: string
  position: Vector3Tuple
  onCollect?: () => void
}

function CoinInner({ id, position, onCollect }: CoinProps) {
  const mesh = useRef<THREE.Group>(null)
  const baseY = position[1]
  const coinSession = useGameStore((s) => s.coinSession)
  const collectedIds = useGameStore((s) => s.collectedCoinIds)
  const [gone, setGone] = useState(false)
  const collectedRef = useRef(false)
  const collectCoin = useGameStore((s) => s.collectCoin)

  useEffect(() => {
    const already = collectedIds.includes(id)
    setGone(already)
    collectedRef.current = already
  }, [coinSession, collectedIds, id])

  const handleCollect = useCallback(() => {
    if (collectedRef.current || gone) return
    if (useGameStore.getState().collectedCoinIds.includes(id)) {
      collectedRef.current = true
      setGone(true)
      return
    }
    const ok = collectCoin(id)
    if (!ok) return
    collectedRef.current = true
    setGone(true)
    onCollect?.()
  }, [gone, collectCoin, id, onCollect])

  useFrame((state) => {
    if (gone || collectedRef.current || !mesh.current) return

    const t = state.clock.elapsedTime
    mesh.current.rotation.y = t * 2.5
    const worldY = baseY + Math.sin(t * 3) * 0.05
    mesh.current.position.y = worldY

    const [px, py, pz] = useGameStore.getState().playerPosition
    const dx = position[0] - px
    const dy = worldY + 0.25 - py
    const dz = position[2] - pz
    if (dx * dx + dy * dy + dz * dz < COLLECT_RADIUS * COLLECT_RADIUS) {
      handleCollect()
    }
  })

  if (gone) return null

  return (
    <group ref={mesh} position={[position[0], baseY, position[2]]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} geometry={COIN_GEO} castShadow>
        <meshToonMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.04]} geometry={COIN_INNER}>
        <meshToonMaterial color="#fde047" />
      </mesh>
    </group>
  )
}

export const Coin = memo(CoinInner)
