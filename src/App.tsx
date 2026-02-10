import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { GameScene } from './components/GameScene';
import { Track } from './components/Track';
import { Player } from './components/Player';
import { Obstacles } from './components/Obstacles';
import { Effects } from './components/Effects';
import { MainMenu } from './components/UI/MainMenu';
import { HUD } from './components/UI/HUD';
import { GameOver } from './components/UI/GameOver';
import { AudioController } from './components/AudioController';
import { Loader } from '@react-three/drei';

function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <Suspense fallback={null}>
        <Canvas shadows>
          <GameScene />
          <Track />
          <Player />
          <Obstacles />
          <Effects />
        </Canvas>
      </Suspense>

      <Loader />
      <AudioController />
      <MainMenu />
      <HUD />
      <GameOver />
    </div>
  );
}

export default App;
