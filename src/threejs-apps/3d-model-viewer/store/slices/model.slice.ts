import * as THREE from 'three';
import { StateCreator } from 'zustand';

import { MeshMaterialSettings, ModelSource } from '../../types';

export interface ModelSlice {
  source: ModelSource | null;
  modelId: string | null;
  modelLoadError: string;
  modelBounds: THREE.Box3 | null;
  componentsSettings: Record<string, MeshMaterialSettings>;
  setSource: (source: ModelSource) => void;
  setModelLoadError: (error: string) => void;
  setModelBounds: (box: THREE.Box3 | null) => void;
  setComponentsSettings: (
    settings:
      | Record<string, MeshMaterialSettings>
      | ((prev: Record<string, MeshMaterialSettings>) => Record<string, MeshMaterialSettings>)
  ) => void;
}

export const createModelSlice: StateCreator<
  ModelSlice,
  [],
  [],
  ModelSlice
> = (set) => ({
  source: null,
  modelId: null,
  modelLoadError: '',
  modelBounds: null,
  componentsSettings: {},

  setSource: (source) => {
    const modelId =
      source.type === 'file' && source.file
        ? `file-${source.file.name}-${source.file.size}-${Date.now()}`
        : source.type === 'url' && source.url
        ? `url-${source.url}-${Date.now()}`
        : `unknown-${Date.now()}`;

    set({ source: { ...source }, modelId });
  },

  setModelLoadError: (error) => set({ modelLoadError: error }),

  setModelBounds: (box) => set({ modelBounds: box }),

  setComponentsSettings: (settings) =>
    set((state) => ({
      componentsSettings:
        typeof settings === 'function' ? settings(state.componentsSettings) : settings,
    })),
});
