import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useStore } from '../../store';
import { MeshMaterialSettings, ModelMesh } from '../../types';
import { ModelLoader } from './model-loader';

export function LoadedModel() {
  const modelSource = useStore((state) => state.source);
  const meshId = useStore((state) => state.meshId);
  const groupRef = useRef<THREE.Group>(null);
  const textureLoader = useRef(new THREE.TextureLoader());
  const loadedTextures = useRef<Map<string, THREE.Texture>>(new Map());
  const setMeshes = useStore((state) => state.setMeshes);
  const setModelBounds = useStore((state) => state.setModelBounds);
  const componentsSettings = useStore((state) => state.componentsSettings);
  const setComponentSettings = useStore((state) => state.setComponentsSettings);

  const applyMaterialSettings = useCallback(
    (mesh: THREE.Mesh, settings: MeshMaterialSettings, texture: THREE.Texture | null) => {
      const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;

      if (material instanceof THREE.MeshStandardMaterial) {
        const newColor = new THREE.Color(settings.color);
        if (!material.color.equals(newColor)) {
          material.color.copy(newColor);
        }

        if (material.metalness !== settings.metalness) {
          material.metalness = settings.metalness;
        }
        if (material.roughness !== settings.roughness) {
          material.roughness = settings.roughness;
        }

        if (texture) {
          if (material.map !== texture) {
            material.map = texture;
            material.needsUpdate = true;
          }
        } else if (material.map) {
          material.map = null;
          material.needsUpdate = true;
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!groupRef.current) return;

    Object.entries(componentsSettings).forEach(([targetMeshId, settings]) => {
      let foundMesh: THREE.Mesh | null = null;

      groupRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.meshId === targetMeshId) {
          foundMesh = child;
        }
      });

      if (!foundMesh) return;

      const mesh = foundMesh;

      if (settings.texture) {
        const textureUrl = settings.texture;

        if (!loadedTextures.current.has(textureUrl)) {
          textureLoader.current.load(
            textureUrl,
            (texture) => {
              loadedTextures.current.set(textureUrl, texture);
              applyMaterialSettings(mesh, settings, texture);
            },
            undefined,
            (error) => {
              console.error('Failed to load texture:', error);
              applyMaterialSettings(mesh, settings, null);
            }
          );
        } else {
          const texture = loadedTextures.current.get(textureUrl);
          applyMaterialSettings(mesh, settings, texture || null);
        }
      } else {
        applyMaterialSettings(mesh, settings, null);
      }
    });
  }, [componentsSettings, applyMaterialSettings]);

  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = Array.isArray(child.material) ? child.material[0] : child.material;

        if (child.userData.meshId === meshId) {
          if (material instanceof THREE.MeshStandardMaterial) {
            child.userData.originalEmissive =
              child.userData.originalEmissive || material.emissive?.clone();
            material.emissive = new THREE.Color(0x444444);
            material.emissiveIntensity = 0.2;
          }
        } else {
          if (material instanceof THREE.MeshStandardMaterial && child.userData.originalEmissive) {
            material.emissive = child.userData.originalEmissive;
            material.emissiveIntensity = 0;
          }
        }

        if (material) {
          material.needsUpdate = true;
        }
      }
    });
  }, [meshId]);

  const onHandleMeshesExtracted = useCallback(
    (extractedMeshes: ModelMesh[], boundingBox?: THREE.Box3) => {
      setMeshes(extractedMeshes);

      if (boundingBox) {
        setModelBounds(boundingBox);
      }

      const defaultSettings: Record<string, MeshMaterialSettings> = {};
      extractedMeshes.forEach((mesh) => {
        const material = Array.isArray(mesh.mesh.material)
          ? mesh.mesh.material[0]
          : mesh.mesh.material;

        let color = '#3b82f6';
        let metalness = 0.5;
        let roughness = 0.5;

        if (material instanceof THREE.MeshStandardMaterial) {
          if (material.color) {
            color = `#${material.color.getHexString()}`;
          }
          metalness = material.metalness;
          roughness = material.roughness;
        }

        defaultSettings[mesh.id] = {
          color,
          metalness,
          roughness,
          texture: null,
        };
      });

      setComponentSettings(defaultSettings);
    },
    [setComponentSettings, setMeshes, setModelBounds]
  );

  const handleMeshesExtracted = useCallback(
    (meshes: ModelMesh[]) => {
      const filteredMeshes = [...meshes];

      filteredMeshes.forEach((meshData) => {
        meshData.mesh.userData.meshId = meshData.id;
      });

      const boundingBox = new THREE.Box3();
      filteredMeshes.forEach((meshData) => {
        const meshBox = new THREE.Box3().setFromObject(meshData.mesh);
        boundingBox.union(meshBox);
      });

      onHandleMeshesExtracted(filteredMeshes, boundingBox);
    },
    [onHandleMeshesExtracted]
  );

  if (!modelSource) {
    return null;
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={2}>
      <ModelLoader onMeshesExtracted={handleMeshesExtracted}>
        {(scene) => <primitive object={scene} />}
      </ModelLoader>
    </group>
  );
}
