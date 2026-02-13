import { Stars, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';

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

      <Stars radius={150} depth={50} count={7000} factor={4} saturation={1} fade speed={2} />

      {/* Retro Sun in the far distance */}
      <mesh position={[0, -20, -500]} rotation={[0, 0, 0]}>
        <circleGeometry args={[100, 64]} />
        <MeshDistortMaterial
          color="#ff3300"
          emissive="#ff0066"
          emissiveIntensity={10}
          distort={0.2}
          speed={1}
        />
      </mesh>

      <Environment preset="night" />
      <fog attach="fog" args={['#000000', 50, 200]} />
    </>
  );
};
