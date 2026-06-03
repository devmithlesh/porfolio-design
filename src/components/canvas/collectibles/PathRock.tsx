import { memo } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import type { PathRock as PathRockData } from '@/utils/pathLayout'

interface PathRockProps {
  rock: PathRockData
}

function PathRockInner({ rock }: PathRockProps) {
  const s = rock.scale

  return (
    <RigidBody type="fixed" colliders={false} position={rock.position}>
      <CuboidCollider args={[0.62 * s, 0.52 * s, 0.62 * s]} />
      <mesh castShadow receiveShadow scale={s}>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshToonMaterial color="#78716c" />
      </mesh>
      <mesh position={[0, 0.3 * s, 0]} scale={s * 0.7} castShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshToonMaterial color="#57534e" />
      </mesh>
    </RigidBody>
  )
}

export const PathRock = memo(PathRockInner)
