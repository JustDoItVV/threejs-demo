import { StateCreator } from 'zustand';

import { Store } from '../';
import { EViewMode } from '../../types';

export interface IAppSlice {
  viewMode: EViewMode;

  setViewMode: (mode: EViewMode) => void;
  toggleFullWindow: () => void;
  toggleFullscreen: () => void;
}

export const createAppSlice: StateCreator<
  Store,
  [],
  [],
  IAppSlice
> = (set, get) => ({
  viewMode: EViewMode.Normal,

  setViewMode: (mode) => set({ viewMode: mode }),


  toggleFullWindow: () => {
    const { viewMode } = get();
    if (viewMode === EViewMode.Fullwindow) {
      set({ viewMode: EViewMode.Normal });
    } else {
      set({ viewMode: EViewMode.Fullwindow });
    }
  },

  toggleFullscreen: () => {
    const { viewMode } = get();
    if (viewMode === EViewMode.Fullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      set({ viewMode: EViewMode.Normal });
    } else {
      set({ viewMode: EViewMode.Fullscreen });
    }
  },
});
