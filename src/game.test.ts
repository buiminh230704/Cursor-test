import { describe, it, expect } from 'vitest';
import { useGameStore } from './store/useGameStore';

describe('GameStore', () => {
  it('should initialize with START status', () => {
    const state = useGameStore.getState();
    expect(state.status).toBe('START');
    expect(state.score).toBe(0);
    expect(state.lane).toBe(1);
    expect(state.fov).toBe(75);
    expect(state.collisionPos).toBeNull();
  });

  it('should change status to PLAYING when startGame is called', () => {
    const { startGame } = useGameStore.getState();
    startGame();
    expect(useGameStore.getState().status).toBe('PLAYING');
  });

  it('should store collision position when endGame is called', () => {
    const { endGame } = useGameStore.getState();
    endGame([1, 2, 3]);
    expect(useGameStore.getState().status).toBe('GAMEOVER');
    expect(useGameStore.getState().collisionPos).toEqual([1, 2, 3]);
  });

  it('should increase speed and FOV when score increases', () => {
    const { incrementScore, startGame } = useGameStore.getState();
    startGame();
    const initialSpeed = useGameStore.getState().speed;
    const initialFov = useGameStore.getState().fov;

    incrementScore(5000);

    expect(useGameStore.getState().speed).toBeGreaterThan(initialSpeed);
    expect(useGameStore.getState().fov).toBeGreaterThan(initialFov);
  });
});
