'use client';

import { useState } from 'react';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

import { MaterialSettings } from './index';

declare global {
  interface Window {
    moveCameraTo: (position: [number, number, number], target?: [number, number, number]) => void;
    disableOrbitControls: () => void;
    enableOrbitControls: () => void;
  }
}

interface MaterialControlsProps {
  settings: MaterialSettings;
  onSettingsChange: (settings: MaterialSettings) => void;
  showScreenUI: boolean;
  onToggleScreenUI: () => void;
}

export function MaterialControls({
  settings,
  onSettingsChange,
  showScreenUI,
  onToggleScreenUI,
}: MaterialControlsProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleCameraPreset = (preset: string) => {
    if (typeof window === 'undefined' || !window.moveCameraTo) return;

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
  };

  const presetColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Black', value: '#1a1a1a' },
    { name: 'White', value: '#f0f0f0' },
  ];

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-10"
        onClick={() => setIsVisible(true)}
      >
        Show Controls
      </Button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur border rounded-lg p-4 space-y-4 max-w-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Product Controls</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Hide
        </Button>
      </div>

      {/* Screen UI Toggle */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Screen UI</p>
        <Button
          variant={showScreenUI ? 'default' : 'outline'}
          size="sm"
          onClick={onToggleScreenUI}
          className="w-full"
        >
          {showScreenUI ? 'Hide Phone Screen' : 'Show Phone Screen'}
        </Button>
      </div>

      {/* Camera Presets */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Camera Views</p>
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

      {/* Color Picker */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Color</p>
        <div className="grid grid-cols-3 gap-2">
          {presetColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onSettingsChange({ ...settings, color: color.value })}
              className="h-8 rounded border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: color.value,
                borderColor: settings.color === color.value ? 'hsl(var(--primary))' : 'transparent',
              }}
              title={color.name}
            />
          ))}
        </div>
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
          onChange={(e) => onSettingsChange({ ...settings, metalness: parseFloat(e.target.value) })}
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
          onChange={(e) => onSettingsChange({ ...settings, roughness: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Instructions */}
      <div className="pt-2 border-t space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1">
            Drag
          </Badge>
          <span>Rotate</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1">
            Scroll
          </Badge>
          <span>Zoom</span>
        </div>
      </div>
    </div>
  );
}
