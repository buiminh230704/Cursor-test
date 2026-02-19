import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { Trail, Float } from '@react-three/drei';
import * as THREE from 'three';

const LANE_POSITIONS = [-7.5, -2.5, 2.5, 7.5];

export const Player = () => {
  const meshRef = useRef<THREE.Group>(null);
  const shipRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const {
    status, incrementScore, lane,
    isJumping, jumpCount, setJumping, speed, tick, fov, isSuper
  } = useGameStore();

  const lastKeyPress = useRef<string | null>(null);
  const verticalVelocity = useRef(0);
  const GRAVITY = 40;
  const JUMP_IMPULSE = 18;

  useEffect(() => {
    if (status === 'PLAYING' && meshRef.current) {
      meshRef.current.position.set(LANE_POSITIONS[lane], 0, 0);
      camera.position.set(LANE_POSITIONS[lane] * 0.5, 6, 12);
      verticalVelocity.current = 0;
    }
  }, [status, camera]);

  useEffect(() => {
    if (jumpCount > 0) {
      verticalVelocity.current = JUMP_IMPULSE;
    }
  }, [jumpCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState();
      if (state.status !== 'PLAYING') return;

      if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') && lastKeyPress.current !== e.key) {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          state.setLane(state.lane - 1);
        } else {
          state.setLane(state.lane + 1);
        }
        lastKeyPress.current = e.key;
      } else if (e.key === 'Enter' && state.jumpCount < 2) {
        if (state.useEnergy(25)) {
          state.setJumping(true);
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
  }, []);

  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const trailColor = useMemo(() => new THREE.Color('#00ffff'), []);
  const superTrailColor = useMemo(() => new THREE.Color('#ffaa00'), []);

  useFrame((state, delta) => {
    if (status !== 'PLAYING') return;
    if (!meshRef.current) return;

    tick(delta);

    // Constant forward movement
    meshRef.current.position.z -= speed * delta;

    // Much faster lane transition
    const targetX = LANE_POSITIONS[lane];
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 15, delta);

    // Ship tilt based on movement - more reactive
    if (shipRef.current) {
      const tilt = (targetX - meshRef.current.position.x) * 0.6;
      shipRef.current.rotation.z = THREE.MathUtils.damp(shipRef.current.rotation.z, -tilt, 12, delta);
      shipRef.current.rotation.y = THREE.MathUtils.damp(shipRef.current.rotation.y, tilt * 0.3, 12, delta);
      shipRef.current.rotation.x = THREE.MathUtils.damp(shipRef.current.rotation.x, isJumping ? -0.2 : 0, 8, delta);
    }

    // Physics-based jump (Smooth Parabolic Arc)
    if (isJumping) {
      meshRef.current.position.y += verticalVelocity.current * delta;
      verticalVelocity.current -= GRAVITY * delta;

      if (meshRef.current.position.y <= 0) {
        meshRef.current.position.y = 0;
        verticalVelocity.current = 0;
        setJumping(false);
      }
    }

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
    <group ref={meshRef} name="player">
      {/* Ship Lighting - Makes it pop in the dark */}
      <pointLight position={[0, 2, 0]} intensity={5} color="#00ffff" distance={10} />
      <pointLight position={[0, -1, -2]} intensity={2} color="#ffffff" distance={5} />

      {/* Jump Burst Effect */}
      {isJumping && (
        <pointLight position={[0, 1, 0]} intensity={5} color="#00ffff" distance={10} decay={2} />
      )}

      <Float speed={3} rotationIntensity={0.6} floatIntensity={0.6}>
        <group ref={shipRef}>
          {/* Main Hull - More Colorful */}
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.5, 4]} />
            <meshStandardMaterial
              color={isSuper ? "#ffaa00" : "#00bbff"}
              emissive={isSuper ? "#ffaa00" : "#0066ff"}
              emissiveIntensity={isSuper ? 3 : 1.5}
              metalness={1}
              roughness={0.1}
            />
          </mesh>

          {/* Hull Racing Stripe */}
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.2, 0.01, 3.8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>

          {/* Wings - Swept Back & Brighter */}
          <group position={[0, 0, 0.5]}>
            {/* Left Wing */}
            <mesh position={[-1.2, 0, 0.5]} rotation={[0, -0.4, 0]}>
              <boxGeometry args={[2, 0.1, 1.5]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} metalness={0.8} />
            </mesh>
            {/* Right Wing */}
            <mesh position={[1.2, 0, 0.5]} rotation={[0, 0.4, 0]}>
              <boxGeometry args={[2, 0.1, 1.5]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} metalness={0.8} />
            </mesh>

            {/* Wing Tip Lights */}
            <mesh position={[-2.1, 0, 1]} rotation={[0, -0.4, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={10} />
            </mesh>
            <mesh position={[2.1, 0, 1]} rotation={[0, 0.4, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={10} />
            </mesh>
          </group>

          {/* Twin Engine Pods - Enhanced */}
          <group position={[0, -0.2, 1.5]}>
            <mesh position={[-0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 1.2, 12]} />
              <meshStandardMaterial color="#222" metalness={1} roughness={0.3} />
            </mesh>
            <mesh position={[0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 1.2, 12]} />
              <meshStandardMaterial color="#222" metalness={1} roughness={0.3} />
            </mesh>

            {/* Dual Thruster Glow - Pulsing Effect via intensity */}
            <mesh position={[-0.7, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.18, 0.1, 16]} />
              <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={30} />
            </mesh>
            <mesh position={[0.7, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.18, 0.1, 16]} />
              <meshStandardMaterial color="#000" emissive="#00ffff" emissiveIntensity={30} />
            </mesh>

            {/* Secondary Inner Glow */}
            <mesh position={[-0.7, 0, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.7, 0, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Cockpit - Enhanced Aerodynamics */}
          <mesh position={[0, 0.35, -0.6]} rotation={[Math.PI / 2.2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.4, 1.8, 4]} />
            <meshStandardMaterial color="#050505" emissive="#00ffff" emissiveIntensity={8} transparent opacity={0.9} roughness={0} metalness={1} />
          </mesh>

          {/* Tail Fin - Brighter */}
          <mesh position={[0, 0.6, 1.5]}>
            <boxGeometry args={[0.05, 0.8, 1]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
          </mesh>

          <Trail
            width={isSuper ? 5 : 2.5}
            length={isSuper ? 30 : 15}
            color={isSuper ? superTrailColor : trailColor}
            attenuation={(t) => t * t}
          >
            <mesh position={[0, 0, 2]} />
          </Trail>
        </group>
      </Float>
    </group>
  );
};
