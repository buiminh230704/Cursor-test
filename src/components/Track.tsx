import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Track = () => {
  const groupRef = useRef<THREE.Group>(null);
  const trackLength = 200;

  useFrame((state) => {
    if (groupRef.current) {
      const playerZ = state.camera.position.z - 12;

      groupRef.current.children.forEach((child: any) => {
        // More generous threshold for resetting track pieces
        if (child.position.z > playerZ + 150) {
          child.position.z -= trackLength * 3;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <TrackSegment position={[0, -0.5, 0]} />
      <TrackSegment position={[0, -0.5, -trackLength]} />
      <TrackSegment position={[0, -0.5, -trackLength * 2]} />
    </group>
  );
};

const TrackSegment = ({ position }: { position: [number, number, number] }) => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.3 + 0.7;
      materialRef.current.emissiveIntensity = pulse * 2;
    }
  });

  return (
    <group position={position}>
      {/* Floor - Slightly wider to ensure no edge gaps visible */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 201]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.01}
          metalness={1}
        />
      </mesh>

      {/* Lane Dividers */}
      <mesh position={[-5.5, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200]} />
        <meshStandardMaterial ref={materialRef} color="#000" emissive="#0066ff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200]} />
        <meshStandardMaterial color="#000" emissive="#0066ff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[5.5, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200]} />
        <meshStandardMaterial color="#000" emissive="#0066ff" emissiveIntensity={1} />
      </mesh>

      <gridHelper args={[24, 40, '#00ffff', '#050505']} rotation={[0, 0, 0]} position={[0, 0.02, 0]} />

      {/* Side Rails */}
      <mesh position={[-11.5, 0.8, 0]}>
        <boxGeometry args={[0.4, 2, 200.5]} />
        <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={6} />
      </mesh>
      <mesh position={[11.5, 0.8, 0]}>
        <boxGeometry args={[0.4, 2, 200.5]} />
        <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={6} />
      </mesh>
    </group>
  );
};
