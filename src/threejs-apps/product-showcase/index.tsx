'use client';

import { useState } from 'react';

import { PerspectiveCamera } from '@react-three/drei';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { ViewModeControls } from '../../components/three/view-mode-controls';
import { ViewMode } from '../../types/view-mode';
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
      ? 'fixed inset-0 z-50'
      : viewMode === 'fullscreen'
      ? 'relative w-full h-full'
      : 'relative w-full h-full';

  return (
    <div className={containerClasses}>
      <CanvasWrapper>
        {/* Можно убрать для интересного эффекта что модель разворачивается поверх страницы */}
        <color attach="background" args={['#1a1a1a']} />
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

      <ViewModeControls
        viewMode={viewMode}
        onToggleFullWindow={toggleFullWindow}
        onToggleFullscreen={toggleFullscreen}
        onSetViewMode={setViewMode}
      />
    </div>
  );
}
