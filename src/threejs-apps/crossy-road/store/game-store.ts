'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { Direction, DisplayMode, GameState, Position, RowData } from '../types';
import { MAP_METADATA } from '../utils/constants';
import { isValidPosition } from '../utils/position-utils';

interface GameStore {
  // Game state
  gameState: GameState;
  score: number;
  highScore: number;

  // Player state
  playerPosition: Position;
  movesQueue: Direction[];

  // Map data
  mapRows: RowData[];

  // Display mode
  displayMode: DisplayMode;

  // Debug state
  debugEnabled: boolean;
  godMode: boolean;
  cameraZoom: number;

  // Performance metrics
  fps: number;
  ms: number;

  // Actions
  setGameState: (state: GameState) => void;
  startGame: () => void;
  gameOver: () => void;
  updateScore: (score: number) => void;
  queueMove: (direction: Direction) => void;
  stepCompleted: () => void;
  resetGame: () => void;
  setDisplayMode: (mode: DisplayMode) => void;
  toggleDebug: () => void;
  toggleGodMode: () => void;
  setCameraZoom: (zoom: number) => void;
  updatePerformance: (fps: number, ms: number) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      gameState: 'menu',
      score: 0,
      highScore: typeof window !== 'undefined'
        ? parseInt(localStorage.getItem('crossyRoadHighScore') || '0', 10)
        : 0,

      playerPosition: {
        currentRow: 0,
        currentTile: 0,
      },

      movesQueue: [],
      mapRows: MAP_METADATA,
      displayMode: 'normal',
      debugEnabled: false,
      godMode: false,
      cameraZoom: 90,
      fps: 0,
      ms: 0,

      // Actions
      setGameState: (state: GameState) => {
        set({ gameState: state });
      },

      startGame: () => {
        set({
          gameState: 'playing',
          score: 0,
          playerPosition: { currentRow: 0, currentTile: 0 },
          movesQueue: [],
        });
      },

      gameOver: () => {
        const { score, highScore } = get();

        if (score > highScore) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('crossyRoadHighScore', score.toString());
          }
          set({ highScore: score });
        }

        set({ gameState: 'gameOver' });
      },

      updateScore: (score: number) => {
        set({ score });
      },

      queueMove: (direction: Direction) => {
        const { playerPosition, movesQueue, mapRows, godMode } = get();

        // In god mode, allow any move
        if (godMode) {
          set({ movesQueue: [...movesQueue, direction] });
          return;
        }

        // Check if the move is valid
        const isValid = isValidPosition(
          playerPosition,
          [...movesQueue, direction],
          mapRows
        );

        if (!isValid) return;

        set({ movesQueue: [...movesQueue, direction] });
      },

      stepCompleted: () => {
        const { movesQueue, playerPosition } = get();
        const direction = movesQueue[0];

        if (!direction) return;

        // Update position based on direction
        let newPosition = { ...playerPosition };

        if (direction === 'forward') {
          newPosition.currentRow += 1;
        } else if (direction === 'backward') {
          newPosition.currentRow -= 1;
        } else if (direction === 'left') {
          newPosition.currentTile -= 1;
        } else if (direction === 'right') {
          newPosition.currentTile += 1;
        }

        // Remove the completed move from queue
        const newQueue = movesQueue.slice(1);

        set({
          playerPosition: newPosition,
          movesQueue: newQueue,
        });

        // Update score if moving forward
        if (direction === 'forward') {
          const { score } = get();
          get().updateScore(score + 1);
        }
      },

      resetGame: () => {
        set({
          gameState: 'menu',
          score: 0,
          playerPosition: { currentRow: 0, currentTile: 0 },
          movesQueue: [],
        });
      },

      setDisplayMode: (mode: DisplayMode) => {
        set({ displayMode: mode });
      },

      toggleDebug: () => {
        set((state) => ({ debugEnabled: !state.debugEnabled }));
      },

      toggleGodMode: () => {
        set((state) => ({ godMode: !state.godMode }));
      },

      setCameraZoom: (zoom: number) => {
        set({ cameraZoom: zoom });
      },

      updatePerformance: (fps: number, ms: number) => {
        set({ fps, ms });
      },
    }),
    { name: 'CrossyRoadGameStore' }
  )
);

// Selectors
export const selectGameState = (state: GameStore) => state.gameState;
export const selectScore = (state: GameStore) => state.score;
export const selectHighScore = (state: GameStore) => state.highScore;
export const selectPlayerPosition = (state: GameStore) => state.playerPosition;
export const selectMovesQueue = (state: GameStore) => state.movesQueue;
export const selectMapRows = (state: GameStore) => state.mapRows;
export const selectDisplayMode = (state: GameStore) => state.displayMode;
export const selectDebugEnabled = (state: GameStore) => state.debugEnabled;
export const selectGodMode = (state: GameStore) => state.godMode;
export const selectCameraZoom = (state: GameStore) => state.cameraZoom;
export const selectFps = (state: GameStore) => state.fps;
export const selectMs = (state: GameStore) => state.ms;
