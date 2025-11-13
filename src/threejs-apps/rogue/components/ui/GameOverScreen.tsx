'use client';

import { Button } from '@/ui/button';

import {
  selectCharacter,
  selectLevelNumber,
  selectWin,
  useRogueStore,
} from '../../store/rogue-store';

export function GameOverScreen() {
  const win = useRogueStore(selectWin);
  const levelNumber = useRogueStore(selectLevelNumber);
  const character = useRogueStore(selectCharacter);
  const restart = useRogueStore((state) => state.restart);
  const startGame = useRogueStore((state) => state.startGame);

  const isWin = win === true;
  const title = isWin ? 'VICTORY!' : 'GAME OVER';
  const message = isWin ? 'You have conquered all 7 levels!' : 'You have fallen in the dungeon...';

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 pointer-events-auto">
      <div className="bg-black/80 text-white p-8 rounded-lg border-2 border-yellow-600 max-w-md w-full">
        <h1
          className={`text-4xl font-bold text-center mb-2 ${
            isWin ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {title}
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6">{message}</p>

        <div className="bg-black/60 rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-3 text-yellow-400 text-center">Final Stats</h2>
          <div className="flex flex-col gap-2 font-mono text-sm">
            <div className="flex justify-between">
              <span>Level Reached:</span>
              <span className="text-yellow-400 font-bold">{levelNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Gold Collected:</span>
              <span className="text-yellow-400 font-bold">{character?.gold || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Final HP:</span>
              <span className="text-red-400 font-bold">{character?.hp || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Strength:</span>
              <span className="text-orange-400 font-bold">{character?.str || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Dexterity:</span>
              <span className="text-blue-400 font-bold">{character?.dex || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={startGame} variant="default" className="w-full" size="lg">
            Start New Game
          </Button>
          <Button onClick={restart} variant="outline" className="w-full" size="lg">
            Return to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
