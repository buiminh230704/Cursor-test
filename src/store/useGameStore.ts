import { create } from 'zustand';

interface GameState {
  status: 'START' | 'PLAYING' | 'GAMEOVER';
  score: number;
  highscore: number;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  incrementScore: (amount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'START',
  score: 0,
  highscore: 0,
  startGame: () => set({ status: 'PLAYING', score: 0 }),
  endGame: () => set((state) => ({
    status: 'GAMEOVER',
    highscore: Math.max(state.score, state.highscore)
  })),
  resetGame: () => set({ status: 'START', score: 0 }),
  incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
}));
