import { StateCreator } from 'zustand';

import { EGameState } from '../../types';
import { LevelSlice } from './level.slice';
import { PlayerSlice } from './player.slice';
import { StatisticsSlice } from './statistics.slice';

export interface GameSlice {
  state: EGameState;
  setState: (state: EGameState) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  restart: () => void;
}

export const createGameSlice: StateCreator<
  GameSlice & PlayerSlice & LevelSlice & StatisticsSlice,
  [],
  [],
  GameSlice
> = (set, get) => ({
  state: EGameState.Menu,

  setState: (state) => set({ state }),

  startGame: () => {
    const { initializeLevel, resetScore, loadHighScore, startTimer } = get();
    initializeLevel();
    resetScore();
    startTimer();
    set({ state: EGameState.Game, highScore: loadHighScore() });
  },

  pauseGame: () => {
    const { state } = get();
    if (state === EGameState.Game) {
      set({ state: EGameState.Pause });
    }
  },

  resumeGame: () => {
    const { state, startTimer } = get();
    if (state === EGameState.Pause) {
      startTimer();
      set({ state: EGameState.Game });
    }
  },

  gameOver: () => {
    const { score, highScore, stopTimer, saveHighScore } = get();
    const newHighScore = Math.max(score, highScore);

    stopTimer();

    if (newHighScore > highScore) {
      set({ highScore: newHighScore });
      saveHighScore();
    }

    set({ state: EGameState.Gameover });
  },

  restart: () => {
    const { resetPosition, initializeLevel, resetScore, loadHighScore, startTimer } = get();
    resetPosition();
    initializeLevel();
    resetScore();
    startTimer();
    set({ state: EGameState.Game, highScore: loadHighScore() });
  },
});
