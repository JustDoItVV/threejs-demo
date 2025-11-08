'use client';

import { useState } from 'react';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

interface ControlsPanelProps {
  onReset?: () => void;
  onExit?: () => void;
}

export function ControlsPanel({ onReset, onExit }: ControlsPanelProps) {
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
        <h3 className="font-semibold text-sm">Game Controls</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Hide
        </Button>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="outline">↑ / W</Badge>
          <span>Move forward</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">← / A</Badge>
          <span>Move left</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">→ / D</Badge>
          <span>Move right</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">R</Badge>
          <span>Restart game</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Esc</Badge>
          <span>Exit to menu</span>
        </div>
      </div>

      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          Cross the road, ride logs across rivers, and avoid cars. Stay on platforms in water or you
          will fall!
        </p>
      </div>
    </div>
  );
}
