'use client';

import { useState } from 'react';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { ViewModeControls } from '../../components/three/view-mode-controls';
import { ViewMode } from '../../types/view-mode';
import { BlockchainCity } from './components/blockchain-city';
import { CityCamera } from './components/city-camera';
import { BlockDetailsPanel } from './ui/block-details-panel';
import { CityControls } from './ui/city-controls';

export function BlockchainCityVisualization() {
  const [autoTour, setAutoTour] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('normal');

  const toggleFullWindow = () => {
    if (viewMode === 'fullwindow') {
      setViewMode('normal');
    } else if (viewMode === 'fullscreen') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setViewMode('fullwindow');
    } else {
      setViewMode('fullwindow');
    }
  };

  const toggleFullscreen = () => {
    if (viewMode === 'fullscreen') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setViewMode('normal');
    } else {
      setViewMode('fullscreen');
    }
  };

  const containerClasses =
    viewMode === 'fullwindow'
      ? 'fixed inset-0 z-50 bg-linear-to-b from-gray-950 to-blue-950'
      : viewMode === 'fullscreen'
      ? 'relative w-full h-full bg-linear-to-b from-gray-950 to-blue-950'
      : 'relative w-full h-full bg-linear-to-b from-gray-950 to-blue-950';

  return (
    <div className={containerClasses}>
      {/* Three.js Canvas */}
      <CanvasWrapper>
        <color attach="background" args={['#0a0e1a']} />
        <CityCamera autoTour={autoTour} />
        <BlockchainCity />
      </CanvasWrapper>

      {/* UI Controls */}
      <CityControls autoTour={autoTour} onToggleAutoTour={() => setAutoTour(!autoTour)} />

      <BlockDetailsPanel />

      <ViewModeControls
        viewMode={viewMode}
        onToggleFullWindow={toggleFullWindow}
        onToggleFullscreen={toggleFullscreen}
        onSetViewMode={setViewMode}
      />
    </div>
  );
}
