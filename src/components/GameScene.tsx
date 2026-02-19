import { Stars, PerspectiveCamera, Environment } from '@react-three/drei';

export const GameScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={75} />
      <ambientLight intensity={0.4} />
      {/* Changed color from magenta to deep blue/purple */}
      <pointLight position={[10, 10, 10]} intensity={2} color="#0066ff" />
      <pointLight position={[-10, 10, 10]} intensity={2} color="#00ffff" />
      <spotLight
        position={[0, 25, 0]}
        angle={0.4}
        penumbra={1}
        intensity={3}
        castShadow
        color="#ffffff"
      />

      <Stars radius={200} depth={100} count={3000} factor={4} saturation={1} fade speed={2} />

      <Environment preset="night" />
      {/* Increased fog distance for better visibility */}
      <fog attach="fog" args={['#000000', 80, 400]} />
    </>
  );
};
