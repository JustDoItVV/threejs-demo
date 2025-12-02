'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';

import { selectRenderTrigger, useStore } from '../../store';
import { IHighscore } from '../../types/entities';

export function MenuScreen() {
  useStore(selectRenderTrigger);

  const [highscores, setHighscores] = useState<IHighscore[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const startGame = useStore((state) => state.startGame);
  const controller = useStore((state) => state.controller);
  const datalayer = controller?.datalayer;

  useEffect(() => {
    if (!datalayer) return;

    const loadScores = async () => {
      try {
        const scores = await datalayer.loadHighscore();
        setHighscores(scores);
      } catch (err) {
        console.error('Failed to load highscores:', err);
      }
    };

    const savedName = datalayer.loadPlayerName();
    if (savedName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayerName(savedName);
    }

    loadScores();
  }, [datalayer]);

  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setPlayerName(name);
    if (datalayer && name.trim()) {
      datalayer.savePlayerName(name.trim());
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 pointer-events-auto">
      <div className="bg-black/80 text-white p-8 rounded-lg border-2 border-yellow-600 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-yellow-400">ROGUE</h1>
        <p className="text-center text-sm text-gray-400 mb-6">Classic Dungeon Crawler</p>

        <div className="mb-4">
          <label htmlFor="player-name" className="block text-sm text-gray-300 mb-2">
            Player Name:
          </label>
          <Input
            id="player-name"
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={handlePlayerNameChange}
            maxLength={20}
            className="bg-black/60 border-yellow-600/50 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="mb-6">
          <Button onClick={startGame} className="w-full" size="lg">
            Start New Game
          </Button>
        </div>

        {highscores.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-3 text-yellow-400 text-center">High Scores</h2>
            <div className="bg-black/60 rounded p-3">
              <div className="flex flex-col gap-1 font-mono text-sm max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-gray-800">
                {highscores.slice(0, 10).map((score, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300 py-1">
                    <span className="flex-1">
                      {idx + 1}. {score.playerName || 'Player'}
                    </span>
                    <span className="text-yellow-400 font-bold">{score.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Navigate 7 levels of dungeons</p>
          <p>Fight monsters, collect treasures</p>
          <p>Reach the final door to win!</p>
        </div>
      </div>
    </div>
  );
}
