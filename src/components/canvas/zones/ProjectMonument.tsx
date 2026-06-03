import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { BillboardText } from '@/components/canvas/BillboardText'
import * as THREE from 'three'
import type { Project } from '@/data/projects'
import { useGameStore } from '@/store/gameStore'

interface ProjectMonumentProps {
  project: Project
}

export function ProjectMonument({ project }: ProjectMonumentProps) {
  const group = useRef<THREE.Group>(null)
  const triggered = useRef(false)
  const setActiveProject = useGameStore((s) => s.setActiveProject)
  const setCameraZoomTarget = useGameStore((s) => s.setCameraZoomTarget)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.3
      group.current.position.y =
        project.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const handleInteract = () => {
    if (triggered.current) return
    triggered.current = true
    setCameraZoomTarget(4)
    setActiveProject(project)
    setTimeout(() => {
      triggered.current = false
    }, 2000)
  }

  return (
    <group ref={group} position={project.position}>
      <RigidBody type="fixed" sensor colliders={false}>
        <CuboidCollider
          args={[1.2, 2, 1.2]}
          sensor
          onIntersectionEnter={handleInteract}
        />
      </RigidBody>

      {/* Pedestal */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.2, 1, 6]} />
        <meshToonMaterial color="#44403c" />
      </mesh>

      {/* Crystal monument */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshToonMaterial color={project.color} emissive={project.color} emissiveIntensity={0.3} />
      </mesh>

      {/* Glow ring */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.5, 32]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.5} />
      </mesh>

      <BillboardText
        position={[0, 3.2, 0]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        maxWidth={3}
        textAlign="center"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        {project.title}
      </BillboardText>
    </group>
  )
}
