import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const Effects = () => {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
      />
    </EffectComposer>
  );
};
