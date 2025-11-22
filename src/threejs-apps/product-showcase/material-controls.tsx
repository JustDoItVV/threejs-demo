'use client';

import { useState } from 'react';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

import { CameraType } from './camera-controls';

declare global {
  interface Window {
    moveCameraTo: (position: [number, number, number], target?: [number, number, number]) => void;
    disableOrbitControls: () => void;
    enableOrbitControls: () => void;
    toggleCameraType: () => void;
  }
}

interface MaterialControlsProps {
  cameraType: CameraType;
  onCameraTypeChange: (type: CameraType) => void;
}

export function MaterialControls({ cameraType, onCameraTypeChange }: MaterialControlsProps) {
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

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-10"
        onClick={() => setIsVisible(true)}
      >
        Camera Controls
      </Button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur border rounded-lg p-4 space-y-4 max-w-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Camera Controls</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Hide
        </Button>
      </div>

      {/* Camera Type Toggle */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Camera Type</p>
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
            Orthographic
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          {cameraType === 'perspective'
            ? 'Realistic view with depth perspective'
            : 'Technical view without distortion'}
        </p>
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
          <span>Zoom {cameraType === 'orthographic' ? '(scale)' : ''}</span>
        </div>
      </div>
    </div>
  );
}
