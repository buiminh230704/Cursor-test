import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const GameOver = () => {
  const { status, score, highscore, resetGame } = useGameStore();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status !== 'GAMEOVER') {
      setCountdown(5);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, resetGame]);

  if (status !== 'GAMEOVER') return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-xl text-white z-30 transition-all duration-1000">
      <div className="text-[10vw] font-black tracking-tighter mb-8 italic mix-blend-overlay opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        TERMINATED
      </div>

      <div className="relative flex flex-col items-center">
        <h2 className="text-6xl font-black mb-12 tracking-tighter italic">CRITICAL FAILURE</h2>

        <div className="flex gap-20 mb-16">
          <div className="flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-50 mb-2">Distance reached</div>
            <div className="text-5xl font-black italic tabular-nums">{Math.floor(score / 10)}m</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-50 mb-2">Personal best</div>
            <div className="text-5xl font-black italic tabular-nums text-cyan-400">{Math.floor(highscore / 10)}m</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Auto-returning to base in</div>
          <div className="text-3xl font-black">{countdown}s</div>
          <button
            onClick={resetGame}
            className="mt-4 px-12 py-3 border border-white/20 hover:bg-white hover:text-black transition-all font-bold text-xs uppercase tracking-widest"
          >
            Manual Override [Menu]
          </button>
        </div>
      </div>
    </div>
  );
};
