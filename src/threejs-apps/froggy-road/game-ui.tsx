'use client';

import { Button } from '@/ui/button';

import type { GameState } from './index';

interface GameUIProps {
  gameState: GameState;
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
}

export function GameUI({ gameState, score, highScore, onStart, onRestart }: GameUIProps) {
  if (gameState === 'menu') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-white">Froggy Road</h1>
          <p className="text-xl text-white/80">Help the frog cross the road!</p>
          <div className="space-y-2">
            <p className="text-sm text-white/60">Use Arrow Keys or WASD to move</p>
            <p className="text-sm text-white/60">Avoid cars, jump on logs</p>
          </div>
          <Button size="lg" onClick={onStart} className="text-lg px-8 py-6">
            Start Game
          </Button>
          {highScore > 0 && (
            <p className="text-lg text-white/70">High Score: {highScore}</p>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-white">Game Over!</h2>
          <div className="space-y-2">
            <p className="text-3xl text-white">Score: {score}</p>
            <p className="text-xl text-white/70">High Score: {highScore}</p>
          </div>
          <Button size="lg" onClick={onRestart} className="text-lg px-8 py-6">
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  // Playing state - show score overlay
  return (
    <div className="absolute top-4 left-4 space-y-2">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
        <p className="text-2xl font-bold text-white">Score: {score}</p>
      </div>
      {highScore > 0 && (
        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-sm text-white/80">Best: {highScore}</p>
        </div>
      )}
    </div>
  );
}
