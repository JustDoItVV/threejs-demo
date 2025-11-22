'use client';

import { useStore } from '../../store';
import { ModelsIcons } from './const';

export function PauseScreen() {
  const resumeGame = useStore((state) => state.resumeGame);
  const restart = useStore((state) => state.restart);
  const score = useStore((state) => state.score);
  const model = useStore((state) => state.model);
  const setModel = useStore((state) => state.setModel);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
      <div className="text-center space-y-8 px-8">
        <h1 className="text-5xl font-bold text-white mb-4">Paused</h1>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Current Score</p>
          <p className="text-4xl font-bold text-white">{score}</p>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-white text-sm">Character:</p>
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
            onClick={resumeGame}
            className="w-full px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-lg transition-colors"
          >
            Resume (Space)
          </button>

          <button
            onClick={restart}
            className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg transition-colors"
          >
            Restart (R)
          </button>
        </div>
      </div>
    </div>
  );
}
