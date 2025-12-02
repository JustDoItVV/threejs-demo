import { StateCreator } from 'zustand';

export type CameraPreset = 'front' | 'side' | 'top' | 'angle';

export interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
}

export interface CameraSlice {
  orbitControlsEnabled: boolean;
  cameraMoveTrigger: CameraPosition | null;
  cameraPresetTrigger: CameraPreset | null;

  setOrbitControlsEnabled: (enabled: boolean) => void;
  triggerCameraMove: (position: [number, number, number], target?: [number, number, number]) => void;
  clearCameraMoveTrigger: () => void;
  triggerCameraPreset: (preset: CameraPreset) => void;
  clearCameraPresetTrigger: () => void;
}

export const createCameraSlice: StateCreator<
  CameraSlice,
  [],
  [],
  CameraSlice
> = (set) => ({
  orbitControlsEnabled: true,
  cameraMoveTrigger: null,
  cameraPresetTrigger: null,

  setOrbitControlsEnabled: (enabled) => set({ orbitControlsEnabled: enabled }),

  triggerCameraMove: (position, target = [0, 0, 0]) =>
    set({ cameraMoveTrigger: { position, target } }),

  clearCameraMoveTrigger: () => set({ cameraMoveTrigger: null }),

  triggerCameraPreset: (preset) => set({ cameraPresetTrigger: preset }),

  clearCameraPresetTrigger: () => set({ cameraPresetTrigger: null }),
});
