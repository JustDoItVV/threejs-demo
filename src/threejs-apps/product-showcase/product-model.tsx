import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { getAssetPath } from '@/ui/utils';
import { useGLTF } from '@react-three/drei';

import { ModelLoader, ModelSource, ModelMesh } from './model-loader';
import { ComponentMaterialSettings } from './model-components-panel';

interface ProductModelProps {
  modelSource: ModelSource | null;
  onMeshesExtracted?: (meshes: ModelMesh[], boundingBox?: THREE.Box3) => void;
  onLoadError?: (error: string) => void;
  componentSettings: Record<string, ComponentMaterialSettings>;
  selectedMeshId: string | null;
  removeScreenForIPhone?: boolean;
}

export function ProductModel({
  modelSource,
  onMeshesExtracted,
  onLoadError,
  componentSettings,
  selectedMeshId,
  removeScreenForIPhone = true,
}: ProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textureLoader = useRef(new THREE.TextureLoader());
  const loadedTextures = useRef<Map<string, THREE.Texture>>(new Map());

  // Apply material settings to meshes
  useEffect(() => {
    if (!groupRef.current) return;

    Object.entries(componentSettings).forEach(([meshId, settings]) => {
      // Find mesh by traversing the entire group
      let foundMesh: THREE.Mesh | null = null;
      groupRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.meshId === meshId) {
          foundMesh = child;
        }
      });

      if (!foundMesh) return;

      // Handle texture loading
      const mesh = foundMesh;
      if (settings.texture) {
        // Check if texture is already loaded
        if (!loadedTextures.current.has(settings.texture)) {
          textureLoader.current.load(
            settings.texture,
            (texture) => {
              loadedTextures.current.set(settings.texture!, texture);
              applyMaterialSettings(mesh, settings, texture);
            },
            undefined,
            (error) => {
              console.error('Failed to load texture:', error);
              applyMaterialSettings(mesh, settings, null);
            }
          );
        } else {
          const texture = loadedTextures.current.get(settings.texture);
          applyMaterialSettings(mesh, settings, texture || null);
        }
      } else {
        applyMaterialSettings(mesh, settings, null);
      }
    });
  }, [componentSettings]);

  // Highlight selected mesh
  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = Array.isArray(child.material) ? child.material[0] : child.material;

        if (child.userData.meshId === selectedMeshId) {
          // Highlight selected mesh
          if (material instanceof THREE.MeshStandardMaterial) {
            child.userData.originalEmissive = child.userData.originalEmissive || material.emissive?.clone();
            if (material.emissive) {
              material.emissive = new THREE.Color(0x444444);
              material.emissiveIntensity = 0.2;
            }
          }
        } else {
          // Restore original emissive
          if (material instanceof THREE.MeshStandardMaterial) {
            if (child.userData.originalEmissive && material.emissive) {
              material.emissive = child.userData.originalEmissive;
              material.emissiveIntensity = 0;
            }
          }
        }

        if (material) {
          material.needsUpdate = true;
        }
      }
    });
  }, [selectedMeshId]);

  const handleMeshesExtracted = (meshes: ModelMesh[]) => {
    // Remove screen component for iPhone model if requested
    let filteredMeshes = meshes;

    if (removeScreenForIPhone && modelSource?.type === 'url' &&
        typeof modelSource.data === 'string' &&
        modelSource.data.includes('iphone')) {
      filteredMeshes = meshes.filter((mesh) => {
        const name = mesh.name.toLowerCase();
        return !name.includes('screen') &&
               !name.includes('display') &&
               !name.includes('glass') &&
               !name.includes('ui');
      });

      // Also remove the actual meshes from the scene
      meshes.forEach((mesh) => {
        const name = mesh.name.toLowerCase();
        if (name.includes('screen') || name.includes('display') ||
            name.includes('glass') || name.includes('ui')) {
          mesh.mesh.visible = false;
        }
      });
    }

    // Store mesh IDs in userData for easy lookup
    filteredMeshes.forEach((meshData) => {
      meshData.mesh.userData.meshId = meshData.id;
    });

    // Calculate bounding box for the entire model
    const boundingBox = new THREE.Box3();
    filteredMeshes.forEach((meshData) => {
      const meshBox = new THREE.Box3().setFromObject(meshData.mesh);
      boundingBox.union(meshBox);
    });

    onMeshesExtracted?.(filteredMeshes, boundingBox);
  };

  if (!modelSource) {
    // Load default iPhone model
    return <DefaultIPhoneModel removeScreen={removeScreenForIPhone} onMeshesExtracted={handleMeshesExtracted} />;
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={2}>
      <ModelLoader source={modelSource} onMeshesExtracted={handleMeshesExtracted} onLoadError={onLoadError}>
        {(scene) => <primitive object={scene} />}
      </ModelLoader>
    </group>
  );
}

// Helper function to apply material settings
function applyMaterialSettings(
  mesh: THREE.Mesh,
  settings: ComponentMaterialSettings,
  texture: THREE.Texture | null
) {
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;

  if (material instanceof THREE.MeshStandardMaterial) {
    material.color = new THREE.Color(settings.color);
    material.metalness = settings.metalness;
    material.roughness = settings.roughness;

    if (texture) {
      material.map = texture;
      material.needsUpdate = true;
    } else if (material.map) {
      material.map = null;
      material.needsUpdate = true;
    }
  }
}

// Default iPhone model component
interface DefaultIPhoneModelProps {
  removeScreen: boolean;
  onMeshesExtracted: (meshes: ModelMesh[], boundingBox?: THREE.Box3) => void;
}

function DefaultIPhoneModel({ removeScreen, onMeshesExtracted }: DefaultIPhoneModelProps) {
  const modelPath = getAssetPath('/models/iphone-14/iPhone 14 pro.glb');
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!scene) return;

    // Extract meshes
    const meshes: ModelMesh[] = [];
    let counter = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const id = `mesh_${counter++}`;
        const name = child.name || `Mesh ${counter}`;

        // Skip screen components if removeScreen is true
        if (removeScreen) {
          const lowerName = name.toLowerCase();
          if (lowerName.includes('screen') || lowerName.includes('display') ||
              lowerName.includes('glass') || lowerName.includes('ui')) {
            child.visible = false;
            return;
          }
        }

        child.userData.meshId = id;

        meshes.push({
          id,
          name,
          mesh: child,
          originalMaterial: Array.isArray(child.material)
            ? child.material.map((m) => m.clone())
            : child.material.clone(),
        });
      }
    });

    // Calculate bounding box
    const boundingBox = new THREE.Box3();
    meshes.forEach((meshData) => {
      const meshBox = new THREE.Box3().setFromObject(meshData.mesh);
      boundingBox.union(meshBox);
    });

    onMeshesExtracted(meshes, boundingBox);
  }, [scene, removeScreen, onMeshesExtracted]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={2}>
      <primitive object={scene} />
    </group>
  );
}

// Preload default model
const modelPath = getAssetPath('/models/iphone-14/iPhone 14 pro.glb');
useGLTF.preload(modelPath);
