'use client';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { GameScene } from './components/three/GameScene';
import { GameUI } from './components/ui/GameUI';
import { useKeyboardControls } from './hooks/useKeyboardControls';

export type RogueGameState = 'start' | 'game' | 'backpack' | 'end';

export function RogueGame() {
  useKeyboardControls();

  return (
    <div className="relative w-full h-full bg-black">
      <CanvasWrapper className="bg-black">
        <GameScene />
      </CanvasWrapper>
      <GameUI />
    </div>
  );
}
