import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

const LANE_POSITIONS = [-7.5, -2.5, 2.5, 7.5];

export const Player = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { status, incrementScore, lane, setLane, isJumping, setJumping } = useGameStore();

  // Ref to track last key press to avoid multiple lane switches per press
  const lastKeyPress = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING') return;

      if ((e.key === 'ArrowLeft' || e.key === 'a') && lastKeyPress.current !== e.key) {
        setLane(lane - 1);
        lastKeyPress.current = e.key;
      } else if ((e.key === 'ArrowRight' || e.key === 'd') && lastKeyPress.current !== e.key) {
        setLane(lane + 1);
        lastKeyPress.current = e.key;
      } else if (e.key === 'Enter' && !isJumping) {
        setJumping(true);
        setTimeout(() => setJumping(false), 1000); // Jump duration
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === lastKeyPress.current) {
        lastKeyPress.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [status, lane, setLane, isJumping, setJumping]);

  useFrame((state, delta) => {
    if (status !== 'PLAYING') return;
    if (!meshRef.current) return;

    const speed = 15;

    // Constant forward movement
    meshRef.current.position.z -= speed * delta;

    // Smooth lane transition
    const targetX = LANE_POSITIONS[lane];
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);

    // Jump animation
    const targetY = isJumping ? 3 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);

    // Camera follow
    state.camera.position.z = meshRef.current.position.z + 10;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, meshRef.current.position.x * 0.8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 5 + meshRef.current.position.y * 0.5, 0.05);
    state.camera.lookAt(meshRef.current.position.x, 0, meshRef.current.position.z - 5);

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
