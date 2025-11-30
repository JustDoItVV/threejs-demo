import { StateCreator } from 'zustand';

import { Store } from '../';
import AppController from '../../core/controller/app.controller';
import { IDatalayer } from '../../types/entities';

export interface IGameSlice {
  renderTrigger: boolean;
  datalayer: IDatalayer | null;
  controller: AppController | null;

  init: () => void;
  startGame: () => void;
  makeTurn: (input: string) => void;
  restart: () => void;
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;

  _triggerRender: () => void;
}

export const createGameSlice: StateCreator<
  Store,
  [],
  [],
  IGameSlice
> = (set, get) => ({
  renderTrigger: false,
  datalayer: null,
  controller: null,

  init: () => {
    const controller = new AppController();
    set({ datalayer: controller.datalayer, controller });
  },

  startGame: () => {
    const state = get();
    const { controller, updateDebugOnModel, _triggerRender } = state;
    if (!controller) {
      console.error('[RogueStore] Model not initialized');
      return;
    }

    controller?.model?.gameSession.start();
    updateDebugOnModel();
    _triggerRender();
  },

  makeTurn: (input: string) => {
    const state = get();
    const { controller, updateDebugOnModel, _triggerRender } = state;
    if (!controller) return;

    controller.useUserInput(input);
    updateDebugOnModel();
    _triggerRender();
  },

  restart: () => {
    const state = get();
    const { controller, updateDebugOnModel, _triggerRender } = state;
    if (!controller) return;

    controller.model.gameSession.restart();
    updateDebugOnModel();
    _triggerRender();
  },

  saveGame: async () => {
    const state = get();
    const { controller, datalayer } = state;
    if (!controller?.model || !datalayer) return;

    try {
      datalayer.saveSession(controller.model.gameSession);
    } catch (error) {
      console.error('[RogueStore] Failed to save game:', error);
    }
  },

  loadGame: async () => {
    const state = get();
    const { controller, datalayer } = state;
    if (!controller?.model || !datalayer) return;

    try {
      const data = datalayer.loadSession();

      if (!data) {
        console.log('[RogueStore] No saved game found');
        return;
      }

      controller.model.gameSession.applyData(data);
      get()._triggerRender();
    } catch (error) {
      console.error('[RogueStore] Failed to load game:', error);
    }
  },

  _triggerRender: () => set({ renderTrigger: !get().renderTrigger }),
});
