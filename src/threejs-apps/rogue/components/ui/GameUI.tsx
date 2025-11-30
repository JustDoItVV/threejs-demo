'use client';

import { useEffect } from 'react';

import { selectController, selectRenderTrigger, useStore } from '../../store';
import { BackpackModal } from './BackpackModal';
import { DebugPanel } from './DebugPanel';
import { GameOverScreen } from './GameOverScreen';
import { LogBox } from './LogBox';
import { MenuScreen } from './MenuScreen';
import { StatusBar } from './StatusBar';

export function GameUI() {
  const renderTrigger = useStore(selectRenderTrigger);
  const controller = useStore(selectController);
  const gameState = controller?.getStatuses()?.gameState;

  useEffect(() => {}, [renderTrigger]);

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
