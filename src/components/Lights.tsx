import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Lights = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const player = state.scene.getObjectByName('player');
    if (player && groupRef.current) {
      groupRef.current.position.z = player.position.z;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[20, 20, 20]} intensity={1} color="#0066ff" />
      <pointLight position={[-20, 20, 20]} intensity={1} color="#00ffff" />

      <directionalLight
        position={[0, 40, 20]}
        intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30, 0.1, 100]} />
      </directionalLight>
    </group>
  );
};
