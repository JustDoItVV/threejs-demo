'use client';

import { useState } from 'react';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';

interface ControlsPanelProps {
  onReset?: () => void;
}

export function ControlsPanel({ onReset }: ControlsPanelProps) {
  const [isVisible, setIsVisible] = useState(true);

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
    <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur border rounded-lg p-4 space-y-3 max-w-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Scene Controls</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Hide
        </Button>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Drag</Badge>
          <span>Rotate camera</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Scroll</Badge>
          <span>Zoom in/out</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Right-click</Badge>
          <span>Pan camera</span>
        </div>
      </div>

      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          Features: Animated torus with custom shaders, particle system with 1000 particles, orbital
          controls
        </p>
      </div>
    </div>
  );
}
