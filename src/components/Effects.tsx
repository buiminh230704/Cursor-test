import { useMemo } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export const Effects = () => {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.001, 0.001), []);

  return (
    <EffectComposer>
      <Bloom
        intensity={1.0}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={aberrationOffset}
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      <Noise opacity={0.02} />
    </EffectComposer>
  );
};
