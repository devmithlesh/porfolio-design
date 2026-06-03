import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { Ray } from '@dimforge/rapier3d-compat'
import * as THREE from 'three'
import { Character } from './Character'
import { keyboardRef } from '@/hooks/useKeyboard'
import { useGameStore } from '@/store/gameStore'
import {
  WALK_SPEED,
  RUN_SPEED,
  JUMP_FORCE,
  SWIM_SPEED,
  SWIM_RUN_SPEED,
  SWIM_UP_SPEED,
  SWIM_SURFACE_Y,
} from '@/utils/constants'
import { isInWater, shouldDrown } from '@/utils/water'
import { useIsMobile } from '@/hooks/useIsMobile'
import { usePlayerRespawn } from '@/hooks/usePlayerRespawn'
import { useStuckRecovery } from '@/hooks/useStuckRecovery'
import { PLAYER_USER_DATA } from '@/utils/player'

export type AnimState = 'idle' | 'walk' | 'run' | 'jump' | 'land' | 'swim'

export interface CharacterAnimState {
  state: AnimState
  speed: number
}

interface CharacterControllerProps {
  onPositionChange?: (pos: THREE.Vector3) => void
  cameraYaw: React.MutableRefObject<number>
  cameraPitch: React.MutableRefObject<number>
  onAnimChange?: (anim: CharacterAnimState) => void
  onJump?: () => void
  onLand?: () => void
}

