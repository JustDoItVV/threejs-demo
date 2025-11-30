'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createAppSlice, IAppSlice } from './slices/app.slice';
import { createDebugSlice, IDebugSlice } from './slices/debug.slice';
import { createGameSlice, IGameSlice } from './slices/game.slice';

export type Store =
  IAppSlice &
  IGameSlice &
  IDebugSlice
;

export const useStore = create<Store>()(
  devtools(
    (...a) => ({
      ...createAppSlice(...a),
      ...createGameSlice(...a),
      ...createDebugSlice(...a),
    }),
    { name: 'RogueStore' }
  )
);

export const selectRenderTrigger = (state: Store) => state.renderTrigger;
export const selectController = (state: Store) => state.controller;
export const selectDebugSlice = (state: Store): IDebugSlice => state;
