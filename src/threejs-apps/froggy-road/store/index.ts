import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { CollisionSlice, createCollisionSlice } from './slices/collision.slice';
import { createDebugSlice, DebugSlice } from './slices/debug.slice';
import { createGameSlice, GameSlice } from './slices/game.slice';
import { createLevelSlice, LevelSlice } from './slices/level.slice';
import { createPlayerSlice, PlayerSlice } from './slices/player.slice';
import { createStatisticsSlice, StatisticsSlice } from './slices/statistics.slice';
import { createViewModeSlice, ViewModeSlice } from './slices/view-mode.slice';

export type Store = GameSlice &
  PlayerSlice &
  DebugSlice &
  LevelSlice &
  StatisticsSlice &
  ViewModeSlice &
  CollisionSlice;

export const useStore = create<Store>()(
  devtools(
    (...a) => ({
      ...createGameSlice(...a),
      ...createPlayerSlice(...a),
      ...createDebugSlice(...a),
      ...createLevelSlice(...a),
      ...createStatisticsSlice(...a),
      ...createViewModeSlice(...a),
      ...createCollisionSlice(...a),
    }),
    { name: 'FroggyRoadStore' }
  )
);
