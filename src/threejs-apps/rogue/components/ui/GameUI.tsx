'use client';

import { selectGameState, useRogueStore } from '../../store/rogue-store';
import { BackpackModal } from './BackpackModal';
import { DebugPanel } from './DebugPanel';
import { GameOverScreen } from './GameOverScreen';
import { LogBox } from './LogBox';
import { MenuScreen } from './MenuScreen';
import { StatusBar } from './StatusBar';

export function GameUI() {
  const gameState = useRogueStore(selectGameState);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {gameState === 'start' && <MenuScreen />}

      {gameState === 'game' && (
        <>
          <StatusBar />
          <LogBox />
          <DebugPanel />
        </>
      )}

      {gameState === 'backpack' && <BackpackModal />}

      {gameState === 'end' && <GameOverScreen />}
    </div>
  );
}
