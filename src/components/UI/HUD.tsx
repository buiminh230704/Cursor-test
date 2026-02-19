import { useGameStore } from '../../store/useGameStore';

export const HUD = () => {
  const { score, status, speed, energy, charge, isSuper } = useGameStore();

  if (status !== 'PLAYING') return null;

  return (
    <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex justify-between items-start text-white z-10 pointer-events-none">
      <div className="flex flex-col gap-2 md:gap-4">
        <div>
          <div className="text-[10px] md:text-xs opacity-50 font-bold tracking-widest uppercase mb-1">Distance</div>
          <div className="text-3xl md:text-5xl font-black italic tabular-nums">{Math.floor(score / 10)}m</div>
        </div>

        <div className="w-40 md:w-64">
          <div className="flex justify-between text-[10px] uppercase font-bold mb-1 opacity-70">
            <span>Velocity</span>
            <span>{Math.floor(speed * 10)} km/h</span>
          </div>
          <div className="h-1.5 w-full bg-blue-900/30 overflow-hidden rounded-full">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${(speed / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold mb-1 opacity-70">Jump Core</div>
          <div className="flex gap-1 h-8 items-end">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 transition-all duration-300 ${
                  energy >= (i + 1) * 20
                    ? 'bg-orange-500 h-full shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                    : 'bg-white/10 h-1'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-[8px] opacity-40 uppercase md:block hidden">[Enter] to Discharge</div>
      </div>

      {/* Charge Meter - Center Bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className={`text-[10px] uppercase font-black mb-2 tracking-widest ${isSuper ? 'text-orange-400 animate-pulse' : 'text-white opacity-50'}`}>
          {isSuper ? 'HYPER DRIVE ACTIVE' : 'Sync Charge'}
        </div>
        <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
          <div
            className={`h-full transition-all duration-300 ${isSuper ? 'bg-orange-400' : 'bg-yellow-400'}`}
            style={{ width: `${charge}%` }}
          />
        </div>
      </div>
    </div>
  );
};
