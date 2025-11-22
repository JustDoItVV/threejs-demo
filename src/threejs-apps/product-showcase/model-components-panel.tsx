'use client';

import { useState, useRef } from 'react';
import * as THREE from 'three';

import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';

import { ModelMesh } from './model-loader';

export interface ComponentMaterialSettings {
  color: string;
  metalness: number;
  roughness: number;
  texture: string | null;
}

interface ModelComponentsPanelProps {
  meshes: ModelMesh[];
  onMeshSelect: (meshId: string | null) => void;
  selectedMeshId: string | null;
  onMaterialChange: (meshId: string, settings: ComponentMaterialSettings) => void;
  currentSettings: Record<string, ComponentMaterialSettings>;
}

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

export function ModelComponentsPanel({
  meshes,
  onMeshSelect,
  selectedMeshId,
  onMaterialChange,
  currentSettings,
}: ModelComponentsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const textureInputRef = useRef<HTMLInputElement>(null);

  const selectedMesh = meshes.find(m => m.id === selectedMeshId);
  const settings = selectedMeshId ? currentSettings[selectedMeshId] : null;

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
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

    // Reset input
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
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
        >
          Components ({meshes.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur border rounded-lg p-4 space-y-4 max-w-sm max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 pb-2">
        <h3 className="font-semibold text-sm">
          Components
          <Badge variant="secondary" className="ml-2 text-[10px]">
            {meshes.length}
          </Badge>
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
          Hide
        </Button>
      </div>

      {meshes.length === 0 ? (
        <p className="text-xs text-muted-foreground">No components found</p>
      ) : (
        <>
          {/* Components List */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Select Component</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {meshes.map((mesh) => (
                <Button
                  key={mesh.id}
                  variant={selectedMeshId === mesh.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onMeshSelect(mesh.id)}
                  className="w-full justify-start text-xs"
                >
                  {mesh.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Material Settings for Selected Component */}
          {selectedMesh && settings && (
            <>
              <div className="border-t pt-3 space-y-3">
                <p className="text-xs font-medium">
                  Editing: <span className="text-primary">{selectedMesh.name}</span>
                </p>

                {/* Material Type Presets */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Material Type</p>
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
                  <p className="text-xs font-medium text-muted-foreground">Color</p>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => selectedMeshId && onMaterialChange(selectedMeshId, { ...settings, color: color.value })}
                        className="h-8 rounded border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color.value,
                          borderColor: settings.color === color.value ? 'hsl(var(--primary))' : 'transparent',
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={settings.color}
                    onChange={(e) => selectedMeshId && onMaterialChange(selectedMeshId, { ...settings, color: e.target.value })}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>

                {/* Metalness Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-muted-foreground">Metalness</span>
                    <span className="text-foreground">{settings.metalness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.metalness}
                    onChange={(e) =>
                      selectedMeshId && onMaterialChange(selectedMeshId, { ...settings, metalness: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>

                {/* Roughness Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-muted-foreground">Roughness</span>
                    <span className="text-foreground">{settings.roughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.roughness}
                    onChange={(e) =>
                      selectedMeshId && onMaterialChange(selectedMeshId, { ...settings, roughness: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>

                {/* Texture Upload */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Custom Texture</p>
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
                      Upload Texture
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
                  <p className="text-[10px] text-muted-foreground">Max size: 10MB</p>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMeshSelect(null)}
                  className="w-full"
                >
                  Deselect Component
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
