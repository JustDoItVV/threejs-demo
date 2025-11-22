'use client';

import { CanvasWrapper } from '@/components/three/canvas-wrapper';
import { KeyboardControls } from '@react-three/drei';

import { GameScene } from './components/scenes/game.scene';
import { DebugPanel } from './components/ui/debug-panel/debug-panel';
import { GameUI } from './components/ui/game-ui';
import { PerformanceStats } from './components/ui/performans-stats/performance-stats';
import { ViewModeControls } from './components/ui/view-mode-controls';
import { KeyboardMap } from './config/keyboard.config';
import { useStore } from './store';

export function FroggyRoad() {
  const viewMode = useStore((state) => state.viewMode);

  const containerClasses =
    viewMode === 'fullwindow'
      ? 'fixed inset-0 z-50'
      : viewMode === 'fullscreen'
      ? 'relative w-full h-full'
      : 'relative w-full h-full';

  return (
    <div className={containerClasses}>
      <KeyboardControls map={KeyboardMap}>
        <CanvasWrapper>
          <GameScene />
        </CanvasWrapper>
      </KeyboardControls>

      <GameUI />
      <ViewModeControls />
      <DebugPanel />
      <PerformanceStats />
    </div>
  );
}
