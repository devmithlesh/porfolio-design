import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { WORLD_PATHS } from '@/utils/paths'

export function BridgePath() {
  return (
    <group>
      {WORLD_PATHS.map((seg, i) => (
        <RigidBody key={`path-${i}`} type="fixed" position={seg.position} colliders={false}>
          <CuboidCollider
            args={[
              seg.size[0] / 2 + 0.25,
              seg.size[1] / 2 + 0.12,
              seg.size[2] / 2 + 0.45,
            ]}
          />
          {/* Mario-style path — brown bricks + gold edge */}
          <mesh receiveShadow castShadow position={[0, -0.05, 0]}>
            <boxGeometry args={[seg.size[0], seg.size[1] * 0.7, seg.size[2]]} />
            <meshToonMaterial color="#b45309" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[seg.size[0] - 0.3, 0.12, seg.size[2] - 0.2]} />
            <meshToonMaterial color="#d97706" />
          </mesh>
          {/* Gold rail stripes */}
          <mesh position={[-seg.size[0] / 2 + 0.15, 0.35, 0]}>
            <boxGeometry args={[0.12, 0.1, seg.size[2]]} />
            <meshToonMaterial color="#a16207" />
          </mesh>
          <mesh position={[seg.size[0] / 2 - 0.15, 0.35, 0]}>
            <boxGeometry args={[0.12, 0.1, seg.size[2]]} />
            <meshToonMaterial color="#a16207" />
          </mesh>
        </RigidBody>
      ))}
    </group>
  )
}
