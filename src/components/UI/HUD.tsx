import { useGameStore } from '../../store/useGameStore';

export const HUD = () => {
  const { score, status } = useGameStore();

  if (status !== 'PLAYING') return null;

  return (
    <div className="absolute top-8 left-8 text-white z-10">
      <div className="text-sm opacity-50 font-bold tracking-widest uppercase">Distance</div>
      <div className="text-5xl font-black italic">{Math.floor(score / 10)}m</div>
    </div>
  );
};
