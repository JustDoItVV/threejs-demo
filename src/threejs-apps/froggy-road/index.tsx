'use client';

import { useCallback, useEffect, useState } from 'react';

import { OrthographicCamera } from '@react-three/drei';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { ControlsPanel } from './controls-panel';
import { GameScene } from './game-scene';
import { GameUI } from './game-ui';
import { PostProcessing } from './post-processing';

export type GameState = 'menu' | 'playing' | 'gameOver';

export function InteractiveGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('froggyRoadHighScore') || '0', 10);
    }
    return 0;
  });

  const handleStart = useCallback(() => {
    setScore(0);
    setGameState('playing');
  }, []);

  const handleGameOver = useCallback(
    (finalScore: number) => {
      setGameState('gameOver');
      if (finalScore > highScore) {
        setHighScore(finalScore);
        if (typeof window !== 'undefined') {
          localStorage.setItem('froggyRoadHighScore', finalScore.toString());
        }
      }
    },
    [highScore]
  );

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleExitToMenu = useCallback(() => {
    setGameState('menu');
    setScore(0);
  }, []);

  // Handle R (restart) and Esc (exit to menu) keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        if (gameState === 'playing' || gameState === 'gameOver') {
          handleStart();
        }
      } else if (e.key === 'Escape') {
        if (gameState === 'playing' || gameState === 'gameOver') {
          handleExitToMenu();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleStart, handleExitToMenu]);

  return (
    <div className="relative w-full h-full">
      <CanvasWrapper>
        <OrthographicCamera makeDefault position={[8, 8, 8]} zoom={90} />
        <GameScene
          gameState={gameState}
          onGameOver={handleGameOver}
          onScoreUpdate={handleScoreUpdate}
        />
        <PostProcessing />
      </CanvasWrapper>

      <GameUI
        gameState={gameState}
        score={score}
        highScore={highScore}
        onStart={handleStart}
        onRestart={handleStart}
      />

      {gameState === 'playing' && <ControlsPanel onReset={handleStart} onExit={handleExitToMenu} />}
    </div>
  );
}
