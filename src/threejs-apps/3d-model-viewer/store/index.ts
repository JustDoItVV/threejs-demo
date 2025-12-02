import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createCameraSlice, CameraSlice } from './slices/camera.slice';
import { createLoadingSlice, LoadingSlice } from './slices/loading.slice';
import { createMeshSlice, MeshSlice } from './slices/mesh.slice';
import { createModelSlice, ModelSlice } from './slices/model.slice';
import { createSettingsSlice, SettingsSlice } from './slices/settings.slice';
import { createViewModeSlice, ViewModeSlice } from './slices/view-mode.slice';

export type Store = ModelSlice &
  MeshSlice &
  SettingsSlice &
  CameraSlice &
  ViewModeSlice &
  LoadingSlice;

export const useStore = create<Store>()(
  devtools(
    (...a) => ({
      ...createModelSlice(...a),
      ...createMeshSlice(...a),
      ...createSettingsSlice(...a),
      ...createCameraSlice(...a),
      ...createViewModeSlice(...a),
      ...createLoadingSlice(...a),
    }),
    { name: '3DModelViewerStore' }
  )
);