export function CharacterController({
  onPositionChange,
  cameraYaw,
  cameraPitch,
  onAnimChange,
  onJump,
  onLand,
}: CharacterControllerProps) {
  const body = useRef<RapierRigidBody>(null)
  const isGrounded = useRef(true)
  const wasGrounded = useRef(true)
  const isSwimming = useRef(false)
  const wasSwimming = useRef(false)
  const landTimer = useRef(0)
  const jumpHeld = useRef(false)
  const animState = useRef<CharacterAnimState>({ state: 'idle', speed: 1 })
  const { world } = useRapier()
  const isMobile = useIsMobile()
  const mobileInput = useGameStore((s) => s.mobileInput)
  const phase = useGameStore((s) => s.phase)
  const isPaused = useGameStore((s) => s.isPaused)
  const activeModal = useGameStore((s) => s.activeModal)
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition)
  const requestRespawn = useGameStore((s) => s.requestRespawn)

  usePlayerRespawn(body)

  const enabled = phase === 'playing' && !isPaused && !activeModal
  useStuckRecovery(body, isGrounded, enabled, isSwimming)

  const impulse = useMemo(() => new THREE.Vector3(), [])
  const forward = useMemo(() => new THREE.Vector3(), [])
  const right = useMemo(() => new THREE.Vector3(), [])
  const swimVel = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (body.current) body.current.userData = PLAYER_USER_DATA
  }, [])

  useFrame((_, dt) => {
    if (!body.current || !enabled) return

    const rb = body.current
    const vel = rb.linvel()
    const pos = rb.translation()

    if (shouldDrown(pos.y)) {
      requestRespawn()
      return
    }

    const swimming = isInWater(pos.y)
    isSwimming.current = swimming
    rb.setGravityScale(swimming ? 0 : 1, true)

    if (swimming && !wasSwimming.current) {
      landTimer.current = 0
      animState.current = { state: 'swim', speed: 1 }
    }
    wasSwimming.current = swimming

    if (swimming) {
      let inputX = 0
      let inputZ = 0
      let running = false
      let swimUp = false

      if (isMobile) {
        inputX = mobileInput.x
        inputZ = mobileInput.y
        running = mobileInput.run
        swimUp = mobileInput.jump
      } else {
        if (keyboardRef.forward) inputZ += 1
        if (keyboardRef.backward) inputZ -= 1
        if (keyboardRef.left) inputX -= 1
        if (keyboardRef.right) inputX += 1
        running = keyboardRef.run
        swimUp = keyboardRef.jump
      }

      const inputLen = Math.sqrt(inputX * inputX + inputZ * inputZ)
      const moving = inputLen > 0.1
      if (moving) {
        inputX /= inputLen
        inputZ /= inputLen
      }

      const speed = running ? SWIM_RUN_SPEED : SWIM_SPEED
      const yaw = cameraYaw.current
      const pitch = cameraPitch.current
      const cp = Math.cos(pitch)
      const sp = Math.sin(pitch)

      forward.set(-Math.sin(yaw) * cp, sp, -Math.cos(yaw) * cp)
      right.set(Math.cos(yaw), 0, -Math.sin(yaw))

      swimVel.set(vel.x * 0.7, vel.y * 0.7, vel.z * 0.7)

      if (moving) {
        swimVel.addScaledVector(forward, inputZ * speed)
        swimVel.addScaledVector(right, inputX * speed)
        const faceAngle = Math.atan2(
          forward.x * inputZ + right.x * inputX,
          forward.z * inputZ + right.z * inputX
        )
        rb.setRotation(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, faceAngle, 0)),
          true
        )
      }

      if (swimUp) {
        swimVel.y = SWIM_UP_SPEED
        jumpHeld.current = true
        useGameStore.getState().setMobileInput({ jump: false })
      } else {
        jumpHeld.current = false
      }

      if (pos.y < SWIM_SURFACE_Y && !swimUp) {
        swimVel.y += 2.2 * dt * 60
      }

      if (!moving && !swimUp) {
        swimVel.x *= 0.88
        swimVel.z *= 0.88
        swimVel.y *= 0.92
      }

      rb.setLinvel(
        {
          x: swimVel.x,
          y: THREE.MathUtils.clamp(swimVel.y, -SWIM_UP_SPEED, SWIM_UP_SPEED),
          z: swimVel.z,
        },
        true
      )

      isGrounded.current = false
      animState.current = {
        state: 'swim',
        speed: moving || swimUp ? (running ? 1.4 : 1) : 0.7,
      }

      onAnimChange?.(animState.current)
      onPositionChange?.(new THREE.Vector3(pos.x, pos.y, pos.z))
      setPlayerPosition([pos.x, pos.y, pos.z])
      return
    }

    const ray = new Ray({ x: pos.x, y: pos.y + 0.1, z: pos.z }, { x: 0, y: -1, z: 0 })
    const hit = world.castRay(ray, 1.4, true, undefined, undefined, undefined, rb)
    isGrounded.current =
      hit !== null && hit.timeOfImpact < 1.35 && vel.y > -3 && vel.y < 3

    if (wasGrounded.current && !isGrounded.current) {
      animState.current = { state: 'jump', speed: 1 }
      onJump?.()
    }
    if (!wasGrounded.current && isGrounded.current) {
      landTimer.current = 0.3
      animState.current = { state: 'land', speed: 1 }
      onLand?.()
    }
    wasGrounded.current = isGrounded.current

    if (landTimer.current > 0) {
      landTimer.current -= dt
    }

    let inputX = 0
    let inputZ = 0
    let running = false
    let jump = false

    if (isMobile) {
      inputX = mobileInput.x
      inputZ = mobileInput.y
      running = mobileInput.run
      jump = mobileInput.jump
    } else {
      if (keyboardRef.forward) inputZ += 1
      if (keyboardRef.backward) inputZ -= 1
      if (keyboardRef.left) inputX -= 1
      if (keyboardRef.right) inputX += 1
      running = keyboardRef.run
      jump = keyboardRef.jump
    }

    const inputLen = Math.sqrt(inputX * inputX + inputZ * inputZ)
    const moving = inputLen > 0.1

    if (moving) {
      inputX /= inputLen
      inputZ /= inputLen
    }

    const speed = running ? RUN_SPEED : WALK_SPEED
    const yaw = cameraYaw.current

    forward.set(-Math.sin(yaw), 0, -Math.cos(yaw))
    right.set(Math.cos(yaw), 0, -Math.sin(yaw))

    impulse.set(vel.x, vel.y, vel.z)
    if (moving) {
      impulse.x = 0
      impulse.z = 0
      impulse.addScaledVector(forward, inputZ * speed)
      impulse.addScaledVector(right, inputX * speed)
      const faceAngle = Math.atan2(impulse.x, impulse.z)
      rb.setRotation(
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, faceAngle, 0)),
        true
      )
    } else {
      impulse.x *= 0.8
      impulse.z *= 0.8
    }

    if (jump && !jumpHeld.current && isGrounded.current && landTimer.current <= 0) {
      impulse.y = JUMP_FORCE
      jumpHeld.current = true
      useGameStore.getState().setMobileInput({ jump: false })
    }
    if (!jump) jumpHeld.current = false

    rb.setLinvel(impulse, true)

    if (landTimer.current > 0) {
      /* keep land */
    } else if (!isGrounded.current) {
      animState.current = { state: 'jump', speed: 1 }
    } else if (moving) {
      animState.current = {
        state: running ? 'run' : 'walk',
        speed: running ? 1.5 : 1,
      }
    } else {
      animState.current = { state: 'idle', speed: 1 }
    }

    onAnimChange?.(animState.current)
    onPositionChange?.(new THREE.Vector3(pos.x, pos.y, pos.z))
    setPlayerPosition([pos.x, pos.y, pos.z])
  })

  return (
    <RigidBody
      ref={body}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 3, 0]}
      enabledRotations={[false, true, false]}
      linearDamping={0.3}
      angularDamping={1}
      lockRotations
      ccd
    >
      <CapsuleCollider args={[0.5, 0.35]} position={[0, 0.5, 0]} />
      <Character animRef={animState} />
    </RigidBody>
  )
}
