import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';
import { Float, Sparkles } from '@react-three/drei';

const PICKUPS_COUNT = 10;
const DISTANCE = 120;
const LANE_POSITIONS = [-7.5, -2.5, 2.5, 7.5];

export const Pickups = () => {
  const { status, addCharge } = useGameStore();
  const groupRef = useRef<THREE.Group>(null);

  const pickupData = useMemo(() => {
    return Array.from({ length: PICKUPS_COUNT }).map((_, i) => ({
      lane: Math.floor(Math.random() * 4),
      z: -i * DISTANCE - 200,
    }));
  }, []);

  useEffect(() => {
    if (status === 'PLAYING' && groupRef.current) {
      pickupData.forEach((data, i) => {
        const child = groupRef.current?.children[i] as THREE.Group;
        if (child) {
          child.position.set(LANE_POSITIONS[data.lane], 1.5, data.z);
          child.visible = true;
        }
      });
    }
  }, [status, pickupData]);

  useFrame((state) => {
    if (status !== 'PLAYING') return;
    if (!groupRef.current) return;

    const player = state.scene.getObjectByName('player');
    if (!player) return;

    groupRef.current.children.forEach((child: any) => {
      if (!child.visible) return;

      const dx = Math.abs(child.position.x - player.position.x);
      const dz = Math.abs(child.position.z - player.position.z);

      if (dz < 2 && dx < 2) {
        child.visible = false;
        addCharge(20);
      }

      if (child.position.z > player.position.z + 40) {
        child.position.z -= PICKUPS_COUNT * DISTANCE;
        child.position.x = LANE_POSITIONS[Math.floor(Math.random() * 4)];
        child.visible = true;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {pickupData.map((_, i) => (
        <group key={i}>
          <Float speed={5} rotationIntensity={2} floatIntensity={2}>
            <mesh>
              <boxGeometry args={[0.5, 1.5, 0.5]} />
              <meshStandardMaterial
                color="#ff00ff"
                emissive="#ff00ff"
                emissiveIntensity={4}
              />
            </mesh>
            <Sparkles count={10} scale={2} size={2} color="#ff00ff" />
          </Float>
        </group>
      ))}
    </group>
  );
};
