import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { GameScene } from './components/GameScene';
import { Track } from './components/Track';
import { Player } from './components/Player';
import { Obstacles } from './components/Obstacles';
import { Pickups } from './components/Pickups';
import { Explosion } from './components/Explosion';
import { Effects } from './components/Effects';
import { MainMenu } from './components/UI/MainMenu';
import { HUD } from './components/UI/HUD';
import { MobileControls } from './components/UI/MobileControls';
import { GameOver } from './components/UI/GameOver';
import { AudioController } from './components/AudioController';
import { Loader } from '@react-three/drei';
import * as THREE from 'three';

function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <Suspense fallback={null}>
        <Canvas
          shadows
          gl={{
            antialias: false,
            stencil: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.NoToneMapping,
            logarithmicDepthBuffer: true
          }}
          dpr={[1, 2]}
        >
          <GameScene />
          <Track />
          <Player />
          <Obstacles />
          <Pickups />
          <Explosion />
          <Effects />
        </Canvas>
      </Suspense>

      <Loader />
      <AudioController />
      <MainMenu />
      <HUD />
      <MobileControls />
      <GameOver />
    </div>
  );
}

export default App;
