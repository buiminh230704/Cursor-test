import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

const OBSTACLE_COUNT = 30;
const TRACK_LENGTH = 1200;
const LANE_POSITIONS = [-7.5, -2.5, 2.5, 7.5];

export const Obstacles = () => {
  const { status, endGame, incrementScore } = useGameStore();
  const obstaclesRef = useRef<THREE.Group>(null);

  const obstacleData = useMemo(() => {
    return Array.from({ length: OBSTACLE_COUNT }).map((_, i) => {
      const type = Math.random() > 0.4 ? 'MONOLITH' : 'SPIKES';
      const laneIndex = Math.floor(Math.random() * 4);
      return {
        position: [
          LANE_POSITIONS[laneIndex],
          type === 'MONOLITH' ? 2 : 0,
          -i * (TRACK_LENGTH / OBSTACLE_COUNT) - 150,
        ] as [number, number, number],
        type,
        color: type === 'MONOLITH' ? '#ff6600' : '#ff0000',
      };
    });
  }, []);

  useFrame((state) => {
    if (status !== 'PLAYING') return;
    if (!obstaclesRef.current) return;

    const playerPos = state.camera.position;
    const pZ = playerPos.z - 12;

    const storeState = useGameStore.getState();
    const playerActualX = LANE_POSITIONS[storeState.lane];
    const playerActualY = storeState.isJumping ? 3.5 : 0;

    obstaclesRef.current.children.forEach((mesh: any, i) => {
      const obsData = obstacleData[i];

      const dx = Math.abs(mesh.position.x - playerActualX);
      const dz = Math.abs(mesh.position.z - pZ);

      // Near miss logic
      if (dz < 1.5 && dx > 1.5 && dx < 4.0) {
        // Bonus for being close but not hitting
        incrementScore(5);
      }

      const collisionX = dx < 1.6;
      const collisionZ = dz < 1.2;
      let collisionY = false;

      if (obsData.type === 'MONOLITH') {
        collisionY = playerActualY < 4.0;
      } else {
        collisionY = playerActualY < 1.0;
      }

      if (collisionX && collisionZ && collisionY) {
        endGame();
      }

      if (mesh.position.z > playerPos.z + 20) {
        mesh.position.z -= TRACK_LENGTH;
        // Simple fairness: don't block more than 2 lanes at same Z if possible
        // (Since we have discrete lanes, we just pick a random one)
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
            <boxGeometry args={[2.8, 5, 1.5]} />
          ) : (
            <coneGeometry args={[1.5, 1.8, 4]} />
          )}
          <meshStandardMaterial
            color="#050505"
            emissive={data.color}
            emissiveIntensity={8}
            metalness={1}
            roughness={0}
          />
        </mesh>
      ))}
    </group>
  );
};
