import { useEffect } from 'react';

import { useRogueStore } from '../store/rogue-store';

export function useKeyboardControls() {
  const gameState = useRogueStore((state) => state.gameState);
  const startGame = useRogueStore((state) => state.startGame);
  const makeTurn = useRogueStore((state) => state.makeTurn);
  const restart = useRogueStore((state) => state.restart);
  const saveGame = useRogueStore((state) => state.saveGame);
  const setGameState = useRogueStore((state) => state.setGameState);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (typeof window === 'undefined') return;

      // Prevent page scroll for arrow keys, WASD, and spacebar
      const preventScrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
      const preventScrollCodes = ['KeyW', 'KeyS', 'KeyA', 'KeyD'];
      if (preventScrollKeys.includes(event.key) || preventScrollCodes.includes(event.code)) {
        event.preventDefault();
      }

      let handled = false;

      if (gameState === 'start') {
        if (event.key === 'Enter') {
          startGame();
          handled = true;
        }
      } else if (gameState === 'game') {
        if (event.code === 'KeyW' || event.key === 'ArrowUp') {
          makeTurn('up');
          handled = true;
        } else if (event.code === 'KeyS' || event.key === 'ArrowDown') {
          makeTurn('down');
          handled = true;
        } else if (event.code === 'KeyA' || event.key === 'ArrowLeft') {
          makeTurn('left');
          handled = true;
        } else if (event.code === 'KeyD' || event.key === 'ArrowRight') {
          makeTurn('right');
          handled = true;
        } else if (['KeyH', 'KeyJ', 'KeyK', 'KeyE', 'KeyB'].includes(event.code)) {
          // Open backpack
          setGameState('backpack');
          handled = true;
        } else if (event.key === 'Escape' || event.code === 'KeyQ') {
          await saveGame();
          setGameState('start');
          handled = true;
        }
      } else if (gameState === 'backpack') {
        if (event.key === 'Escape') {
          setGameState('game');
          handled = true;
        } else if (/^[1-9]$/.test(event.key)) {
          makeTurn(event.key);
          setGameState('game');
          handled = true;
        }
      } else if (gameState === 'end') {
        if (event.key === 'Enter') {
          restart();
          handled = true;
        }
      }

      if (handled) {
        event.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, startGame, makeTurn, restart, saveGame, setGameState]);
}
