'use client';

import { useState } from 'react';

import { PerspectiveCamera } from '@react-three/drei';

import { CanvasWrapper } from '../canvas-wrapper';
import { CameraControls } from './camera-controls';
import { Environment } from './environment';
import { MaterialControls } from './material-controls';
import { ProductModel } from './product-model';

export interface MaterialSettings {
  color: string;
  metalness: number;
  roughness: number;
}

export function ProductShowcase() {
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    color: '#3b82f6',
    metalness: 0.8,
    roughness: 0.2,
  });
  const [showScreenUI, setShowScreenUI] = useState(true);

  return (
    <div className="relative w-full h-full">
      <CanvasWrapper>
        <PerspectiveCamera makeDefault position={[3, 3, 6]} fov={50} />
        <Environment />
        <CameraControls />
        <ProductModel materialSettings={materialSettings} showScreenUI={showScreenUI} />
      </CanvasWrapper>

      <MaterialControls
        settings={materialSettings}
        onSettingsChange={setMaterialSettings}
        showScreenUI={showScreenUI}
        onToggleScreenUI={() => setShowScreenUI(!showScreenUI)}
      />
    </div>
  );
}
