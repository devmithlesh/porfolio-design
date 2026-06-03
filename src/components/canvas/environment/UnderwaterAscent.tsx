import { BillboardText } from '@/components/canvas/BillboardText'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { HOME_ASCENT_STEPS, SIDE_ASCENT_STEPS } from '@/utils/underwaterAscent'
import { WATER_SURFACE_Y } from '@/utils/water'

function AscentRamp({
  steps,
  sign,
}: {
  steps: typeof HOME_ASCENT_STEPS
  sign: string
}) {
  return (
    <group>
      {steps.map((step) => (
        <RigidBody
          key={step.id}
          type="fixed"
          position={step.position}
          colliders={false}
        >
          <CuboidCollider
            args={[
              step.size[0] / 2 + 0.12,
              step.size[1] / 2 + 0.12,
              step.size[2] / 2 + 0.12,
            ]}
          />
          <mesh castShadow receiveShadow>
            <boxGeometry args={step.size} />
            <meshToonMaterial color={step.color} />
          </mesh>
          {/* Soil edge */}
          <mesh position={[0, -step.size[1] / 2 - 0.05, 0]}>
            <boxGeometry args={[step.size[0] * 0.95, 0.08, step.size[2] * 0.95]} />
            <meshToonMaterial color="#57534e" />
          </mesh>
        </RigidBody>
      ))}
      <BillboardText
        position={[steps[0].position[0], steps[0].position[1] + 1.2, steps[0].position[2]]}
        fontSize={0.35}
        color="#fef08a"
        anchorX="center"
        outlineWidth={0.04}
        outlineColor="#000"
      >
        {sign}
      </BillboardText>
      <pointLight
        position={[steps[2].position[0], steps[2].position[1] + 0.8, steps[2].position[2]]}
        color="#4ade80"
        intensity={0.5}
        distance={8}
      />
    </group>
  )
}

export function UnderwaterAscent() {
  return (
    <group>
      <AscentRamp steps={HOME_ASCENT_STEPS} sign="↑ HOME — Wapas upar" />
      <AscentRamp steps={SIDE_ASCENT_STEPS} sign="↑ About Path" />
      <BillboardText
        position={[0, WATER_SURFACE_Y - 0.3, 14]}
        fontSize={0.28}
        color="#a7f3d0"
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        🌊 Ramp follow karo · Space = upar swim
      </BillboardText>
    </group>
  )
}
