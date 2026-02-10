import { useGameStore } from '../../store/useGameStore';

export const GameOver = () => {
  const { status, score, highscore, startGame, resetGame } = useGameStore();

  if (status !== 'GAMEOVER') return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 bg-opacity-40 backdrop-blur-md text-white z-10">
      <h2 className="text-8xl font-black mb-4 tracking-tighter text-white italic">CRITICAL FAILURE</h2>
      <div className="flex gap-12 mb-12">
        <div className="text-center">
          <div className="text-sm opacity-50 uppercase font-bold">Last Run</div>
          <div className="text-4xl font-bold">{Math.floor(score / 10)}m</div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-50 uppercase font-bold">Best Run</div>
          <div className="text-4xl font-bold text-cyan-400">{Math.floor(highscore / 10)}m</div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={startGame}
          className="px-10 py-4 bg-white text-black font-bold text-xl hover:bg-cyan-400 transition-colors"
        >
          RETRY
        </button>
        <button
          onClick={resetGame}
          className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-xl hover:bg-white hover:text-black transition-colors"
        >
          MENU
        </button>
      </div>
    </div>
  );
};
