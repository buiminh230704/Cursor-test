import { describe, it, expect } from 'vitest';
import { useGameStore } from './store/useGameStore';

describe('GameStore', () => {
  it('should initialize with START status', () => {
    const state = useGameStore.getState();
    expect(state.status).toBe('START');
    expect(state.score).toBe(0);
  });

  it('should change status to PLAYING when startGame is called', () => {
    const { startGame } = useGameStore.getState();
    startGame();
    expect(useGameStore.getState().status).toBe('PLAYING');
  });

  it('should increment score', () => {
    const { incrementScore } = useGameStore.getState();
    incrementScore(10);
    expect(useGameStore.getState().score).toBe(10);
  });
});
