import { create } from 'zustand';

interface GameState {
  status: 'START' | 'PLAYING' | 'GAMEOVER';
  score: number;
  highscore: number;
  lane: number; // 0, 1, 2, 3
  isJumping: boolean;
  speed: number;
  baseSpeed: number;
  maxSpeed: number;
  energy: number;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  incrementScore: (amount: number) => void;
  setLane: (lane: number) => void;
  setJumping: (jumping: boolean) => void;
  useEnergy: (amount: number) => boolean;
  regenerateEnergy: (delta: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'START',
  score: 0,
  highscore: 0,
  lane: 1,
  isJumping: false,
  speed: 15,
  baseSpeed: 15,
  maxSpeed: 50,
  energy: 100,
  startGame: () => set({
    status: 'PLAYING',
    score: 0,
    lane: 1,
    isJumping: false,
    speed: 15,
    energy: 100
  }),
  endGame: () => set((state) => ({
    status: 'GAMEOVER',
    highscore: Math.max(state.score, state.highscore)
  })),
  resetGame: () => set({ status: 'START', score: 0 }),
  incrementScore: (amount) => set((state) => {
    const newScore = state.score + amount;
    // Every 1000 score points, increase speed by 2, capped at maxSpeed
    const speedBoost = Math.floor(newScore / 1000) * 0.1;
    const newSpeed = Math.min(state.maxSpeed, state.baseSpeed + speedBoost + (newScore / 5000));
    return { score: newScore, speed: newSpeed };
  }),
  setLane: (lane) => set({ lane: Math.max(0, Math.min(3, lane)) }),
  setJumping: (jumping) => set({ isJumping: jumping }),
  useEnergy: (amount) => {
    let success = false;
    set((state) => {
      if (state.energy >= amount) {
        success = true;
        return { energy: state.energy - amount };
      }
      return { energy: state.energy };
    });
    return success;
  },
  regenerateEnergy: (delta) => set((state) => ({
    energy: Math.min(100, state.energy + delta * 10)
  })),
}));
