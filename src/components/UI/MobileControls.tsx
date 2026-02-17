import { useGameStore } from '../../store/useGameStore';

export const MobileControls = () => {
  const { status, lane, setLane, isJumping, setJumping, useEnergy } = useGameStore();

  if (status !== 'PLAYING') return null;

  const handleJump = () => {
    if (!isJumping) {
      if (useEnergy(30)) {
        setJumping(true);
        setTimeout(() => setJumping(false), 800);
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-10 md:hidden select-none">
      <div className="flex justify-between items-end w-full max-w-lg mx-auto pointer-events-auto">
        {/* Left/Right Controls */}
        <div className="flex gap-4">
          <button
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center active:bg-white/30 transition-colors"
            onPointerDown={() => setLane(lane - 1)}
          >
            <span className="text-white text-3xl">←</span>
          </button>
          <button
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center active:bg-white/30 transition-colors"
            onPointerDown={() => setLane(lane + 1)}
          >
            <span className="text-white text-3xl">→</span>
          </button>
        </div>

        {/* Jump Control */}
        <button
          className="w-24 h-24 bg-cyan-500/20 backdrop-blur-md rounded-full border-2 border-cyan-400 flex items-center justify-center active:bg-cyan-500/40 transition-colors"
          onPointerDown={handleJump}
        >
          <span className="text-cyan-400 font-bold">JUMP</span>
        </button>
      </div>
    </div>
  );
};
