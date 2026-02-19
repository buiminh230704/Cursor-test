import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const Effects = () => {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
      />
    </EffectComposer>
  );
};
