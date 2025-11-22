import { StateCreator } from 'zustand';

export interface DebugSlice {
  showGrid: boolean;
  showAxes: boolean;
  enableFreeCameraControl: boolean;
  godMode: boolean;
  isPanelOpen: boolean;
  toggleGrid: () => void;
  toggleAxes: () => void;
  toggleFreeCameraControl: () => void;
  toggleGodMode: () => void;
  togglePanel: () => void;
}

export const createDebugSlice: StateCreator<
  DebugSlice,
  [],
  [],
  DebugSlice
> = (set, get) => ({
  showGrid: false,
  showAxes: false,
  enableFreeCameraControl: false,
  godMode: false,
  isPanelOpen: false,

  toggleGrid: () => set({ showGrid: !get().showGrid }),

  toggleAxes: () => set({ showAxes: !get().showAxes }),

  toggleFreeCameraControl: () => set({ enableFreeCameraControl: !get().enableFreeCameraControl }),

  toggleGodMode: () => set({ godMode: !get().godMode }),

  togglePanel: () => set({ isPanelOpen: !get().isPanelOpen }),
});
