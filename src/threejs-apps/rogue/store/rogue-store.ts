'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Core model (in-memory storage with business logic)
import AppModel from '../core/controller/app.model';
import Datalayer from '../infrastructure/repositories/datalayer';

import type { GameState } from '../types/game-types';

/**
 * Architecture:
 *
 * 1. Core Model (AppModel + GameSession + entities)
 *    - Single source of truth for game state
 *    - Contains all business logic
 *    - Can be swapped for DB/IndexedDB/FileDB
 *
 * 2. Zustand Store
 *    - UI state and rendering data
 *    - Holds references to core entities (not copies!)
 *    - Triggers React re-renders
 *
 * 3. Reducers (actions in store)
 *    - Call core model methods first
 *    - Then update zustand with references from core
 *    - Ensures single source of truth
 */

interface DebugInfo {
  characterPos: { x: number; y: number } | null;
  cameraPos: { x: number; y: number; z: number } | null;
  roomInfo: {
    fieldX: number;
    fieldY: number;
    sizeX: number;
    sizeY: number;
  } | null;
  entityCount: {
    rooms: number;
    enemies: number;
    items: number;
    corridors: number;
  };
}

interface RogueGameStore {
  // ===== Core Model (single source of truth) =====
  model: AppModel | null;
  datalayer: typeof Datalayer.prototype | null;

  // ===== UI State (derived from core, triggers re-renders) =====
  // We store a counter to force re-renders when core state changes
  renderTrigger: number;

  // Game state for UI conditionals
  gameState: GameState;

  // ===== Debug & Camera State =====
  debugInfo: DebugInfo;
  cameraZoom: number;
  showMarkers: boolean;
  disableFog: boolean;
  godMode: boolean;

  // ===== Actions (Reducers) =====
  // Initialize the model
  initialize: () => void;

  // Game actions
  startGame: () => void;
  makeTurn: (input: string) => void;
  restart: () => void;
  setGameState: (state: GameState) => void;

  // Persistence
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;

  // Debug actions
  setDebugInfo: (info: DebugInfo) => void;
  setCameraZoom: (zoom: number) => void;
  toggleMarkers: () => void;
  toggleFog: () => void;
  toggleGodMode: () => void;

  // Internal: trigger re-render after core state changes
  _triggerRender: () => void;
}

