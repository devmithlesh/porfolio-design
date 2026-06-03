import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'
import { WATER_SURFACE_Y, SEABED_Y } from '@/utils/water'
import { UnderwaterTerrain } from './UnderwaterTerrain'
import { UnderwaterAscent } from './UnderwaterAscent'

const seaWaterVertex = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 0.06 + uTime * 0.9) * 0.22
      + cos(pos.y * 0.05 + uTime * 0.7) * 0.18;
    pos.z += wave;
    vWave = wave;
    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorldPos = world.xyz;
    vNormal = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const seaWaterFragment = /* glsl */ `
  uniform float uTime;
  uniform float uNight;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vWave;

  float caustics(vec2 p) {
    float c = 0.0;
    vec2 q = p * 0.12 + uTime * 0.08;
    c += sin(q.x * 5.2 + q.y * 3.1) * 0.35;
    c += sin(q.x * 3.7 - q.y * 4.4 + 1.2) * 0.3;
    c += cos(q.x * 6.1 + q.y * 5.8 - uTime * 0.5) * 0.25;
    return c * 0.5 + 0.5;
  }

  void main() {
    float c = caustics(vWorldPos.xz);
    vec3 shallow = mix(vec3(0.18, 0.72, 0.78), vec3(0.05, 0.45, 0.55), uNight);
    vec3 deep = mix(vec3(0.0, 0.42, 0.58), vec3(0.01, 0.12, 0.22), uNight);
    vec3 water = mix(deep, shallow, c * 0.55 + 0.35 + vWave * 0.15);

    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 1.0, 0.0))), 2.5);
    water += vec3(0.35, 0.55, 0.45) * fresnel * (1.0 - uNight * 0.6);

    float sunGlare = pow(max(0.0, dot(normalize(vNormal), normalize(vec3(0.3, 1.0, 0.2)))), 8.0);
    water += vec3(0.5, 0.65, 0.5) * sunGlare * 0.35;

    float alpha = mix(0.78, 0.88, uNight);
    gl_FragColor = vec4(water, alpha);
  }
`

const seabedVertex = /* glsl */ `
  varying vec2 vWorldXZ;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorldXZ = w.xz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const seabedFragment = /* glsl */ `
  uniform float uTime;
  uniform float uNight;
  varying vec2 vWorldXZ;

  float caustics(vec2 p) {
    vec2 q = p * 0.14 + uTime * 0.1;
    return sin(q.x * 4.8) * sin(q.y * 4.2) * 0.5 + 0.5;
  }

  void main() {
    float c = caustics(vWorldXZ);
    vec3 sand = mix(vec3(0.78, 0.7, 0.55), vec3(0.35, 0.32, 0.28), uNight);
    vec3 light = vec3(0.25, 0.45, 0.4) * c * (1.0 - uNight * 0.7);
    gl_FragColor = vec4(sand + light * 0.35, 1.0);
  }
`

interface FishData {
  id: number
  home: THREE.Vector3
  speed: number
  radius: number
  scale: number
  color: string
  tailColor: string
}

function Fish({ fish }: { fish: FishData }) {
  const ref = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const angle = useRef(Math.random() * Math.PI * 2)

  useFrame((state, dt) => {
    if (!ref.current) return
    angle.current += fish.speed * dt
    const t = state.clock.elapsedTime
    ref.current.position.set(
      fish.home.x + Math.cos(angle.current) * fish.radius,
      fish.home.y + Math.sin(t + fish.id) * 0.2,
      fish.home.z + Math.sin(angle.current) * fish.radius
    )
    ref.current.rotation.y = -angle.current + Math.PI / 2
    if (tail.current) tail.current.rotation.y = Math.sin(t * 5) * 0.3
  })

  const s = fish.scale
  return (
    <group ref={ref} scale={s}>
      <mesh castShadow>
        <capsuleGeometry args={[0.15, 0.5, 6, 10]} />
        <meshStandardMaterial color={fish.color} roughness={0.35} />
      </mesh>
      <group ref={tail} position={[-0.38, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.18, 0.32, 4]} />
          <meshStandardMaterial color={fish.tailColor} />
        </mesh>
      </group>
      <mesh position={[0.32, 0.05, 0.08]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  )
}

export function Ocean() {
  const isNight = useGameStore((s) => s.isNight)

  const waterGeo = useMemo(() => new THREE.PlaneGeometry(320, 320, 80, 80), [])
  const seabedGeo = useMemo(() => new THREE.PlaneGeometry(320, 320, 1, 1), [])

  const waterMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uNight: { value: 0 },
        },
        vertexShader: seaWaterVertex,
        fragmentShader: seaWaterFragment,
      }),
    []
  )

  const seabedMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uNight: { value: 0 },
        },
        vertexShader: seabedVertex,
        fragmentShader: seabedFragment,
      }),
    []
  )

  const fishes = useMemo<FishData[]>(() => {
    const palette = [
      { body: '#f97316', tail: '#ea580c' },
      { body: '#38bdf8', tail: '#0284c7' },
      { body: '#facc15', tail: '#ca8a04' },
      { body: '#34d399', tail: '#059669' },
    ]
    const list: FishData[] = []
    for (let i = 0; i < 10; i++) {
      const p = palette[i % palette.length]
      list.push({
        id: i,
        home: new THREE.Vector3(
          (Math.random() - 0.5) * 90,
          WATER_SURFACE_Y - 0.5 - Math.random() * 0.8,
          (Math.random() - 0.5) * 90
        ),
        speed: 0.42 + Math.random() * 0.28,
        radius: 5 + Math.random() * 8,
        scale: 1.4 + Math.random() * 0.5,
        color: p.body,
        tailColor: p.tail,
      })
    }
    return list
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const night = isNight ? 1 : 0
    waterMat.uniforms.uTime.value = t
    waterMat.uniforms.uNight.value = night
    seabedMat.uniforms.uTime.value = t
    seabedMat.uniforms.uNight.value = night
  })

  return (
    <group>
      <UnderwaterTerrain />
      <UnderwaterAscent />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, SEABED_Y, 0]}
        geometry={seabedGeo}
        receiveShadow
      >
        <primitive object={seabedMat} attach="material" />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, WATER_SURFACE_Y, 0]}
        geometry={waterGeo}
        receiveShadow
      >
        <primitive object={waterMat} attach="material" />
      </mesh>

      <mesh position={[0, WATER_SURFACE_Y - 2.5, 0]}>
        <boxGeometry args={[300, 5, 300]} />
        <meshBasicMaterial
          color={isNight ? '#042f3a' : '#0e7490'}
          transparent
          opacity={isNight ? 0.35 : 0.12}
          depthWrite={false}
        />
      </mesh>

      {fishes.map((f) => (
        <Fish key={f.id} fish={f} />
      ))}

      {!isNight && (
        <pointLight
          position={[20, WATER_SURFACE_Y + 3, 15]}
          color="#7dd3fc"
          intensity={0.6}
          distance={45}
        />
      )}
    </group>
  )
}
