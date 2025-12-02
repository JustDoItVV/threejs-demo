'use client';

import { useState } from 'react';

import { Button } from '@/ui/button';

import { CamerasPanel } from './cameras-panel';
import { ModelComponentsPanel } from './model-components-panel';
import { ModelUploadPanel } from './model-upload-panel';

export function SettingsPanel() {
  const [isExpanded, setIsExpanded] = useState(true);

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
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Controls</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            Hide
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <ModelUploadPanel />
          <CamerasPanel />
          <ModelComponentsPanel />
        </div>
      </div>
    </div>
  );
}
