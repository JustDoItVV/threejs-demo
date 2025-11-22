'use client';

import { useState, useRef } from 'react';
import * as THREE from 'three';

import { getAssetPath } from '@/ui/utils';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';

import { CameraType } from './camera-controls';
import { ModelSource, validateModelFile, validateModelUrl } from './model-loader';
import { ModelMesh } from './model-loader';
import { ComponentMaterialSettings } from './model-components-panel';

export interface DefaultModel {
  id: string;
  name: string;
  url: string;
  format: 'glb' | 'gltf' | 'fbx' | 'obj';
}

const DEFAULT_MODELS: DefaultModel[] = [
  {
    id: 'iphone-14',
    name: 'iPhone 14 Pro',
    url: getAssetPath('/models/iphone-14/iPhone-14-pro.glb'),
    format: 'glb',
  },
];

const MATERIAL_TYPES = [
  { name: 'Standard', value: 'standard' },
  { name: 'Metallic', value: 'metallic' },
  { name: 'Matte', value: 'matte' },
  { name: 'Glossy', value: 'glossy' },
];

const PRESET_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Black', value: '#1a1a1a' },
  { name: 'White', value: '#f0f0f0' },
  { name: 'Gold', value: '#ffd700' },
  { name: 'Silver', value: '#c0c0c0' },
];

declare global {
  interface Window {
    moveCameraTo: (position: [number, number, number], target?: [number, number, number]) => void;
  }
}

interface UnifiedControlsProps {
  // Model loading
  onModelSelect: (source: ModelSource) => void;
  currentModel: string | null;
  modelError: string | null;

  // Camera
  cameraType: CameraType;
  onCameraTypeChange: (type: CameraType) => void;
  modelBounds?: THREE.Box3 | null;

  // Components
  meshes: ModelMesh[];
  selectedMeshId: string | null;
  onMeshSelect: (meshId: string | null) => void;
  currentSettings: Record<string, ComponentMaterialSettings>;
  onMaterialChange: (meshId: string, settings: ComponentMaterialSettings) => void;
}

