import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export const Explosion = () => {
  const { collisionPos } = useGameStore();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (collisionPos && meshRef.current) {
      meshRef.current.scale.addScalar(delta * 15);
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.1);
    }
  });

  if (!collisionPos) return null;

  return (
    <group position={collisionPos}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff0000"
          emissiveIntensity={20}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
};
