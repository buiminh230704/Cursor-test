import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export const Player = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { status, incrementScore } = useGameStore();
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.key]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.key]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (status !== 'PLAYING') return;
    if (!meshRef.current) return;

    const speed = 15;
    const moveSpeed = 20;

    // Move forward (camera and player stay at same relative position,
    // or we move the world, but here we'll move the player)
    meshRef.current.position.z -= speed * delta;
    state.camera.position.z = meshRef.current.position.z + 10;
    state.camera.position.x = meshRef.current.position.x * 0.5;

    // Side movement
    if (keys['ArrowLeft'] || keys['a']) meshRef.current.position.x -= moveSpeed * delta;
    if (keys['ArrowRight'] || keys['d']) meshRef.current.position.x += moveSpeed * delta;

    // Boundary
    meshRef.current.position.x = Math.max(-9, Math.min(9, meshRef.current.position.x));

    // Update score based on distance moved
    incrementScore(speed * delta * 10);
  });

  return (
    <group ref={meshRef}>
      {/* Ship Body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="#333" metalness={1} roughness={0.2} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.3, 0.2]}>
        <boxGeometry args={[0.6, 0.4, 0.8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} transparent opacity={0.7} />
      </mesh>
      {/* Wings */}
      <mesh position={[0.8, -0.1, 0]}>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[-0.8, -0.1, 0]}>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      {/* Engine Glow */}
      <mesh position={[0, 0, 1.1]}>
        <boxGeometry args={[0.8, 0.3, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={5} />
      </mesh>
    </group>
  );
};
