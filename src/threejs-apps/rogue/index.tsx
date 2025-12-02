'use client';

import { KeyboardControls } from '@react-three/drei';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { ViewModeControls } from '../../components/three/view-mode-controls';
import { ViewMode } from '../../types/view-mode';
import { GameScene } from './components/scenes/game-scene';
import { GameUI } from './components/ui/GameUI';
import { KeyboardMap } from './config/keyboard.config';
import { useStore } from './store';
import { EViewMode } from './types';

export type RogueGameState = 'start' | 'game' | 'backpack' | 'end';

export function RogueGame() {
  const viewMode = useStore((state) => state.viewMode);
  const toggleFullWindow = useStore((state) => state.toggleFullWindow);
  const toggleFullscreen = useStore((state) => state.toggleFullscreen);
  const setViewMode = useStore((state) => state.setViewMode);

  let containerClasses = '';
  if (viewMode === EViewMode.Normal) containerClasses = 'relative w-full h-full';
  if (viewMode === EViewMode.Fullwindow) containerClasses = 'fixed inset-0 z-50';
  if (viewMode === EViewMode.Fullscreen) containerClasses = 'fixed inset-0 z-50';

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode as EViewMode);
  };

  return (
    <div className={`${containerClasses} bg-black`}>
      <KeyboardControls map={KeyboardMap}>
        <CanvasWrapper className="bg-black">
          <GameScene />
        </CanvasWrapper>
      </KeyboardControls>
      <GameUI />
      <ViewModeControls
        viewMode={viewMode as ViewMode}
        onToggleFullWindow={toggleFullWindow}
        onToggleFullscreen={toggleFullscreen}
        onSetViewMode={handleSetViewMode}
      />
    </div>
  );
}
