import { StateCreator } from 'zustand';

import { ViewMode } from '@/types/view-mode';

export interface ViewModeSlice {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleFullWindow: () => void;
  toggleFullscreen: () => void;
}

export const createViewModeSlice: StateCreator<
  ViewModeSlice,
  [],
  [],
  ViewModeSlice
> = (set, get) => ({
  viewMode: 'normal',

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleFullWindow: () => {
    const { viewMode } = get();
    if (viewMode === 'fullwindow') {
      set({ viewMode: 'normal' });
    } else if (viewMode === 'fullscreen') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      set({ viewMode: 'fullwindow' });
    } else {
      set({ viewMode: 'fullwindow' });
    }
  },

  toggleFullscreen: () => {
    const { viewMode } = get();
    if (viewMode === 'fullscreen') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      set({ viewMode: 'normal' });
    } else {
      set({ viewMode: 'fullscreen' });
    }
  },
});
