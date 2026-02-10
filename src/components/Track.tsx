import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Track = () => {
  const groupRef = useRef<THREE.Group>(null);
  const trackLength = 200;

  useFrame((state) => {
    if (groupRef.current) {
      const playerZ = state.camera.position.z - 10;

      groupRef.current.children.forEach((child: any) => {
        if (child.position.z > playerZ + 50) {
          child.position.z -= trackLength * 2;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <TrackSegment position={[0, -0.5, 0]} />
      <TrackSegment position={[0, -0.5, -trackLength]} />
    </group>
  );
};

const TrackSegment = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 200]} />
        <meshStandardMaterial
          color="#050505"
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Lane Dividers */}
      <mesh position={[-5, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[5, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Grid for neon feel */}
      <gridHelper args={[20, 40, '#ff00ff', '#111']} rotation={[0, 0, 0]} position={[0, 0.01, 0]} />

      {/* Side Rails */}
      <mesh position={[-10, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, 200]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[10, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, 200]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};
