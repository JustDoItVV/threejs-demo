'use client';

import { Button } from '@/libs/ui/button';

import { useGameStore } from '../store/game-store';

export function GameUI() {
  const gameState = useGameStore((state) => state.gameState);
  const score = useGameStore((state) => state.score);
  const highScore = useGameStore((state) => state.highScore);
  const startGame = useGameStore((state) => state.startGame);

  if (gameState === 'menu') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
        <div className="bg-black/80 text-white p-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4">Crossy Road</h1>
          <p className="text-gray-300 mb-6">Use arrow keys to move</p>
          <Button onClick={startGame} size="lg" className="min-w-32">
            Start Game
          </Button>
          {highScore > 0 && (
            <div className="mt-4 text-sm text-gray-400">High Score: {highScore}</div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
        <div className="bg-black/80 text-white p-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">Game Over!</h1>
          <p className="text-xl mb-2">Score: {score}</p>
          <p className="text-gray-300 mb-6">High Score: {highScore}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={startGame} size="lg">
              Play Again
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-400">Press R to restart</p>
        </div>
      </div>
    );
  }

  // Playing state - show score overlay
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-black/70 text-white px-6 py-2 rounded-lg font-mono text-xl">
        Score: {score}
      </div>
    </div>
  );
}
