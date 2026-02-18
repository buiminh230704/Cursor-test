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

      <Stars radius={200} depth={100} count={10000} factor={6} saturation={1} fade speed={3} />

      {/* Retro Sun in the far distance - Moved further and lowered intensity to prevent blinding */}
      <mesh position={[0, -80, -800]} rotation={[0, 0, 0]}>
        <circleGeometry args={[250, 64]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff00aa"
          emissiveIntensity={8}
        />
      </mesh>

      {/* Distant light beams - More of them and varied */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[(i - 4) * 150, 0, -1200]} rotation={[0, 0, (Math.random() - 0.5) * 0.2]}>
          <boxGeometry args={[2, 3000, 2]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#00ffff" : "#ff00ff"} transparent opacity={0.03} />
        </mesh>
      ))}

      <Environment preset="night" />
      {/* Increased fog distance for better visibility */}
      <fog attach="fog" args={['#000000', 80, 400]} />
    </>
  );
};
