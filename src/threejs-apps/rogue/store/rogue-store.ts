'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Bridge to existing class-based logic (temporary)
import AppController from '../core/controller/app.controller.js';
import { IGameRepository } from '../infrastructure/repositories/i-game-repository';
import { LocalStorageRepository } from '../infrastructure/repositories/local-storage-repository';

import type {
  GameState,
  GameSession,
  Room,
  Corridor,
  Character,
  Enemy,
  Item,
  GameStatistics,
} from '../core/types/game-types';

interface RogueGameStore {
  // Game State
  gameState: GameState;
  needsRender: number;

  // Level Data
  levelNumber: number;
  rooms: Room[];
  corridors: Corridor[];
  door: Item | null;
  items: Item[];
  enemies: Enemy[];

  // Character Data
  character: Character;

  // UI State
  logMessages: string[];
  backpackItems: Item[];
  statistics: GameStatistics;
  win: boolean | null;

  // Legacy bridge (will be removed after full migration)
  _controller: AppController | null;
  _repository: IGameRepository;

  // Actions
  initController: () => void;
  setGameState: (state: GameState) => void;
  startGame: () => void;
  makeTurn: (input: string) => void;
  restart: () => void;
  forceRender: () => void;

  // Persistence actions
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;

  // Internal sync (bridge between old classes and Zustand)
  _syncFromController: () => void;
}

export const useRogueStore = create<RogueGameStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      gameState: 'start',
      needsRender: 0,
      levelNumber: 1,
      rooms: [],
      corridors: [],
      door: null,
      items: [],
      enemies: [],
      character: null,
      logMessages: [],
      backpackItems: null,
      statistics: {
        enemiesKilled: 0,
        itemsCollected: 0,
        roomsVisited: 0,
        turnsPlayed: 0,
      },
      win: null,

      // Legacy bridge
      _controller: null,
      _repository: new LocalStorageRepository(),

      // Initialize controller (temporary bridge)
      initController: () => {
        const controller = new AppController();
        set({ _controller: controller });
        get()._syncFromController();
      },

      // Sync data from old controller to Zustand state
      _syncFromController: () => {
        const controller = get()._controller;
        if (!controller) return;

        try {
          const entities = controller.getEntitiesToRender();
          const statuses = controller.getStatuses();

          set({
            gameState: statuses.gameState as GameState,
            levelNumber: statuses.level,
            rooms: entities.rooms || [],
            corridors: entities.corridors || [],
            door: entities.door,
            items: entities.items || [],
            enemies: entities.enemies || [],
            character: entities.character,
            logMessages: statuses.logMessages || [],
            win: statuses.win,
          });
        } catch (error) {
          console.error('[RogueStore] Failed to sync from controller:', error);
        }
      },

      // Manually set game state
      setGameState: (newState: GameState) => {
        set({ gameState: newState });
      },

      // Start new game
      startGame: () => {
        const controller = get()._controller;
        if (!controller) {
          console.error('[RogueStore] Controller not initialized');
          return;
        }

        try {
          // @ts-expect-error -- tmp
          controller.model.gameSession.start();
          get()._syncFromController();
          get().forceRender();
        } catch (error) {
          console.error('[RogueStore] Failed to start game:', error);
        }
      },

      // Make a turn (move, use item, etc)
      makeTurn: (input: string) => {
        const controller = get()._controller;
        if (!controller) return;

        try {
          controller.useUserInput(input);
          get()._syncFromController();
          get().forceRender();
        } catch (error) {
          console.error('[RogueStore] Failed to make turn:', error);
        }
      },

      // Restart game
      restart: () => {
        const controller = get()._controller;
        if (!controller) return;

        try {
          // @ts-expect-error -- tmp
          controller?.model?.gameSession.restart();
          get()._syncFromController();
          get().forceRender();
        } catch (error) {
          console.error('[RogueStore] Failed to restart:', error);
        }
      },

      // Force re-render (will be removed after full migration)
      forceRender: () => {
        set((state) => ({ needsRender: state.needsRender + 1 }));
      },

      // Save game to repository
      saveGame: async () => {
        const controller = get()._controller;
        const repository = get()._repository;

        if (!controller) return;

        try {
          const session: GameSession = {
            state: get().gameState,
            level: {
              number: get().levelNumber,
              rooms: get().rooms,
              corridors: get().corridors,
              door: get().door,
              items: get().items,
              enemies: get().enemies,
            },
            character: get().character!,
            logMessages: get().logMessages,
            backpackItems: get().backpackItems,
            statistics: get().statistics,
            win: get().win,
          };

          await repository.saveSession(session);
          console.log('[RogueStore] Game saved successfully');
        } catch (error) {
          console.error('[RogueStore] Failed to save game:', error);
        }
      },

      // Load game from repository
      loadGame: async () => {
        const controller = get()._controller;
        // const repository = get()._repository;

        if (!controller) return;

        try {
          // Use legacy controller's loadGame (uses old Datalayer)
          // This works because controller.datalayer reads from localStorage
          const data = controller.loadGame();

          if (!data) {
            console.log('[RogueStore] No saved game found');
            return;
          }

          // Sync loaded state to Zustand
          get()._syncFromController();
          get().forceRender();

          console.log('[RogueStore] Game loaded successfully');
        } catch (error) {
          console.error('[RogueStore] Failed to load game:', error);
        }
      },
    }),
    { name: 'RogueGameStore' }
  )
);

// Selectors for optimized re-renders
export const selectGameState = (state: RogueGameStore) => state.gameState;
export const selectCharacter = (state: RogueGameStore) => state.character;
export const selectRooms = (state: RogueGameStore) => state.rooms;
export const selectEnemies = (state: RogueGameStore) => state.enemies;
export const selectItems = (state: RogueGameStore) => state.items;
export const selectLogMessages = (state: RogueGameStore) => state.logMessages;
export const selectLevelNumber = (state: RogueGameStore) => state.levelNumber;
