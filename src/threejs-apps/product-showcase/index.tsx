'use client';

import { useState, useCallback } from 'react';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { CameraControls, CameraType } from './camera-controls';
import { Environment } from './environment';
import { MaterialControls } from './material-controls';
import { ModelComponentsPanel, ComponentMaterialSettings } from './model-components-panel';
import { ModelUploadControls } from './model-upload-controls';
import { ProductModel } from './product-model';
import { ModelSource, ModelMesh } from './model-loader';

export function ProductShowcase() {
  // Camera state
  const [cameraType, setCameraType] = useState<CameraType>('perspective');

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
  const handleMeshesExtracted = useCallback((extractedMeshes: ModelMesh[]) => {
    setMeshes(extractedMeshes);

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

      if (material && 'color' in material) {
        color = `#${(material as any).color.getHexString()}`;
      }
      if (material && 'metalness' in material) {
        metalness = (material as any).metalness;
      }
      if (material && 'roughness' in material) {
        roughness = (material as any).roughness;
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
        <CameraControls cameraType={cameraType} onCameraTypeChange={setCameraType} />
        <ProductModel
          modelSource={modelSource}
          onMeshesExtracted={handleMeshesExtracted}
          onLoadError={handleLoadError}
          componentSettings={componentSettings}
          selectedMeshId={selectedMeshId}
          removeScreenForIPhone={true}
        />
      </CanvasWrapper>

      {/* Error Display */}
      {modelError && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg shadow-lg max-w-md">
          <p className="text-sm font-medium">Error loading model</p>
          <p className="text-xs mt-1">{modelError}</p>
        </div>
      )}

      {/* Model Upload Controls - Left Side */}
      <ModelUploadControls onModelSelect={handleModelSelect} currentModel={currentModelId} />

      {/* Camera Controls - Top Right */}
      <MaterialControls cameraType={cameraType} onCameraTypeChange={setCameraType} />

      {/* Model Components Panel - Bottom Right */}
      <ModelComponentsPanel
        meshes={meshes}
        onMeshSelect={setSelectedMeshId}
        selectedMeshId={selectedMeshId}
        onMaterialChange={handleMaterialChange}
        currentSettings={componentSettings}
      />
    </div>
  );
}
