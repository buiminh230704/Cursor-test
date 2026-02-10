import { describe, it, expect } from 'vitest';
import { useGameStore } from './store/useGameStore';

describe('GameStore', () => {
  it('should initialize with START status', () => {
    const state = useGameStore.getState();
    expect(state.status).toBe('START');
    expect(state.score).toBe(0);
    expect(state.lane).toBe(1);
  });

  it('should change status to PLAYING when startGame is called', () => {
    const { startGame } = useGameStore.getState();
    startGame();
    expect(useGameStore.getState().status).toBe('PLAYING');
  });

  it('should change lane', () => {
    const { setLane } = useGameStore.getState();
    setLane(2);
    expect(useGameStore.getState().lane).toBe(2);
    setLane(5); // should be clamped
    expect(useGameStore.getState().lane).toBe(3);
  });

  it('should set jumping state', () => {
    const { setJumping } = useGameStore.getState();
    setJumping(true);
    expect(useGameStore.getState().isJumping).toBe(true);
  });
});
