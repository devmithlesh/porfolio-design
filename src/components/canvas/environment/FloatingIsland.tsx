import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { LowPolyTree, LowPolyRock, GrassPatch } from './LowPolyTree'
import { BillboardText } from '@/components/canvas/BillboardText'

interface FloatingIslandProps {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  label?: string
  decoration?: 'trees' | 'rocks' | 'crystals' | 'terminal'
}

export function FloatingIsland({
  position,
  size,
  color,
  label,
  decoration = 'trees',
}: FloatingIslandProps) {
  const [w, h, d] = size
  const topY = h / 2

  const trees = decoration === 'trees'
  const rocks = decoration === 'rocks'

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[w / 2, h / 2, d / 2]} position={[0, 0, 0]} />
        {/* Island top */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[w / 2, w / 2 + 1, h, 8]} />
          <meshToonMaterial color={color} />
        </mesh>
        {/* Underside rock */}
        <mesh position={[0, -h - 1, 0]} castShadow>
          <coneGeometry args={[w / 3, 3, 6]} />
          <meshToonMaterial color="#57534e" />
        </mesh>
      </RigidBody>

      {trees &&
        Array.from({ length: 5 }).map((_, i) => (
          <LowPolyTree
            key={i}
            position={[
              (Math.random() - 0.5) * (w - 2),
              topY + 0.5,
              (Math.random() - 0.5) * (d - 2),
            ]}
            scale={0.8 + Math.random() * 0.5}
          />
        ))}

      {rocks &&
        Array.from({ length: 4 }).map((_, i) => (
          <LowPolyRock
            key={i}
            position={[
              (Math.random() - 0.5) * w * 0.6,
              topY + 0.3,
              (Math.random() - 0.5) * d * 0.6,
            ]}
            scale={0.5 + Math.random() * 0.8}
          />
        ))}

      <GrassPatch position={[0, topY, 0]} />

      {label && (
        <BillboardText
          position={[0, topY + 4, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000"
        >
          {label}
        </BillboardText>
      )}
    </group>
  )
}
