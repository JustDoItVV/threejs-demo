'use client';

import { useState, useCallback } from 'react';
import * as THREE from 'three';

import { Stats } from '@react-three/drei';
import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { CameraControls, CameraType } from './camera-controls';
import { Environment } from './environment';
import { UnifiedControls } from './unified-controls';
import { ProductModel } from './product-model';
import { ModelSource, ModelMesh } from './model-loader';
import { ComponentMaterialSettings } from './model-components-panel';

export function ProductShowcase() {
  // Camera state
  const [cameraType, setCameraType] = useState<CameraType>('perspective');
  const [modelBounds, setModelBounds] = useState<THREE.Box3 | null>(null);

  // Model state
  const [modelSource, setModelSource] = useState<ModelSource | null>(null);
  const [currentModelId, setCurrentModelId] = useState<string | null>('iphone-14');
  const [modelError, setModelError] = useState<string | null>(null);

  // Meshes state
  const [meshes, setMeshes] = useState<ModelMesh[]>([]);
  const [selectedMeshId, setSelectedMeshId] = useState<string | null>(null);

  // Component material settings
  const [componentSettings, setComponentSettings] = useState<Record<string, ComponentMaterialSettings>>({});

  // Handle model selection
  const handleModelSelect = useCallback((source: ModelSource) => {
    setModelSource(source);
    setModelError(null);
    setMeshes([]);
    setSelectedMeshId(null);
    setComponentSettings({});

    // Set current model ID based on source
    if (source.type === 'url' && typeof source.data === 'string') {
      if (source.data.includes('iphone')) {
        setCurrentModelId('iphone-14');
      } else {
        setCurrentModelId('custom');
      }
    } else {
      setCurrentModelId('custom');
    }
  }, []);

  // Handle meshes extraction
  const handleMeshesExtracted = useCallback((extractedMeshes: ModelMesh[], boundingBox?: THREE.Box3) => {
    setMeshes(extractedMeshes);

    // Store bounding box if provided
    if (boundingBox) {
      setModelBounds(boundingBox);
    }

    // Initialize default settings for all meshes
    const defaultSettings: Record<string, ComponentMaterialSettings> = {};
    extractedMeshes.forEach((mesh) => {
      // Get current material properties if available
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
  }, []);

  // Handle material change for specific mesh
  const handleMaterialChange = useCallback(
    (meshId: string, settings: ComponentMaterialSettings) => {
      setComponentSettings((prev) => ({
        ...prev,
        [meshId]: settings,
      }));
    },
    []
  );

  // Handle load error
  const handleLoadError = useCallback((error: string) => {
    setModelError(error);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <CanvasWrapper>
        <Environment />
        <CameraControls cameraType={cameraType} onCameraTypeChange={setCameraType} modelBounds={modelBounds} />
        <ProductModel
          modelSource={modelSource}
          onMeshesExtracted={handleMeshesExtracted}
          onLoadError={handleLoadError}
          componentSettings={componentSettings}
          selectedMeshId={selectedMeshId}
          removeScreenForIPhone={true}
        />
        {/* Performance Stats */}
        <Stats className="stats-panel" />
      </CanvasWrapper>

      {/* Unified Controls Panel */}
      <UnifiedControls
        onModelSelect={handleModelSelect}
        currentModel={currentModelId}
        modelError={modelError}
        cameraType={cameraType}
        onCameraTypeChange={setCameraType}
        meshes={meshes}
        selectedMeshId={selectedMeshId}
        onMeshSelect={setSelectedMeshId}
        currentSettings={componentSettings}
        onMaterialChange={handleMaterialChange}
        modelBounds={modelBounds}
      />
    </div>
  );
}
