'use client';

import './style.css';

import { useEffect, useState } from 'react';

import { Stats } from '@react-three/drei';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { ViewModeControls } from '../../components/three/view-mode-controls';
import { MainCamera } from './components/cameras/main-camera';
import { Environment } from './components/lights/environment';
import { LoadedModel } from './components/loaded-model/loaded-model';
import { LoadingOverlay } from './components/ui/loading-overlay';
import { SettingsPanel } from './components/ui/settings-panel';
import { DEFAULT_MODELS } from './const';
import { useStore } from './store';

export function ModelViewer() {
  const [statsContainer, setStatsContainer] = useState<HTMLDivElement | null>(null);

  const viewMode = useStore((state) => state.viewMode);
  const toggleFullWindow = useStore((state) => state.toggleFullWindow);
  const toggleFullscreen = useStore((state) => state.toggleFullscreen);
  const setViewMode = useStore((state) => state.setViewMode);
  const source = useStore((state) => state.source);
  const setSource = useStore((state) => state.setSource);

  useEffect(() => {
    if (!source) {
      const defaultModel = DEFAULT_MODELS[0];
      setSource({
        type: 'url',
        format: defaultModel.format,
        file: null,
        url: defaultModel.url,
      });
    }
  }, [source, setSource]);

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
        <Environment />
        <MainCamera />
        <LoadedModel />
      </CanvasWrapper>

      <div ref={setStatsContainer} className="stats-container absolute top-2 left-2" />
      {statsContainer && <Stats className="stats" parent={{ current: statsContainer }} />}
      <SettingsPanel />

      <ViewModeControls
        viewMode={viewMode}
        onToggleFullWindow={toggleFullWindow}
        onToggleFullscreen={toggleFullscreen}
        onSetViewMode={setViewMode}
      />

      <LoadingOverlay />
    </div>
  );
}
