'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/ui/button';

import { useRogueStore } from '../../store/rogue-store';

export function MenuScreen() {
  const [highscores, setHighscores] = useState<any[]>([]);
  const startGame = useRogueStore((state) => state.startGame);
  const repository = useRogueStore((state) => state._repository);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const scores = await repository.loadHighScores(10);
        setHighscores(scores);
      } catch (err) {
        console.error('Failed to load highscores:', err);
      }
    };
    loadScores();
  }, [repository]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 pointer-events-auto">
      <div className="bg-black/80 text-white p-8 rounded-lg border-2 border-yellow-600 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-yellow-400">ROGUE</h1>
        <p className="text-center text-sm text-gray-400 mb-6">Classic Dungeon Crawler</p>

        <div className="mb-6">
          <Button onClick={startGame} className="w-full" size="lg">
            Start New Game
          </Button>
        </div>

        {highscores.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-3 text-yellow-400 text-center">High Scores</h2>
            <div className="bg-black/60 rounded p-3">
              <div className="flex flex-col gap-1 font-mono text-sm">
                {highscores.map((score, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300">
                    <span>
                      {idx + 1}. Level {score.level}
                    </span>
                    <span className="text-yellow-400">{score.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Navigate 21 levels of dungeons</p>
          <p>Fight monsters, collect treasures</p>
          <p>Reach the final door to win!</p>
        </div>
      </div>
    </div>
  );
}
