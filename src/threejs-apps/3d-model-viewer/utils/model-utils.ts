import * as THREE from 'three';

import { ModelFormat, ModelMesh, ModelSource } from '../types';

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export function validateModelFile(file: File): {
  valid: boolean;
  error?: string;
  format?: ModelFormat;
} {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 2GB limit (${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB)`,
    };
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  const validFormats: Record<string, ModelFormat> = {
    gltf: 'gltf',
    glb: 'glb',
    fbx: 'fbx',
    obj: 'obj',
  };

  if (!extension || !validFormats[extension]) {
    return {
      valid: false,
      error: `Unsupported file format: ${extension}. Supported formats: GLB, GLTF, FBX, OBJ`,
    };
  }

  return { valid: true, format: validFormats[extension] };
}

export function validateModelUrl(url: string): {
  valid: boolean;
  error?: string;
  format?: ModelFormat;
  warning?: string;
} {
  try {
    new URL(url);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  const pathname = new URL(url).pathname;
  const extension = pathname.split('.').pop()?.toLowerCase();

  const validFormats: Record<string, ModelFormat> = {
    gltf: 'gltf',
    glb: 'glb',
    fbx: 'fbx',
    obj: 'obj',
  };

  if (extension && validFormats[extension]) {
    return { valid: true, format: validFormats[extension] };
  }

  return {
    valid: true,
    format: 'glb',
    warning: 'Could not determine format from URL. Assuming GLB format. If loading fails, try a direct link with file extension.',
  };
}

export function extractMeshes(object: THREE.Object3D): ModelMesh[] {
  const meshes: ModelMesh[] = [];
  let counter = 0;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const id = `mesh_${counter++}`;
      const name = child.name || `Mesh ${counter}`;

      let originalMaterial: THREE.Material | THREE.Material[];

      if (Array.isArray(child.material)) {
        originalMaterial = child.material.map(material => material.clone());
      } else {
        originalMaterial = child.material.clone();
      }

      meshes.push({
        id,
        name,
        mesh: child,
        originalMaterial,
      });
    }
  });

  return meshes;
}

export function calculateBoundingBox(meshes: ModelMesh[]): THREE.Box3 {
  const boundingBox = new THREE.Box3();

  meshes.forEach((meshData) => {
    const meshBox = new THREE.Box3().setFromObject(meshData.mesh);
    boundingBox.union(meshBox);
  });

  return boundingBox;
}

export function filterScreenMeshes(meshes: ModelMesh[], removeScreen: boolean = true): ModelMesh[] {
  if (!removeScreen) {
    return meshes;
  }

  return meshes.filter((mesh) => {
    const name = mesh.name.toLowerCase();
    return (
      !name.includes('screen') &&
      !name.includes('display') &&
      !name.includes('glass') &&
      !name.includes('ui')
    );
  });
}

export function hideScreenMeshes(scene: THREE.Object3D): void {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const name = child.name.toLowerCase();
      if (
        name.includes('screen') ||
        name.includes('display') ||
        name.includes('glass') ||
        name.includes('ui')
      ) {
        child.visible = false;
      }
    }
  });
}

export function applyMaterialToMesh(
  mesh: THREE.Mesh,
  settings: MeshMaterialSettings,
  texture: THREE.Texture | null = null
): void {
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;

  if (material instanceof THREE.MeshStandardMaterial) {
    material.color = new THREE.Color(settings.color);

    material.metalness = settings.metalness;
    material.roughness = settings.roughness;

    if (texture) {
      material.map = texture;
    } else if (material.map) {
      material.map = null;
    }

    material.needsUpdate = true;
  }
}

export function resetMeshMaterial(mesh: THREE.Mesh, originalMaterial: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(mesh.material) && Array.isArray(originalMaterial)) {
    mesh.material = originalMaterial.map(material => material.clone());
  } else if (!Array.isArray(mesh.material) && !Array.isArray(originalMaterial)) {
    mesh.material = originalMaterial.clone();
  }

  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(mat => mat.needsUpdate = true);
    } else {
      mesh.material.needsUpdate = true;
    }
  }
}

export function highlightMesh(mesh: THREE.Mesh, highlight: boolean = true): void {
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;

  if (material instanceof THREE.MeshStandardMaterial) {
    if (highlight) {
      mesh.userData.originalEmissive = mesh.userData.originalEmissive || material.emissive?.clone();

      material.emissive = new THREE.Color(0x444444);
      material.emissiveIntensity = 0.2;
    } else {
      if (mesh.userData.originalEmissive && material.emissive) {
        material.emissive = mesh.userData.originalEmissive;
        material.emissiveIntensity = 0;
      }
    }

    material.needsUpdate = true;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isFormatSupported(format: string): format is ModelFormat {
  const supportedFormats: ModelFormat[] = ['gltf', 'glb', 'fbx', 'obj'];
  return supportedFormats.includes(format as ModelFormat);
}

export function getFileExtension(filename: string): string | undefined {
  return filename.split('.').pop()?.toLowerCase();
}

export function createModelSourceFromFile(file: File): { source: ModelSource | null; error?: string } {
  const validation = validateModelFile(file);

  if (!validation.valid || !validation.format) {
    return { source: null, error: validation.error || 'Invalid file format' };
  }

  return {
    source: {
      type: 'file' as const,
      format: validation.format,
      file: file,
    }
  };
}

export function createModelSourceFromUrl(url: string): { source: ModelSource | null; error?: string } {
  const validation = validateModelUrl(url);

  if (!validation.valid || !validation.format) {
    return { source: null, error: validation.error || 'Invalid URL format' };
  }

  return {
    source: {
      type: 'url' as const,
      format: validation.format,
      url: url,
      file: null,
    }
  };
}

interface MeshMaterialSettings {
  color: string;
  metalness: number;
  roughness: number;
  texture?: string;
}
