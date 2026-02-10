import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

const OBSTACLE_COUNT = 30;
const TRACK_LENGTH = 1000;
const LANE_POSITIONS = [-7.5, -2.5, 2.5, 7.5];

export const Obstacles = () => {
  const { status, endGame } = useGameStore();
  const obstaclesRef = useRef<THREE.Group>(null);

  const obstacleData = useMemo(() => {
    return Array.from({ length: OBSTACLE_COUNT }).map((_, i) => {
      const type = Math.random() > 0.4 ? 'MONOLITH' : 'SPIKES';
      const laneIndex = Math.floor(Math.random() * 4);
      return {
        position: [
          LANE_POSITIONS[laneIndex],
          type === 'MONOLITH' ? 1.5 : 0,
          -i * (TRACK_LENGTH / OBSTACLE_COUNT) - 50,
        ] as [number, number, number],
        type,
        color: type === 'MONOLITH' ? '#ff00ff' : '#00ffff',
      };
    });
  }, []);

  useFrame((state) => {
    if (status !== 'PLAYING') return;
    if (!obstaclesRef.current) return;

    const playerPos = state.camera.position;
    const pZ = playerPos.z - 10;

    const storeState = useGameStore.getState();
    const playerActualX = LANE_POSITIONS[storeState.lane];
    const playerActualY = storeState.isJumping ? 3 : 0;

    obstaclesRef.current.children.forEach((mesh: any, i) => {
      const obsData = obstacleData[i];

      // Collision detection
      const dx = Math.abs(mesh.position.x - playerActualX);
      const dz = Math.abs(mesh.position.z - pZ);

      const collisionX = dx < 1.5;
      const collisionZ = dz < 1.0;
      let collisionY = false;

      if (obsData.type === 'MONOLITH') {
        collisionY = playerActualY < 3.5; // Monolith is high
      } else {
        collisionY = playerActualY < 1.0; // Spikes are low, can jump over
      }

      if (collisionX && collisionZ && collisionY) {
        endGame();
      }

      // Reset obstacle if it's behind player
      if (mesh.position.z > playerPos.z + 20) {
        mesh.position.z -= TRACK_LENGTH;
        const newLane = Math.floor(Math.random() * 4);
        mesh.position.x = LANE_POSITIONS[newLane];
      }
    });
  });

  return (
    <group ref={obstaclesRef}>
      {obstacleData.map((data, i) => (
        <mesh key={i} position={data.position}>
          {data.type === 'MONOLITH' ? (
            <boxGeometry args={[2, 4, 1]} />
          ) : (
            <coneGeometry args={[1, 1, 4]} />
          )}
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
