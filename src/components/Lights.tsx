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
      <ambientLight intensity={0.8} />
    </group>
  );
};
