'use client';

import { useStore } from '../../store';
import { EGameState } from '../../types';
import { GameOverScreen } from './game-over-screen';
import { HUD } from './hud';
import { MenuScreen } from './menu-screen';
import { PauseScreen } from './pause-screen';

export function GameUI() {
  const gameState = useStore((state) => state.state);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {gameState === EGameState.Menu && <MenuScreen />}
      {gameState === EGameState.Game && <HUD />}
      {gameState === EGameState.Pause && <PauseScreen />}
      {gameState === EGameState.Gameover && <GameOverScreen />}
    </div>
  );
}
