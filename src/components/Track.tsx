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
          roughness={0.05}
          metalness={0.9}
        />
      </mesh>

      {/* Lane Dividers - Subtle Glow */}
      <mesh position={[-5, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 200]} />
        <meshStandardMaterial color="#111" emissive="#0044ff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 200]} />
        <meshStandardMaterial color="#111" emissive="#0044ff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[5, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 200]} />
        <meshStandardMaterial color="#111" emissive="#0044ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Grid for neon feel - Changed from magenta to deep blue */}
      <gridHelper args={[20, 40, '#0066ff', '#050505']} rotation={[0, 0, 0]} position={[0, 0.01, 0]} />

      {/* Side Rails - High Emissive Cyan */}
      <mesh position={[-10.1, 0.5, 0]}>
        <boxGeometry args={[0.2, 1.5, 200]} />
        <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={4} />
      </mesh>
      <mesh position={[10.1, 0.5, 0]}>
        <boxGeometry args={[0.2, 1.5, 200]} />
        <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={4} />
      </mesh>
    </group>
  );
};
