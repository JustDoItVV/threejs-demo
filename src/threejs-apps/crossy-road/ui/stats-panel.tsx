'use client';

import { useCallback } from 'react';

import { Card } from '@/libs/ui/card';

import { useGameStore } from '../store/game-store';

export function StatsPanel() {
  const score = useGameStore((state) => state.score);
  const highScore = useGameStore((state) => state.highScore);
  const displayMode = useGameStore((state) => state.displayMode);
  const setDisplayMode = useGameStore((state) => state.setDisplayMode);

  const handleFullWindow = useCallback(() => {
    setDisplayMode('fullWindow');
  }, [setDisplayMode]);

  const handleFullscreen = useCallback(() => {
    setDisplayMode('fullscreen');
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
        setDisplayMode('fullWindow');
      });
    }
  }, [setDisplayMode]);

  const handleNormal = useCallback(() => {
    setDisplayMode('normal');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [setDisplayMode]);

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <Card className="bg-black/80 text-white p-4 border-gray-700">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-bold border-b border-gray-700 pb-2">Game Stats</div>

          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Score:</span>
              <span className="font-bold text-green-400">{score}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">High Score:</span>
              <span className="font-bold text-yellow-400">{highScore}</span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-2">
            <div className="text-xs text-gray-400 mb-2">Display Mode</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={handleNormal}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  displayMode === 'normal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Normal
              </button>
              <button
                onClick={handleFullWindow}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  displayMode === 'fullWindow'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Full Window
              </button>
              <button
                onClick={handleFullscreen}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  displayMode === 'fullscreen'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Fullscreen
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
