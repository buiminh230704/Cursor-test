import { PerspectiveCamera } from '@react-three/drei';
import { Lights } from './Lights';

export const GameScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={75} near={0.1} far={1000} />
      <Lights />

      {/* Increased fog distance for better visibility */}
      <fog attach="fog" args={['#000000', 80, 400]} />
    </>
  );
};
