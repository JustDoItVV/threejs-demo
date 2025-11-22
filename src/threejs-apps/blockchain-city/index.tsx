'use client';

import { useState } from 'react';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { BlockchainCity } from './components/blockchain-city';
import { CityCamera } from './components/city-camera';
import { BlockDetailsPanel } from './ui/block-details-panel';
import { CityControls } from './ui/city-controls';

export function BlockchainCityVisualization() {
  const [autoTour, setAutoTour] = useState(false);

  return (
    <div className="relative w-full h-full bg-linear-to-b from-gray-950 to-blue-950">
      {/* Three.js Canvas */}
      <CanvasWrapper>
        <color attach="background" args={['#0a0e1a']} />
        <CityCamera autoTour={autoTour} />
        <BlockchainCity />
      </CanvasWrapper>

      {/* UI Controls */}
      <CityControls autoTour={autoTour} onToggleAutoTour={() => setAutoTour(!autoTour)} />

      <BlockDetailsPanel />
    </div>
  );
}
