import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const MainMenu = () => {
  const { status, startGame } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'START' && e.key === 'Enter') {
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, startGame]);

  if (status !== 'START') return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white z-20 p-4 text-center">
      <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 italic drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
        NEON RACER
      </h1>
      <div className="w-40 md:w-64 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-10" />

      <p className="text-base md:text-lg mb-12 opacity-80 font-medium tracking-wide">SURVIVE THE VOID</p>

      <button
        onClick={startGame}
        className="group relative px-10 md:px-16 py-4 md:py-5 bg-white text-black font-black text-xl md:text-2xl overflow-hidden transition-all hover:pr-20"
      >
        <span className="relative z-10 uppercase">Start Mission</span>
        <div className="absolute top-0 right-0 w-0 h-full bg-cyan-400 transition-all group-hover:w-4" />
        <div className="absolute top-0 left-0 w-full h-full bg-cyan-400 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 -z-0 opacity-10" />
      </button>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">
        <div className="flex items-center gap-2">
          <span className="bg-white/10 px-2 py-1 rounded">A / D</span>
          <span>Switch Lanes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/10 px-2 py-1 rounded">Arrows</span>
          <span>Movement</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/10 px-2 py-1 rounded">Enter</span>
          <span>Jump / Start</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 opacity-100">
          <span className="bg-cyan-400/20 px-2 py-1 rounded underline">Endless</span>
          <span>Mission</span>
        </div>
      </div>
    </div>
  );
};
