'use client';

import { useEffect } from 'react';

import { useStore } from '../../store';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function HUD() {
  const score = useStore((state) => state.score);
  const gameTime = useStore((state) => state.gameTime);
  const updateGameTime = useStore((state) => state.updateGameTime);

  useEffect(() => {
    const interval = setInterval(() => {
      updateGameTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateGameTime]);

  return (
    <div className="absolute inset-x-0 top-0 flex justify-between items-start p-6 pointer-events-none">
      <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg">
        <p className="text-sm text-gray-400">Score</p>
        <p className="text-3xl font-bold text-white">{score}</p>
      </div>

      <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg">
        <p className="text-sm text-gray-400">Time</p>
        <p className="text-3xl font-bold text-white">{formatTime(gameTime)}</p>
      </div>
    </div>
  );
}
