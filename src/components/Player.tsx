import { useRef, useEffect, useMemo } from 'react';
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
    isJumping, setJumping, speed, useEnergy, regenerateEnergy, fov
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

  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const trailColor = useMemo(() => new THREE.Color('#00ffff'), []);

  useFrame((state, delta) => {
    if (status !== 'PLAYING') return;
    if (!meshRef.current) return;

    regenerateEnergy(delta);

    // Constant forward movement
    meshRef.current.position.z -= speed * delta;

    // Smoother lane transition using damp
    const targetX = LANE_POSITIONS[lane];
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 10, delta);

    // Ship tilt based on movement
    if (shipRef.current) {
      const tilt = (targetX - meshRef.current.position.x) * 0.4;
      shipRef.current.rotation.z = THREE.MathUtils.damp(shipRef.current.rotation.z, -tilt, 6, delta);
      shipRef.current.rotation.y = THREE.MathUtils.damp(shipRef.current.rotation.y, tilt * 0.5, 6, delta);
      shipRef.current.rotation.x = THREE.MathUtils.damp(shipRef.current.rotation.x, isJumping ? -0.2 : 0, 4, delta);
    }

    // Jump animation
    const targetY = isJumping ? 4.5 : 0;
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 6, delta);

    // Dynamic FOV update
    const cam = state.camera as THREE.PerspectiveCamera;
    cam.fov = THREE.MathUtils.damp(cam.fov, fov, 2, delta);
    cam.updateProjectionMatrix();

    // Camera follow logic - enhanced for extreme smoothness
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, meshRef.current.position.z + 12, 6, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, meshRef.current.position.x * 0.5, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 6 + meshRef.current.position.y * 0.3, 4, delta);

    // Look at a point ahead of the player
    lookTarget.set(meshRef.current.position.x, 1, meshRef.current.position.z - 15);
    state.camera.lookAt(lookTarget);

    // Update score
    incrementScore(speed * delta * 20);
  });

  return (
    <group ref={meshRef}>
      <Float speed={3} rotationIntensity={0.6} floatIntensity={0.6}>
        <group ref={shipRef}>
          <Trail
            width={2.5}
            length={15}
            color={trailColor}
            attenuation={(t) => t * t}
          >
            <mesh castShadow>
              <boxGeometry args={[1.3, 0.4, 3]} />
              <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
            </mesh>
          </Trail>

          {/* Cockpit */}
          <mesh position={[0, 0.3, 0.5]}>
            <boxGeometry args={[0.6, 0.35, 1.2]} />
            <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={3} transparent opacity={0.9} />
          </mesh>

          {/* Side Thrusters */}
          <mesh position={[0.9, -0.1, -0.4]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.7, 0.1, 1.8]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[-0.9, -0.1, -0.4]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.7, 0.1, 1.8]} />
            <meshStandardMaterial color="#222" />
          </mesh>

          {/* Dynamic Thruster Glow */}
          <mesh position={[0, -0.1, 1.6]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.2, 0.6]} />
            <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={15} />
          </mesh>
        </group>
      </Float>
    </group>
  );
};
