import { StateCreator } from 'zustand';

const HIGHSCORE_KEY = 'froggy-road-highscore';

export interface StatisticsSlice {
  score: number;
  highScore: number;
  gameTime: number;
  gameStartTime: number | null;
  incrementScore: () => void;
  resetScore: () => void;
  updateGameTime: () => void;
  loadHighScore: () => number;
  saveHighScore: () => void;
  startTimer: () => void;
  stopTimer: () => void;
}

export const createStatisticsSlice: StateCreator<
  StatisticsSlice,
  [],
  [],
  StatisticsSlice
> = (set, get) => ({
  score: 0,
  highScore: 0,
  gameTime: 0,
  gameStartTime: null,

  loadHighScore: () => {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem(HIGHSCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  },

  saveHighScore: () => {
    const { highScore } = get();
    if (typeof window === 'undefined') return;
    localStorage.setItem(HIGHSCORE_KEY, highScore.toString());
  },

  incrementScore: () => {
    set((state) => ({ score: state.score + 1 }));
  },

  resetScore: () => {
    set({ score: 0, gameTime: 0 });
  },

  updateGameTime: () => {
    const { gameStartTime } = get();
    if (gameStartTime) {
      const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
      set({ gameTime: elapsed });
    }
  },

  startTimer: () => {
    set({ gameStartTime: Date.now(), gameTime: 0 });
  },

  stopTimer: () => {
    set({ gameStartTime: null });
  },
});
