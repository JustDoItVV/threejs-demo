'use client';

import { useStore } from '../../store';
import { EGameState } from '../../types';
import { ModelsIcons } from './const';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function GameOverScreen() {
  const restart = useStore((state) => state.restart);
  const setState = useStore((state) => state.setState);
  const score = useStore((state) => state.score);
  const highScore = useStore((state) => state.highScore);
  const gameTime = useStore((state) => state.gameTime);
  const model = useStore((state) => state.model);
  const setModel = useStore((state) => state.setModel);

  const isNewHighScore = score === highScore && score > 0;

  const backToMenu = () => {
    setState(EGameState.Menu);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
      <div className="text-center space-y-8 px-8">
        <h1 className="text-5xl font-bold text-red-500 mb-4">Game Over</h1>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400">Final Score</p>
            <p className="text-5xl font-bold text-white">{score}</p>
          </div>

          {isNewHighScore && (
            <div className="text-yellow-400 text-xl font-bold animate-pulse">
              🎉 New High Score! 🎉
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Best Score</p>
              <p className="text-3xl font-bold text-yellow-400">{highScore}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p className="text-3xl font-bold text-blue-400">{formatTime(gameTime)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-white text-sm">Choose Character:</p>
          <div className="flex gap-3 justify-center">
            {ModelsIcons.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`px-4 py-3 rounded-lg transition-all ${
                  model === m.id
                    ? 'bg-blue-600 text-white scale-110 shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-3xl mb-1">{m.emoji}</div>
                <div className="text-xs font-semibold">{m.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={restart}
            className="w-full px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-lg transition-colors"
          >
            Restart (R)
          </button>

          <button
            onClick={backToMenu}
            className="w-full px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white text-lg font-bold rounded-lg transition-colors"
          >
            Menu (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
