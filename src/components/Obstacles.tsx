import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

const OBSTACLE_COUNT = 20;
const TRACK_LENGTH = 1000;

export const Obstacles = () => {
  const { status, endGame } = useGameStore();
  const obstaclesRef = useRef<THREE.Group>(null);

  const obstacleData = useMemo(() => {
    return Array.from({ length: OBSTACLE_COUNT }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 18,
        0,
        -i * (TRACK_LENGTH / OBSTACLE_COUNT) - 50,
      ] as [number, number, number],
      scale: (Math.random() * 2 + 1) as number,
      color: Math.random() > 0.5 ? '#ff00ff' : '#00ffff',
    }));
  }, []);

  useFrame((state) => {
    if (status !== 'PLAYING') return;
    if (!obstaclesRef.current) return;

    const playerPos = state.camera.position; // Camera follows player closely
    // Actually better to use player ref, but we'll approximate with camera or a shared state.
    // Let's assume player is at camera.z - 10
    const pZ = playerPos.z - 10;
    const pX = playerPos.x * 2; // Rough adjustment

    obstaclesRef.current.children.forEach((mesh: any) => {
      // Collision detection
      const distance = mesh.position.distanceTo(new THREE.Vector3(pX, 0, pZ));
      if (distance < 2) {
        endGame();
      }

      // Reset obstacle if it's behind player
      if (mesh.position.z > playerPos.z + 20) {
        mesh.position.z -= TRACK_LENGTH;
        mesh.position.x = (Math.random() - 0.5) * 18;
      }
    });
  });

  return (
    <group ref={obstaclesRef}>
      {obstacleData.map((data, i) => (
        <mesh key={i} position={data.position}>
          <boxGeometry args={[data.scale, data.scale, data.scale]} />
          <meshStandardMaterial
            color="#000"
            emissive={data.color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
};
