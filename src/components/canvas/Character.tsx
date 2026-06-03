import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { CharacterAnimState } from './CharacterController'

interface CharacterProps {
  animRef: React.MutableRefObject<CharacterAnimState>
}

/** Chibi-style cute face — pure 3D, no photo texture */
function CuteFace({
  headRef,
  leftEyeRef,
  rightEyeRef,
}: {
  headRef: RefObject<THREE.Group>
  leftEyeRef: RefObject<THREE.Group>
  rightEyeRef: RefObject<THREE.Group>
}) {
  const skin = '#f0c4a8'
  const skinShadow = '#d9a88a'
  const blush = '#ff9bb5'
  const eyeWhite = '#fffef8'
  const pupil = '#1f1408'
  const hair = '#1c140c'
  const lip = '#e8879a'

  return (
    <group ref={headRef} position={[0, 1.22, 0]}>
      {/* Round chibi head */}
      <mesh castShadow scale={[1.05, 1.12, 1]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshToonMaterial color={skin} />
      </mesh>
      {/* Chin shadow */}
      <mesh position={[0, -0.12, 0.28]} scale={[0.55, 0.35, 0.4]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshToonMaterial color={skinShadow} transparent opacity={0.35} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.37, -0.02, 0]} scale={[0.45, 0.65, 0.45]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshToonMaterial color={skinShadow} />
      </mesh>
      <mesh position={[0.37, -0.02, 0]} scale={[0.45, 0.65, 0.45]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshToonMaterial color={skinShadow} />
      </mesh>

      {/* Cheek blush */}
      <mesh position={[-0.2, -0.02, 0.32]} scale={[1.2, 0.7, 0.4]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshBasicMaterial color={blush} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.2, -0.02, 0.32]} scale={[1.2, 0.7, 0.4]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshBasicMaterial color={blush} transparent opacity={0.55} />
      </mesh>

      {/* Left eye */}
      <group ref={leftEyeRef} position={[-0.13, 0.06, 0.33]} scale={[1, 1, 0.45]}>
        <mesh>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshToonMaterial color={eyeWhite} />
        </mesh>
        <mesh position={[0.01, -0.02, 0.06]}>
          <sphereGeometry args={[0.062, 12, 12]} />
          <meshToonMaterial color={pupil} />
        </mesh>
        <mesh position={[0.04, 0.03, 0.1]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.03, -0.02, 0.09]}>
          <sphereGeometry args={[0.014, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Right eye */}
      <group ref={rightEyeRef} position={[0.13, 0.06, 0.33]} scale={[1, 1, 0.45]}>
        <mesh>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshToonMaterial color={eyeWhite} />
        </mesh>
        <mesh position={[-0.01, -0.02, 0.06]}>
          <sphereGeometry args={[0.062, 12, 12]} />
          <meshToonMaterial color={pupil} />
        </mesh>
        <mesh position={[0.04, 0.03, 0.1]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.03, -0.02, 0.09]}>
          <sphereGeometry args={[0.014, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Cute eyebrows */}
      <mesh position={[-0.13, 0.2, 0.34]} rotation={[0, 0, 0.15]} scale={[1.3, 0.35, 0.3]}>
        <boxGeometry args={[0.1, 0.04, 0.04]} />
        <meshToonMaterial color={hair} />
      </mesh>
      <mesh position={[0.13, 0.2, 0.34]} rotation={[0, 0, -0.15]} scale={[1.3, 0.35, 0.3]}>
        <boxGeometry args={[0.1, 0.04, 0.04]} />
        <meshToonMaterial color={hair} />
      </mesh>

      {/* Tiny nose */}
      <mesh position={[0, -0.02, 0.36]} scale={[1, 0.7, 0.6]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshToonMaterial color={skinShadow} />
      </mesh>

      {/* Happy smile */}
      <mesh position={[0, -0.1, 0.34]} rotation={[0.15, 0, 0]} scale={[1.1, 0.55, 0.35]}>
        <torusGeometry args={[0.07, 0.018, 8, 16, Math.PI]} />
        <meshToonMaterial color={lip} />
      </mesh>
      <mesh position={[0, -0.08, 0.35]} scale={[0.12, 0.06, 0.05]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#fff5f7" transparent opacity={0.5} />
      </mesh>

      {/* Fluffy hair */}
      <group>
        <mesh position={[0, 0.32, -0.02]} scale={[1.2, 1, 1.15]} castShadow>
          <sphereGeometry args={[0.36, 14, 14]} />
          <meshToonMaterial color={hair} />
        </mesh>
        <mesh position={[0, 0.38, 0.12]} scale={[1, 0.45, 0.5]} rotation={[0.35, 0, 0]}>
          <sphereGeometry args={[0.28, 10, 10]} />
          <meshToonMaterial color={hair} />
        </mesh>
        <mesh position={[-0.3, 0.12, -0.06]} scale={[0.6, 0.85, 0.65]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshToonMaterial color={hair} />
        </mesh>
        <mesh position={[0.3, 0.12, -0.06]} scale={[0.6, 0.85, 0.65]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshToonMaterial color={hair} />
        </mesh>
        {/* Cute bangs */}
        <mesh position={[-0.12, 0.22, 0.2]} rotation={[0.4, 0.2, 0.1]} scale={[0.35, 0.5, 0.3]}>
          <boxGeometry args={[0.2, 0.12, 0.08]} />
          <meshToonMaterial color={hair} />
        </mesh>
        <mesh position={[0, 0.26, 0.22]} rotation={[0.45, 0, 0]} scale={[0.4, 0.55, 0.3]}>
          <boxGeometry args={[0.22, 0.12, 0.08]} />
          <meshToonMaterial color={hair} />
        </mesh>
        <mesh position={[0.12, 0.22, 0.2]} rotation={[0.4, -0.2, -0.1]} scale={[0.35, 0.5, 0.3]}>
          <boxGeometry args={[0.2, 0.12, 0.08]} />
          <meshToonMaterial color={hair} />
        </mesh>
      </group>
    </group>
  )
}

export function Character({ animRef }: CharacterProps) {
  const group = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Group>(null)
  const rightEyeRef = useRef<THREE.Group>(null)

  const skin = '#f0c4a8'
  const shirt = '#f8fafc'
  const blazer = '#4b5563'
  const pants = '#374151'
  const shoe = '#1e293b'

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const { state: anim, speed } = animRef.current

    let bob = 0
    let legSwing = 0
    let armSwing = 0
    let squash = 1

    const blinkCycle = (t * 1.1) % 3.2
    const eyeY = blinkCycle > 2.85 ? 0.12 : 1
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeY
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeY

    let headTilt = 0
    switch (anim) {
      case 'idle':
        bob = Math.sin(t * 1.5) * 0.06
        group.current.rotation.y = Math.sin(t * 0.4) * 0.04
        headTilt = Math.sin(t * 1.2) * 0.06
        break
      case 'walk':
        legSwing = Math.sin(t * 8) * 0.45
        armSwing = Math.sin(t * 8) * 0.25
        bob = Math.abs(Math.sin(t * 8)) * 0.04
        break
      case 'run':
        legSwing = Math.sin(t * 14) * 0.65
        armSwing = Math.sin(t * 14) * 0.45
        bob = Math.abs(Math.sin(t * 14)) * 0.06
        break
      case 'jump':
        squash = 1.08
        bob = 0.12
        headTilt = -0.08
        break
      case 'land':
        squash = 0.9
        bob = -0.04
        break
      case 'swim':
        legSwing = Math.sin(t * 6) * 0.2
        armSwing = Math.sin(t * 5) * 0.55
        bob = Math.sin(t * 3) * 0.03
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.55, 0.12)
        break
    }

    if (headRef.current) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        headTilt,
        0.15
      )
    }

    if (anim !== 'swim') {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.12)
    }

    group.current.position.y = bob
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, squash, 0.2)
    if (leftLeg.current) leftLeg.current.rotation.x = legSwing * speed
    if (rightLeg.current) rightLeg.current.rotation.x = -legSwing * speed
    if (leftArm.current) leftArm.current.rotation.x = anim === 'swim' ? armSwing : -armSwing
    if (rightArm.current) rightArm.current.rotation.x = anim === 'swim' ? -armSwing : armSwing
  })

  return (
    <group ref={group} position={[0, -0.95, 0]} scale={1.05}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.72, 0.85, 0.4]} />
        <meshToonMaterial color={blazer} />
      </mesh>
      <mesh position={[0, 0.62, 0.18]} castShadow>
        <boxGeometry args={[0.38, 0.55, 0.08]} />
        <meshToonMaterial color={shirt} />
      </mesh>
      <mesh position={[0, 0.88, 0.2]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.32, 0.12, 0.05]} />
        <meshToonMaterial color={shirt} />
      </mesh>

      <CuteFace headRef={headRef} leftEyeRef={leftEyeRef} rightEyeRef={rightEyeRef} />

      <group ref={leftArm} position={[-0.42, 0.7, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.11, 0.28, 4, 8]} />
          <meshToonMaterial color={blazer} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshToonMaterial color={skin} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.42, 0.7, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.11, 0.28, 4, 8]} />
          <meshToonMaterial color={blazer} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshToonMaterial color={skin} />
        </mesh>
      </group>

      <group ref={leftLeg} position={[-0.16, 0.08, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.11, 0.32, 4, 8]} />
          <meshToonMaterial color={pants} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.28]} />
          <meshToonMaterial color={shoe} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.16, 0.08, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.11, 0.32, 4, 8]} />
          <meshToonMaterial color={pants} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.28]} />
          <meshToonMaterial color={shoe} />
        </mesh>
      </group>
    </group>
  )
}
