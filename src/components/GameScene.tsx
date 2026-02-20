import { Stars, PerspectiveCamera, Environment } from '@react-three/drei';
import { Lights } from './Lights';

export const GameScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={75} near={0.1} far={1000} />
      <Lights />

      <Stars radius={300} depth={50} count={1000} factor={4} saturation={0} fade={false} speed={0.5} />

      <Environment preset="night" />
      {/* Increased fog distance for better visibility */}
      <fog attach="fog" args={['#000000', 80, 400]} />
    </>
  );
};
