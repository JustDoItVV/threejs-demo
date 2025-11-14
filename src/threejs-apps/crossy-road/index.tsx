'use client';

import { useEffect } from 'react';

import { OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { CanvasWrapper } from '@/components/three/canvas-wrapper';

import { GameScene } from './components/game-scene';
import { useKeyboardControls } from './hooks/use-keyboard-controls';
import { useGameStore } from './store/game-store';
import { DebugPanel } from './ui/debug-panel';
import { GameUI } from './ui/game-ui';
import { PerformanceStats } from './ui/performance-stats';
import { StatsPanel } from './ui/stats-panel';

export function CrossyRoad() {
  const displayMode = useGameStore((state) => state.displayMode);
  const cameraZoom = useGameStore((state) => state.cameraZoom);

  // Initialize keyboard controls
  useKeyboardControls();

  // Handle fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        useGameStore.getState().setDisplayMode('normal');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Calculate canvas dimensions based on display mode
  const canvasStyle =
    displayMode === 'fullWindow'
      ? {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
        }
      : undefined;

  return (
    <div className="relative w-full h-full">
      <div style={canvasStyle}>
        <CanvasWrapper>
          <OrthographicCamera makeDefault position={[300, -300, 300]} zoom={cameraZoom} />
          <GameScene />
        </CanvasWrapper>
      </div>

      {/* UI Overlays */}
      <PerformanceStats />
      <DebugPanel />
      <StatsPanel />
      <GameUI />
    </div>
  );
}
