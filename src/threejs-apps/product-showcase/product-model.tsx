import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { getAssetPath } from '@/ui/utils';
import { useGLTF } from '@react-three/drei';

import { MaterialSettings } from './index';
import { PhoneScreenMesh } from './phone-screen-mesh';

interface ProductModelProps {
  materialSettings: MaterialSettings;
  showScreenUI: boolean;
}

export function ProductModel({ materialSettings, showScreenUI }: ProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const modelPath = getAssetPath('/models/iphone-14/iPhone 14 pro.glb');
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    if (!scene) return;

    // Apply material settings to ALL meshes (excluding screen/camera/glass)
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Skip screen, camera lenses, and glass elements
        const isExcluded = child.material
          ? child.material.name.includes('screen') ||
            child.material.name.includes('display') ||
            child.material.name.includes('glass') ||
            child.material.name.includes('lens') ||
            child.material.name.includes('metal') ||
            child.material.name.includes('controls') ||
            child.material.name.includes('black') ||
            child.material.name.includes('notch') ||
            child.material.name.includes('camera')
          : false;

        if (child.material && !isExcluded) {
          // Handle both single material and material array
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.color = new THREE.Color(materialSettings.color);
                mat.metalness = materialSettings.metalness;
                mat.roughness = materialSettings.roughness;
                mat.needsUpdate = true;
              }
            });
          } else if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.color = new THREE.Color(materialSettings.color);
            child.material.metalness = materialSettings.metalness;
            child.material.roughness = materialSettings.roughness;
            child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, materialSettings]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={2}>
      <primitive object={scene} />
      {/* Interactive phone screen as 3D mesh with canvas texture */}
      {showScreenUI && (
        <PhoneScreenMesh position={[0.04, 1.04, 0.11]} rotation={[0, 0, 0]} scale={9.3} />
      )}
    </group>
  );
}

// Preload модели
const modelPath = getAssetPath('/models/iphone-14/iPhone 14 pro.glb');
useGLTF.preload(modelPath);
