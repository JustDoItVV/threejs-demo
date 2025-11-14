import { useEffect } from 'react';

import { useGameStore } from '../store/game-store';

export function useKeyboardControls() {
  const gameState = useGameStore((state) => state.gameState);
  const queueMove = useGameStore((state) => state.queueMove);
  const resetGame = useGameStore((state) => state.resetGame);
  const startGame = useGameStore((state) => state.startGame);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle controls when playing
      if (gameState !== 'playing') {
        // Allow restarting from game over
        if (gameState === 'gameOver' && event.key === 'r') {
          startGame();
        }
        return;
      }

      // Movement controls
      if (event.key === 'ArrowUp') {
        queueMove('forward');
      } else if (event.key === 'ArrowDown') {
        queueMove('backward');
      } else if (event.key === 'ArrowLeft') {
        queueMove('left');
      } else if (event.key === 'ArrowRight') {
        queueMove('right');
      } else if (event.key === 'r' || event.key === 'R') {
        // Restart game
        resetGame();
        startGame();
      } else if (event.key === 'Escape') {
        // Exit to menu
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, queueMove, resetGame, startGame]);
}
