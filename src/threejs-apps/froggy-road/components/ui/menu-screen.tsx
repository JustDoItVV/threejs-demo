'use client';

import { useStore } from '../../store';
import { ModelsIcons } from './const';

export function MenuScreen() {
  const startGame = useStore((state) => state.startGame);
  const highScore = useStore((state) => state.highScore);
  const model = useStore((state) => state.model);
  const setModel = useStore((state) => state.setModel);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
      <div className="text-center space-y-8 px-8">
        <h1 className="text-6xl font-bold text-white mb-4">Froggy Road</h1>

        <div className="space-y-4">
          <p className="font-semibold text-white text-lg">Choose Your Character:</p>
          <div className="flex gap-4 justify-center">
            {ModelsIcons.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`px-6 py-4 rounded-lg transition-all ${
                  model === m.id
                    ? 'bg-blue-600 text-white scale-110 shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-4xl mb-2">{m.emoji}</div>
                <div className="text-sm font-semibold">{m.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-gray-300">
          <div className="text-lg">
            <p className="font-semibold text-white mb-2">Controls:</p>
            <p>W / ↑ - Move Forward</p>
            <p>A / ← - Move Left</p>
            <p>D / → - Move Right</p>
            <p>Space - Pause</p>
            <p>R - Restart (during game)</p>
          </div>

          {highScore > 0 && (
            <div className="pt-4">
              <p className="text-sm text-gray-400">Best Score</p>
              <p className="text-3xl font-bold text-yellow-400">{highScore}</p>
            </div>
          )}
        </div>

        <button
          onClick={startGame}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-colors"
        >
          Start Game (Enter)
        </button>
      </div>
    </div>
  );
}
