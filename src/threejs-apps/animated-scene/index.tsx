'use client';

import { useState } from 'react';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { ViewModeControls } from '../../components/three/view-mode-controls';
import { ViewMode } from '../../types/view-mode';
import { AnimatedTorus } from './animated-torus';
import { ControlsPanel } from './controls-panel';
import { Particles } from './particles';
import { SceneLighting } from './scene-lighting';

export function AnimatedScene() {
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
        <color attach="background" args={['#0a0a0a']} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <SceneLighting />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <AnimatedTorus />
        <Particles count={3000} />
      </CanvasWrapper>
      <ControlsPanel />
      <ViewModeControls
        viewMode={viewMode}
        onToggleFullWindow={toggleFullWindow}
        onToggleFullscreen={toggleFullscreen}
        onSetViewMode={setViewMode}
      />
    </div>
  );
}
