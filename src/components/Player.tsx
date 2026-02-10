import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { Trail, Float } from '@react-three/drei';
import * as THREE from 'three';

const LANE_POSITIONS = [-7.5, -2.5, 2.5, 7.5];

export const Player = () => {
  const meshRef = useRef<THREE.Group>(null);
  const shipRef = useRef<THREE.Group>(null);
  const {
    status, incrementScore, lane, setLane,
    isJumping, setJumping, speed, useEnergy, regenerateEnergy
  } = useGameStore();

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
        if (useEnergy(30)) {
          setJumping(true);
          setTimeout(() => setJumping(false), 800);
        }
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
  }, [status, lane, setLane, isJumping, setJumping, useEnergy]);

  useFrame((state, delta) => {
    if (status !== 'PLAYING') return;
    if (!meshRef.current) return;

    regenerateEnergy(delta);

    // Constant forward movement based on dynamic speed
    meshRef.current.position.z -= speed * delta;

    // Smooth lane transition with more responsiveness
    const targetX = LANE_POSITIONS[lane];
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.15);

    // Ship tilt on lane change
    if (shipRef.current) {
      const tilt = (targetX - meshRef.current.position.x) * 0.2;
      shipRef.current.rotation.z = THREE.MathUtils.lerp(shipRef.current.rotation.z, -tilt, 0.1);
      shipRef.current.rotation.y = THREE.MathUtils.lerp(shipRef.current.rotation.y, tilt * 0.5, 0.1);
    }

    // Jump animation
    const targetY = isJumping ? 3.5 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);

    // Camera follow with slight lag for smoothness
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, meshRef.current.position.z + 12, 0.1);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, meshRef.current.position.x * 0.7, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 6 + meshRef.current.position.y * 0.3, 0.05);
    state.camera.lookAt(meshRef.current.position.x, 1, meshRef.current.position.z - 10);

    // Update score based on distance moved
    incrementScore(speed * delta * 10);
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={shipRef}>
          {/* Main Body */}
          <Trail
            width={1.5}
            length={10}
            color={new THREE.Color('#00ffff')}
            attenuation={(t) => t * t}
          >
            <mesh castShadow>
              <boxGeometry args={[1, 0.4, 2.5]} />
              <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
            </mesh>
          </Trail>

          {/* Cockpit */}
          <mesh position={[0, 0.25, 0.3]}>
            <boxGeometry args={[0.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#111" emissive="#00ffff" emissiveIntensity={1} transparent opacity={0.8} />
          </mesh>

          {/* Fins */}
          <mesh position={[0.7, 0, -0.5]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.8, 0.1, 1.2]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[-0.7, 0, -0.5]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.8, 0.1, 1.2]} />
            <meshStandardMaterial color="#333" />
          </mesh>

          {/* Thrusters */}
          <mesh position={[0.3, -0.1, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.1, 0.4]} />
            <meshStandardMaterial color="#000" emissive="#ff0044" emissiveIntensity={10} />
          </mesh>
          <mesh position={[-0.3, -0.1, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.1, 0.4]} />
            <meshStandardMaterial color="#000" emissive="#ff0044" emissiveIntensity={10} />
          </mesh>

          {/* Wing Tip Lights */}
          <mesh position={[1.1, 0, -0.8]}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} />
          </mesh>
          <mesh position={[-1.1, 0, -0.8]}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} />
          </mesh>
        </group>
      </Float>
    </group>
  );
};
