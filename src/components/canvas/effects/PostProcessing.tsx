import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.18}
        luminanceThreshold={0.92}
        luminanceSmoothing={0.3}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette eskil={false} offset={0.2} darkness={0.5} />
    </EffectComposer>
  )
}
