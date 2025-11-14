import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';

export type ModelFormat = 'gltf' | 'glb' | 'fbx' | 'obj';

export interface ModelSource {
  type: 'url' | 'file';
  data: string | File;
  format: ModelFormat;
}

export interface ModelMesh {
  id: string;
  name: string;
  mesh: THREE.Mesh;
  originalMaterial: THREE.Material | THREE.Material[];
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

// Validate file format and size
export function validateModelFile(file: File): { valid: boolean; error?: string; format?: ModelFormat } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 2GB limit (${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB)` };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validFormats: Record<string, ModelFormat> = {
    'gltf': 'gltf',
    'glb': 'glb',
    'fbx': 'fbx',
    'obj': 'obj',
  };

  if (!extension || !validFormats[extension]) {
    return { valid: false, error: `Unsupported file format: ${extension}. Supported formats: GLB, GLTF, FBX, OBJ` };
  }

  return { valid: true, format: validFormats[extension] };
}

// Validate URL format
export function validateModelUrl(url: string): { valid: boolean; error?: string; format?: ModelFormat } {
  try {
    new URL(url);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  const extension = url.split('.').pop()?.toLowerCase().split('?')[0];
  const validFormats: Record<string, ModelFormat> = {
    'gltf': 'gltf',
    'glb': 'glb',
    'fbx': 'fbx',
    'obj': 'obj',
  };

  if (!extension || !validFormats[extension]) {
    return { valid: false, error: `Cannot determine model format from URL. Please ensure URL ends with .glb, .gltf, .fbx, or .obj` };
  }

  return { valid: true, format: validFormats[extension] };
}

// Extract meshes from loaded model
export function extractMeshes(object: THREE.Object3D): ModelMesh[] {
  const meshes: ModelMesh[] = [];
  let counter = 0;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const id = `mesh_${counter++}`;
      const name = child.name || `Mesh ${counter}`;

      meshes.push({
        id,
        name,
        mesh: child,
        originalMaterial: Array.isArray(child.material)
          ? child.material.map(m => m.clone())
          : child.material.clone(),
      });
    }
  });

  return meshes;
}

// Hook for loading GLTF/GLB models from URL
function useGLTFModel(url: string | null) {
  const { scene } = useGLTF(url || '', true);
  return scene;
}

// Hook for loading FBX models from URL
function useFBXModel(url: string | null) {
  const model = useLoader(FBXLoader, url || '');
  return model;
}

// Hook for loading OBJ models from URL
function useOBJModel(url: string | null) {
  const model = useLoader(OBJLoader, url || '');
  return model;
}

// Main model loader component
interface ModelLoaderProps {
  source: ModelSource | null;
  onMeshesExtracted?: (meshes: ModelMesh[]) => void;
  onLoadError?: (error: string) => void;
  children?: (scene: THREE.Object3D) => React.ReactNode;
}

export function ModelLoader({ source, onMeshesExtracted, onLoadError, children }: ModelLoaderProps) {
  const [scene, setScene] = useState<THREE.Object3D | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Load model based on source type and format
  useEffect(() => {
    if (!source) {
      setScene(null);
      setObjectUrl(null);
      return;
    }

    async function loadModel() {
      if (!source) return;

      try {
        if (source.type === 'file' && source.data instanceof File) {
          // Create object URL from file
          const url = URL.createObjectURL(source.data);
          setObjectUrl(url);
        } else if (source.type === 'url' && typeof source.data === 'string') {
          setObjectUrl(source.data);
        }
      } catch (error) {
        onLoadError?.(`Failed to load model: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    loadModel();

    // Cleanup
    return () => {
      if (objectUrl && source.type === 'file') {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [source]);

  // Load model using appropriate loader
  let loadedScene: THREE.Object3D | null = null;

  try {
    if (objectUrl) {
      if (source?.format === 'gltf' || source?.format === 'glb') {
        loadedScene = useGLTFModel(objectUrl);
      } else if (source?.format === 'fbx') {
        loadedScene = useFBXModel(objectUrl);
      } else if (source?.format === 'obj') {
        loadedScene = useOBJModel(objectUrl);
      }
    }
  } catch (error) {
    onLoadError?.(`Failed to parse model: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Extract meshes when scene is loaded
  useEffect(() => {
    if (loadedScene) {
      setScene(loadedScene);
      const meshes = extractMeshes(loadedScene);
      onMeshesExtracted?.(meshes);
    }
  }, [loadedScene, onMeshesExtracted]);

  if (!scene) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {children ? children(scene) : <primitive object={scene} />}
    </group>
  );
}
