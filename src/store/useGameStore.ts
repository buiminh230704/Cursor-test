import { create } from 'zustand';

interface GameState {
  status: 'START' | 'PLAYING' | 'GAMEOVER';
  score: number;
  highscore: number;
  lane: number; // 0, 1, 2, 3
  isJumping: boolean;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  incrementScore: (amount: number) => void;
  setLane: (lane: number) => void;
  setJumping: (jumping: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'START',
  score: 0,
  highscore: 0,
  lane: 1, // Start in middle-left lane
  isJumping: false,
  startGame: () => set({ status: 'PLAYING', score: 0, lane: 1, isJumping: false }),
  endGame: () => set((state) => ({
    status: 'GAMEOVER',
    highscore: Math.max(state.score, state.highscore)
  })),
  resetGame: () => set({ status: 'START', score: 0 }),
  incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
  setLane: (lane) => set({ lane: Math.max(0, Math.min(3, lane)) }),
  setJumping: (jumping) => set({ isJumping: jumping }),
}));
