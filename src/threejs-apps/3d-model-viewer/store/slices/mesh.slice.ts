import { StateCreator } from 'zustand';

import { ModelMesh } from '../../types';

export interface MeshSlice {
  meshes: ModelMesh[];
  meshId: string | null;
  setMeshes: (meshes: ModelMesh[]) => void;
  setMeshId: (id: string | null) => void;
}

export const createMeshSlice: StateCreator<
  MeshSlice,
  [],
  [],
  MeshSlice
> = (set) => ({
  meshes: [],
  meshId: null,

  setMeshes: (meshes) => set({ meshes: [...meshes] }),

  setMeshId: (id) => set({ meshId: id }),
});
