import * as THREE from 'three';

export type ModelFormat = 'gltf' | 'glb' | 'fbx' | 'obj';

export interface ModelSource {
  type: 'url' | 'file';
  format: ModelFormat;
  url?: string;
  file: File | null;
}

export interface DefaultModel {
  id: string;
  name: string;
  url: string;
  format: ModelFormat;
  size: string;
}

export interface ModelMesh {
  id: string;
  name: string;
  mesh: THREE.Mesh;
  originalMaterial: THREE.Material | THREE.Material[];
}

export interface MeshMaterialSettings {
  color: string;
  metalness: number;
  roughness: number;
  texture: string | null;
}