export const useRogueStore = create<RogueGameStore>()(
  devtools(
    (set, get) => ({
      // ===== Initial State =====
      model: null,
      datalayer: null,
      renderTrigger: 0,
      gameState: 'start',

      // Debug & Camera state
      debugInfo: {
        characterPos: null,
        cameraPos: null,
        roomInfo: null,
        entityCount: {
          rooms: 0,
          enemies: 0,
          items: 0,
          corridors: 0,
        },
      },
      cameraZoom: 50,
      showMarkers: false,
      disableFog: false,
      godMode: false,

      // ===== Initialization =====
      initialize: () => {
        const datalayer = new Datalayer();
        const model = new AppModel(datalayer);

        set({
          model,
          datalayer,
          gameState: model.gameSession.state as GameState,
        });
      },

      // ===== Reducers (Core → Zustand sync) =====

      /**
       * Start new game
       * 1. Call core model method
       * 2. Update zustand with new state from core
       */
      startGame: () => {
        const { model } = get();
        if (!model) {
          console.error('[RogueStore] Model not initialized');
          return;
        }

        // 1. Update core model
        model.gameSession.start();

        // 2. Sync UI state from core
        set({
          gameState: model.gameSession.state as GameState,
        });

        // 3. Trigger React re-render
        get()._triggerRender();
      },

      /**
       * Make a turn (move, attack, use item, etc.)
       * 1. Call core model method
       * 2. Update zustand with new state from core
       */
      makeTurn: (input: string) => {
        const { model } = get();
        if (!model) return;

        // 1. Update core model
        model.useUserInput(input);

        // 2. Sync UI state from core
        set({
          gameState: model.gameSession.state as GameState,
        });

        // 3. Trigger React re-render
        get()._triggerRender();
      },

      /**
       * Restart game
       * 1. Call core model method
       * 2. Update zustand with new state from core
       */
      restart: () => {
        const { model } = get();
        if (!model) return;

        // 1. Update core model
        model.gameSession.restart();

        // 2. Sync UI state from core
        set({
          gameState: model.gameSession.state as GameState,
        });

        // 3. Trigger React re-render
        get()._triggerRender();
      },

      /**
       * Set game state (for UI transitions)
       */
      setGameState: (newState: GameState) => {
        const { model } = get();
        if (!model) return;

        // Update both core and UI state
        model.gameSession.state = newState;
        set({ gameState: newState });
        get()._triggerRender();
      },

      /**
       * Save game to storage
       */
      saveGame: async () => {
        const { model, datalayer } = get();
        if (!model || !datalayer) return;

        try {
          // Core model handles persistence through datalayer
          datalayer.saveSession(model.gameSession);
          console.log('[RogueStore] Game saved successfully');
        } catch (error) {
          console.error('[RogueStore] Failed to save game:', error);
        }
      },

      /**
       * Load game from storage
       */
      loadGame: async () => {
        const { model, datalayer } = get();
        if (!model || !datalayer) return;

        try {
          const data = datalayer.loadSession();

          if (!data) {
            console.log('[RogueStore] No saved game found');
            return;
          }

          // Apply loaded data to core model
          model.gameSession.applyData(data);

          // Sync UI state from core
          set({
            gameState: model.gameSession.state as GameState,
          });

          // Trigger re-render
          get()._triggerRender();

          console.log('[RogueStore] Game loaded successfully');
        } catch (error) {
          console.error('[RogueStore] Failed to load game:', error);
        }
      },

      /**
       * Debug: Update debug info
       */
      setDebugInfo: (info: DebugInfo) => {
        set({ debugInfo: info });
      },

      /**
       * Debug: Set camera zoom
       */
      setCameraZoom: (zoom: number) => {
        set({ cameraZoom: zoom });
      },

      /**
       * Debug: Toggle debug markers
       */
      toggleMarkers: () => {
        set((state) => ({ showMarkers: !state.showMarkers }));
      },

      /**
       * Debug: Toggle fog of war
       */
      toggleFog: () => {
        set((state) => ({ disableFog: !state.disableFog }));
      },

      /**
       * Debug: Toggle god mode (invincibility + infinite resources)
       */
      toggleGodMode: () => {
        const { model } = get();
        if (!model || !model.gameSession.character) return;

        const newGodMode = !get().godMode;
        set({ godMode: newGodMode });

        if (newGodMode) {
          // Enable god mode: max stats
          const char = model.gameSession.character;
          char.hp = 9999;
          char.maxHp = 9999;
          char.str = 999;
          char.dex = 999;
          char.gold = 9999;
        }

        get()._triggerRender();
      },

      /**
       * Internal: Trigger React re-render
       * Increments counter to force components to re-render
       */
      _triggerRender: () => {
        set((state) => ({ renderTrigger: state.renderTrigger + 1 }));
      },
    }),
    { name: 'RogueGameStore' }
  )
);

// ===== Selectors =====
// These selectors read directly from core model (single source of truth)
// Components subscribe to these selectors for reactive updates

export const selectGameState = (state: RogueGameStore) => state.gameState;
export const selectRenderTrigger = (state: RogueGameStore) => state.renderTrigger;

// Core model selectors - read directly from core entities
export const selectModel = (state: RogueGameStore) => state.model;

export const selectCharacter = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.character || null;
};

export const selectRooms = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.level?.rooms || [];
};

export const selectCorridors = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.level?.corridors || [];
};

export const selectDoor = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.level?.door || null;
};

export const selectEnemies = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.level?.enemies || [];
};

export const selectItems = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.level?.items || [];
};

export const selectLogMessages = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.logMessages || [];
};

export const selectLevelNumber = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.level?.level || 1;
};

export const selectBackpackItems = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.character?.backpack?.items || [];
};

export const selectStatistics = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.statistics || {
    enemiesKilled: 0,
    foodEaten: 0,
    elixirsDrunk: 0,
    scrollsUsed: 0,
    hitMissed: 0,
    travelledDistance: 0,
  };
};

export const selectWin = (state: RogueGameStore) => {
  state.renderTrigger; // Subscribe to render trigger
  return state.model?.gameSession?.win || null;
};

// ===== Debug Selectors =====
export const selectDebugInfo = (state: RogueGameStore) => state.debugInfo;
export const selectCameraZoom = (state: RogueGameStore) => state.cameraZoom;
export const selectShowMarkers = (state: RogueGameStore) => state.showMarkers;
export const selectDisableFog = (state: RogueGameStore) => state.disableFog;
export const selectGodMode = (state: RogueGameStore) => state.godMode;
