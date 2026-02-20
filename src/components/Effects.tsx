import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const Effects = () => {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.2}
        luminanceThreshold={1.0}
        luminanceSmoothing={0.02}
        mipmapBlur
      />
    </EffectComposer>
  );
};
