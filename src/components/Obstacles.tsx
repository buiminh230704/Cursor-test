import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

const WAVES_COUNT = 20;
const WAVE_DISTANCE = 60;
const TRACK_LENGTH = WAVES_COUNT * WAVE_DISTANCE;
const LANE_POSITIONS = [-7.5, -2.5, 2.5, 7.5];

export const Obstacles = () => {
  const { status, endGame, incrementScore } = useGameStore();
  const obstaclesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (status === 'PLAYING' && obstaclesRef.current) {
      // Reset all obstacles to their initial wave positions
      let index = 0;
      waveData.forEach((data) => {
        const mesh = obstaclesRef.current?.children[index] as THREE.Mesh;
        if (mesh) {
          mesh.position.set(
            LANE_POSITIONS[data.lane],
            data.type === 'MONOLITH' ? 2.5 : 0,
            data.z
          );
        }
        index++;
      });
    }
  }, [status]);

  // Generate initial waves
  const waveData = useMemo(() => {
    return Array.from({ length: WAVES_COUNT }).map((_, i) => {
      // For each wave, decide which lanes to block
      // 1 to 3 lanes blocked, ensuring at least one is always free or jumpable
      const lanesToBlock = [0, 1, 2, 3].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);

      return lanesToBlock.map(laneIndex => {
        const type = Math.random() > 0.3 ? 'MONOLITH' : 'SPIKES';
        return {
          lane: laneIndex,
          type,
          z: -i * WAVE_DISTANCE - 100,
          color: type === 'MONOLITH' ? '#ff4400' : '#ff0000',
        };
      });
    }).flat();
  }, []);

  useFrame((state) => {
    if (status !== 'PLAYING') return;
    if (!obstaclesRef.current) return;

    const player = state.scene.getObjectByName('player');
    if (!player) return;

    const pZ = player.position.z;

    const storeState = useGameStore.getState();
    const playerActualX = LANE_POSITIONS[storeState.lane];
    const playerActualY = storeState.isJumping ? 4 : 0;

    obstaclesRef.current.children.forEach((mesh: any) => {
      const dx = Math.abs(mesh.position.x - playerActualX);
      const dz = Math.abs(mesh.position.z - pZ);

      // Near miss logic
      if (dz < 2.0 && dx > 1.6 && dx < 4.0) {
        incrementScore(10 * (storeState.speed / 15));
      }

      const collisionX = dx < 1.6;
      const collisionZ = dz < 2.0;
      let collisionY = false;

      // Obstacle type is stored in user data or we can infer from position.y
      const isMonolith = mesh.position.y > 1;
      if (isMonolith) {
        collisionY = playerActualY < 4.5;
      } else {
        collisionY = playerActualY < 1.2;
      }

      if (collisionX && collisionZ && collisionY) {
        endGame([mesh.position.x, mesh.position.y, mesh.position.z]);
      }

      // Reset wave logic
      if (mesh.position.z > pZ + 40) {
        mesh.position.z -= TRACK_LENGTH;
        // Randomize lane on reset but keep wave structure roughly
        // (For simplicity in this flat list, we just move it to a random lane)
        mesh.position.x = LANE_POSITIONS[Math.floor(Math.random() * 4)];
      }
    });
  });

  return (
    <group ref={obstaclesRef}>
      {waveData.map((data, i) => (
        <mesh
          key={i}
          position={[LANE_POSITIONS[data.lane], data.type === 'MONOLITH' ? 2.5 : 0, data.z]}
        >
          {data.type === 'MONOLITH' ? (
            <boxGeometry args={[3, 5, 2]} />
          ) : (
            <coneGeometry args={[1.5, 2, 4]} />
          )}
          <meshStandardMaterial
            color="#050505"
            emissive={data.color}
            emissiveIntensity={10}
            metalness={1}
            roughness={0}
          />
        </mesh>
      ))}
    </group>
  );
};
