import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export const Track = () => {
  const groupRef = useRef<THREE.Group>(null);
  const status = useGameStore((state) => state.status);
  const trackLength = 200;

  useEffect(() => {
    if (status === 'PLAYING' && groupRef.current) {
      groupRef.current.children[0].position.z = 0;
      groupRef.current.children[1].position.z = -trackLength;
      groupRef.current.children[2].position.z = -trackLength * 2;
    }
  }, [status]);

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
      materialRef.current.emissiveIntensity = pulse * 4; // Increased pulse intensity
    }
  });

  return (
    <group position={position}>
      {/* Decorative City Pillars - Left */}
      <mesh position={[-25, 40, 0]}>
        <boxGeometry args={[10, 100, 20]} />
        <meshStandardMaterial color="#050505" emissive="#002244" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-35, 20, -50]}>
        <boxGeometry args={[8, 60, 15]} />
        <meshStandardMaterial color="#050505" emissive="#220044" emissiveIntensity={0.5} />
      </mesh>

      {/* Decorative City Pillars - Right */}
      <mesh position={[25, 40, -80]}>
        <boxGeometry args={[10, 100, 30]} />
        <meshStandardMaterial color="#050505" emissive="#002244" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[40, 30, 20]}>
        <boxGeometry args={[12, 80, 25]} />
        <meshStandardMaterial color="#050505" emissive="#440022" emissiveIntensity={0.5} />
      </mesh>

      {/* Floor - Overlap of 0.2 to ensure no edge gaps */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 200.2]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.01}
          metalness={1}
        />
      </mesh>

      {/* Lane Dividers */}
      <mesh position={[-5.5, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200.2]} />
        <meshStandardMaterial ref={materialRef} color="#000" emissive="#0066ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200.2]} />
        <meshStandardMaterial color="#000" emissive="#0066ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[5.5, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 200.2]} />
        <meshStandardMaterial color="#000" emissive="#0066ff" emissiveIntensity={2} />
      </mesh>

      {/* Correctly scaled grid to cover full segment */}
      <gridHelper
        args={[200, 50, '#00ffff', '#050505']}
        rotation={[0, 0, 0]}
        position={[0, 0.02, 0]}
        scale={[0.12, 1, 1]}
      />

      {/* Additional Glow Floor for depth */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 200.2]} />
        <meshStandardMaterial color="#000" emissive="#001133" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>

      {/* Side Rails */}
      <mesh position={[-11.5, 0.8, 0]}>
        <boxGeometry args={[0.4, 2, 200.2]} />
        <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={10} />
      </mesh>
      <mesh position={[11.5, 0.8, 0]}>
        <boxGeometry args={[0.4, 2, 200.2]} />
        <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={10} />
      </mesh>
    </group>
  );
};
