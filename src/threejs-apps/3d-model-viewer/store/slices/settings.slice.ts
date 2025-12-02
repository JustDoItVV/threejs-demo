import { StateCreator } from 'zustand';

import { CameraType } from '../../types';

export interface SettingsSlice {
  cameraType: CameraType;
  setCameraType: (type: CameraType) => void;
}

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  cameraType: 'perspective',

  setCameraType: (type) => set({ cameraType: type }),
});
