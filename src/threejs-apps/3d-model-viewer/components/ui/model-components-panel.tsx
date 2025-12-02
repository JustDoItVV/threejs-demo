'use client';

import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

import { MATERIAL_TYPES, PRESET_COLORS } from '../../const';
import { useStore } from '../../store';
import { MeshMaterialSettings } from '../../types';
import { throttle } from '../../utils/debounce';

export function ModelComponentsPanel() {
  const meshes = useStore((state) => state.meshes);
  const meshId = useStore((state) => state.meshId);
  const setMeshId = useStore((state) => state.setMeshId);
  const componentsSettings = useStore((state) => state.componentsSettings);
  const setComponentsSettings = useStore((state) => state.setComponentsSettings);

  const textureInputRef = useRef<HTMLInputElement>(null);

  const handleMaterialChange = useCallback(
    (meshId: string, settings: MeshMaterialSettings) => {
      setComponentsSettings((prev) => ({
        ...prev,
        [meshId]: settings,
      }));
    },
    [setComponentsSettings]
  );

  const throttledColorChange = useRef(
    throttle((meshId: string, settings: MeshMaterialSettings) => {
      setComponentsSettings((prev) => ({
        ...prev,
        [meshId]: settings,
      }));
    }, 16) // Update at most every 16ms (~60 fps)
  );

  const selectedMesh = meshes.find((m) => m.id === meshId);

  const settings = meshId
    ? componentsSettings[meshId] || {
        color: '#3b82f6',
        metalness: 0.5,
        roughness: 0.5,
        texture: null,
      }
    : null;

  useEffect(() => {
    if (meshId && !componentsSettings[meshId]) {
      const mesh = meshes.find((m) => m.id === meshId);
      if (mesh) {
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

        setComponentsSettings((prev) => ({
          ...prev,
          [meshId]: { color, metalness, roughness, texture: null },
        }));
      }
    }
  }, [meshId, componentsSettings, meshes, setComponentsSettings]);

  const handleMaterialTypeSelect = (type: string) => {
    if (!meshId || !settings) return;

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

    handleMaterialChange(meshId, newSettings);
  };

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!meshId || !settings) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleMaterialChange(meshId, {
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
    if (!meshId || !settings) return;
    handleMaterialChange(meshId, {
      ...settings,
      texture: null,
    });
  };

  return (
    <div className="bg-background/95 backdrop-blur border rounded-lg p-4 space-y-4 max-w-sm max-h-[80vh] overflow-y-auto">
      <h3 className="font-semibold text-md py-1">
        Components
        <Badge variant="secondary" className="ml-2 text-[10px]">
          {meshes.length}
        </Badge>
      </h3>

      {meshes.length === 0 ? (
        <p className="text-xs text-muted-foreground">No components found</p>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Select Component</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {meshes.map((mesh) => (
                <Button
                  key={mesh.id}
                  variant={meshId === mesh.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMeshId(mesh.id)}
                  className="w-full justify-start text-xs"
                >
                  {mesh.name}
                </Button>
              ))}
            </div>
          </div>

          {selectedMesh && settings && (
            <>
              <div className="border-t pt-3 space-y-3">
                <p className="text-xs font-medium">
                  Editing: <span className="text-primary">{selectedMesh.name}</span>
                </p>

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

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Color</p>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          meshId &&
                          handleMaterialChange(meshId, { ...settings, color: color.value })
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
                      meshId &&
                      throttledColorChange.current(meshId, { ...settings, color: e.target.value })
                    }
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>

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
                    onChange={(e) => {
                      if (!meshId) return;
                      handleMaterialChange(meshId, {
                        ...settings,
                        metalness: parseFloat(e.target.value),
                      });
                    }}
                    className="w-full"
                  />
                </div>

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
                    onChange={(e) => {
                      if (!meshId) return;
                      handleMaterialChange(meshId, {
                        ...settings,
                        roughness: parseFloat(e.target.value),
                      });
                    }}
                    className="w-full"
                  />
                </div>

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
                      {/* eslint-disable-next-line @next/next/no-img-element -- need for uploading textures */}
                      <img
                        src={settings.texture}
                        alt="Texture preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground">Max size: 10MB</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMeshId(null)}
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
