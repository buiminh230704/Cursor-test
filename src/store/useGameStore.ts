import { create } from 'zustand';

interface GameState {
  status: 'START' | 'PLAYING' | 'GAMEOVER';
  score: number;
  highscore: number;
  lane: number; // 0, 1, 2, 3
  isJumping: boolean;
  jumpCount: number;
  speed: number;
  baseSpeed: number;
  maxSpeed: number;
  energy: number;
  fov: number;
  collisionPos: [number, number, number] | null;
  charge: number; // 0 to 100
  isSuper: boolean;
  startGame: () => void;
  endGame: (pos?: [number, number, number]) => void;
  resetGame: () => void;
  incrementScore: (amount: number) => void;
  setLane: (lane: number) => void;
  setJumping: (jumping: boolean) => void;
  useEnergy: (amount: number) => boolean;
  regenerateEnergy: (delta: number) => void;
  addCharge: (amount: number) => void;
  setSuper: (active: boolean) => void;
  tick: (delta: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'START',
  score: 0,
  highscore: 0,
  lane: 1,
  isJumping: false,
  jumpCount: 0,
  speed: 15,
  baseSpeed: 15,
  maxSpeed: 60,
  energy: 100,
  fov: 75,
  collisionPos: null,
  charge: 0,
  isSuper: false,
  startGame: () => set({
    status: 'PLAYING',
    score: 0,
    lane: 1,
    isJumping: false,
    jumpCount: 0,
    speed: 15,
    energy: 100,
    fov: 75,
    collisionPos: null,
    charge: 0,
    isSuper: false,
  }),
  endGame: (pos) => set((state) => ({
    status: 'GAMEOVER',
    highscore: Math.max(state.score, state.highscore),
    collisionPos: pos || null
  })),
  resetGame: () => set({ status: 'START', score: 0, collisionPos: null }),
  incrementScore: (amount) => set((state) => {
    const newScore = state.score + amount;
    const newSpeed = Math.min(state.maxSpeed, state.baseSpeed + (newScore / 2000));
    const speedRatio = (newSpeed - state.baseSpeed) / (state.maxSpeed - state.baseSpeed);
    const newFov = 75 + (speedRatio * 25);
    return { score: newScore, speed: newSpeed, fov: newFov };
  }),
  setLane: (lane) => set({ lane: Math.max(0, Math.min(3, lane)) }),
  setJumping: (jumping) => set((state) => ({
    isJumping: jumping,
    jumpCount: jumping ? state.jumpCount + 1 : 0
  })),
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
    energy: Math.min(100, state.energy + delta * 15)
  })),
  addCharge: (amount) => {
    const state = get();
    if (state.isSuper) return;
    const newCharge = Math.min(100, state.charge + amount);
    set({ charge: newCharge });
    if (newCharge >= 100) {
      state.setSuper(true);
    }
  },
  setSuper: (active) => set((state) => ({
    isSuper: active,
    speed: active ? state.speed + 25 : state.speed - 25,
    fov: active ? state.fov + 15 : state.fov - 15,
  })),
  tick: (delta) => {
    const state = get();
    if (state.status !== 'PLAYING') return;

    state.regenerateEnergy(delta);

    if (state.isSuper) {
      const newCharge = Math.max(0, state.charge - delta * 15);
      set({ charge: newCharge, energy: 100 });
      if (newCharge <= 0) {
        state.setSuper(false);
      }
    }
  },
}));
