import { useGameStore } from '../../store/useGameStore';

export const MainMenu = () => {
  const { status, startGame } = useGameStore();

  if (status !== 'START') return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white z-10">
      <h1 className="text-6xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 italic">
        NEON RACER AAA
      </h1>
      <p className="text-xl mb-12 opacity-80">Navigate the void. Avoid the monoliths.</p>
      <button
        onClick={startGame}
        className="px-12 py-4 bg-white text-black font-bold text-2xl hover:bg-cyan-400 transition-colors duration-300 transform hover:scale-105"
      >
        START MISSION
      </button>
      <div className="mt-12 text-sm opacity-50 flex gap-8">
        <span>[A][D] or [ARROWS] to MOVE</span>
        <span>STAY ALIVE TO SCORE</span>
      </div>
    </div>
  );
};
