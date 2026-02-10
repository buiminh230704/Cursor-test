import { Stars, PerspectiveCamera, Environment } from '@react-three/drei';

export const GameScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={75} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff00ff" />
      <pointLight position={[-10, 10, 10]} intensity={1.5} color="#00ffff" />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
      />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="city" />
      <fog attach="fog" args={['#000000', 10, 50]} />
    </>
  );
};