export function UnifiedControls({
  onModelSelect,
  currentModel,
  modelError,
  cameraType,
  onCameraTypeChange,
  modelBounds,
  meshes,
  selectedMeshId,
  onMeshSelect,
  currentSettings,
  onMaterialChange,
}: UnifiedControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textureInputRef = useRef<HTMLInputElement>(null);

  const selectedMesh = meshes.find((m) => m.id === selectedMeshId);
  const settings = selectedMeshId ? currentSettings[selectedMeshId] : null;

  // Model loading handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateModelFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    onModelSelect({
      type: 'file',
      data: file,
      format: validation.format!,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlLoad = () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    const validation = validateModelUrl(urlInput);
    if (!validation.valid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setError(null);
    onModelSelect({
      type: 'url',
      data: urlInput,
      format: validation.format!,
    });
    setUrlInput('');
  };

  const handleDefaultModelSelect = (model: DefaultModel) => {
    setError(null);
    onModelSelect({
      type: 'url',
      data: model.url,
      format: model.format,
    });
  };

  // Camera handlers
  const handleCameraPreset = (preset: string) => {
    if (typeof window === 'undefined' || !window.moveCameraTo) return;

    // Use dynamic positions based on model bounds if available
    if (modelBounds) {
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      modelBounds.getCenter(center);
      modelBounds.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 1.5;

      switch (preset) {
        case 'front':
          window.moveCameraTo(
            [center.x, center.y, center.z + distance],
            [center.x, center.y, center.z]
          );
          break;
        case 'side':
          window.moveCameraTo(
            [center.x + distance, center.y, center.z],
            [center.x, center.y, center.z]
          );
          break;
        case 'top':
          window.moveCameraTo(
            [center.x, center.y + distance, center.z + maxDim * 0.1],
            [center.x, center.y, center.z]
          );
          break;
        case 'angle':
          window.moveCameraTo(
            [center.x + distance * 0.5, center.y + distance * 0.5, center.z + distance],
            [center.x, center.y, center.z]
          );
          break;
      }
    } else {
      // Fallback to default positions
      switch (preset) {
        case 'front':
          window.moveCameraTo([0, 2.1, 6], [0, 2.1, 0]);
          break;
        case 'side':
          window.moveCameraTo([6, 2.1, 0], [0, 2.1, 0]);
          break;
        case 'top':
          window.moveCameraTo([0, 6, 0.1], [0, 0, 0]);
          break;
        case 'angle':
          window.moveCameraTo([3, 3, 6], [0, 2.1, 0]);
          break;
      }
    }
  };

  // Material handlers
  const handleMaterialTypeSelect = (type: string) => {
    if (!selectedMeshId || !settings) return;

    let newSettings = { ...settings };
    switch (type) {
      case 'metallic':
        newSettings = { ...newSettings, metalness: 1.0, roughness: 0.1 };
        break;
      case 'matte':
        newSettings = { ...newSettings, metalness: 0.0, roughness: 1.0 };
        break;
      case 'glossy':
        newSettings = { ...newSettings, metalness: 0.2, roughness: 0.1 };
        break;
      case 'standard':
        newSettings = { ...newSettings, metalness: 0.5, roughness: 0.5 };
        break;
    }

    onMaterialChange(selectedMeshId, newSettings);
  };

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedMeshId || !settings) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onMaterialChange(selectedMeshId, {
        ...settings,
        texture: dataUrl,
      });
    };
    reader.readAsDataURL(file);

    if (textureInputRef.current) {
      textureInputRef.current.value = '';
    }
  };

  const handleRemoveTexture = () => {
    if (!selectedMeshId || !settings) return;
    onMaterialChange(selectedMeshId, {
      ...settings,
      texture: null,
    });
  };

  if (!isExpanded) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)}>
          Show Controls
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 bottom-4 z-10 w-80 flex flex-col">
      <div className="bg-background/95 backdrop-blur border rounded-lg flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Controls</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            Hide
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Error Display */}
          {(error || modelError) && (
            <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
              {error || modelError}
            </div>
          )}

          {/* Model Loading Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Load Model</h4>

            {/* Default Models */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Default Models</p>
              {DEFAULT_MODELS.map((model) => (
                <Button
                  key={model.id}
                  variant={currentModel === model.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDefaultModelSelect(model)}
                  className="w-full justify-start"
                >
                  <span className="flex-1 text-left">{model.name}</span>
                  <Badge variant="secondary" className="text-[10px] ml-2">
                    {model.format.toUpperCase()}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Upload File</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf,.fbx,.obj"
                onChange={handleFileUpload}
                className="hidden"
                id="model-file-input"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Choose File
              </Button>
              <p className="text-[10px] text-muted-foreground">Supported: GLB, GLTF, FBX, OBJ (max 2GB)</p>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Load from URL</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlLoad()}
                  placeholder="https://example.com/model.glb"
                  className="flex-1 px-2 py-1 text-xs border rounded bg-background"
                />
                <Button variant="outline" size="sm" onClick={handleUrlLoad}>
                  Load
                </Button>
              </div>
            </div>
          </div>

          {/* Camera Section */}
          <div className="space-y-3 pt-3 border-t">
            <h4 className="font-medium text-sm">Camera</h4>

            {/* Camera Type */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Type</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={cameraType === 'perspective' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onCameraTypeChange('perspective')}
                >
                  Perspective
                </Button>
                <Button
                  variant={cameraType === 'orthographic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onCameraTypeChange('orthographic')}
                >
                  Ortho
                </Button>
              </div>
            </div>

            {/* Camera Presets */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Views</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCameraPreset('front')}>
                  Front
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCameraPreset('side')}>
                  Side
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCameraPreset('top')}>
                  Top
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCameraPreset('angle')}>
                  Angle
                </Button>
              </div>
            </div>
          </div>

          {/* Components Section */}
          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Components</h4>
              <Badge variant="secondary" className="text-[10px]">
                {meshes.length}
              </Badge>
            </div>

            {meshes.length === 0 ? (
              <p className="text-xs text-muted-foreground">No components found</p>
            ) : (
              <>
                {/* Components List */}
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {meshes.map((mesh) => (
                    <Button
                      key={mesh.id}
                      variant={selectedMeshId === mesh.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onMeshSelect(mesh.id)}
                      className="w-full justify-start text-xs truncate"
                      title={mesh.name}
                    >
                      {mesh.name}
                    </Button>
                  ))}
                </div>

                {/* Material Settings for Selected Component */}
                {selectedMesh && settings && selectedMeshId && (
                  <div className="space-y-3 pt-3 border-t">
                    <p className="text-xs font-medium">
                      Editing: <span className="text-primary">{selectedMesh.name}</span>
                    </p>

                    {/* Material Type Presets */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Material Type</p>
                      <div className="grid grid-cols-2 gap-2">
                        {MATERIAL_TYPES.map((type) => (
                          <Button
                            key={type.value}
                            variant="outline"
                            size="sm"
                            onClick={() => handleMaterialTypeSelect(type.value)}
                            className="text-xs"
                          >
                            {type.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Color</p>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() =>
                              onMaterialChange(selectedMeshId, { ...settings, color: color.value })
                            }
                            className="h-8 rounded border-2 transition-all hover:scale-110"
                            style={{
                              backgroundColor: color.value,
                              borderColor:
                                settings.color === color.value ? 'hsl(var(--primary))' : 'transparent',
                            }}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={settings.color}
                        onChange={(e) =>
                          onMaterialChange(selectedMeshId, { ...settings, color: e.target.value })
                        }
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>

                    {/* Metalness Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Metalness</span>
                        <span>{settings.metalness.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={settings.metalness}
                        onChange={(e) =>
                          onMaterialChange(selectedMeshId, {
                            ...settings,
                            metalness: parseFloat(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Roughness Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Roughness</span>
                        <span>{settings.roughness.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={settings.roughness}
                        onChange={(e) =>
                          onMaterialChange(selectedMeshId, {
                            ...settings,
                            roughness: parseFloat(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Texture Upload */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Custom Texture</p>
                      <input
                        ref={textureInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleTextureUpload}
                        className="hidden"
                        id="texture-file-input"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => textureInputRef.current?.click()}
                          className="flex-1"
                        >
                          Upload
                        </Button>
                        {settings.texture && (
                          <Button variant="destructive" size="sm" onClick={handleRemoveTexture}>
                            Remove
                          </Button>
                        )}
                      </div>
                      {settings.texture && (
                        <div className="relative w-full h-20 border rounded overflow-hidden">
                          <img
                            src={settings.texture}
                            alt="Texture preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Deselect Button */}
                    <Button variant="outline" size="sm" onClick={() => onMeshSelect(null)} className="w-full">
                      Deselect Component
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="pt-3 border-t space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] px-1">
                Drag
              </Badge>
              <span>Rotate camera</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] px-1">
                Scroll
              </Badge>
              <span>Zoom {cameraType === 'orthographic' ? '(scale)' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
