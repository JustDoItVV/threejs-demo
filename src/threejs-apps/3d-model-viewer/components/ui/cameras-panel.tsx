'use client';

import { useState } from 'react';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

import { useStore } from '../../store';
import { CameraPreset } from '../../store/slices/camera.slice';

export function CamerasPanel() {
  const cameraType = useStore((state) => state.cameraType);
  const setCameraType = useStore((state) => state.setCameraType);
  const triggerCameraPreset = useStore((state) => state.triggerCameraPreset);

  const [isVisible, setIsVisible] = useState(true);

  const handleCameraPreset = (preset: CameraPreset) => {
    triggerCameraPreset(preset);
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
    <div>
      <h3 className="font-semibold text-md py-1">Camera Controls</h3>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Camera Type</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={cameraType === 'perspective' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCameraType('perspective')}
          >
            Perspective
          </Button>
          <Button
            variant={cameraType === 'orthographic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCameraType('orthographic')}
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
