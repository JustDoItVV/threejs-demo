'use client';

import { useGameStore } from '../store/game-store';

export function PerformanceStats() {
  const fps = useGameStore((state) => state.fps);
  const ms = useGameStore((state) => state.ms);

  return (
    <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg font-mono text-sm z-10">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <span className="text-green-400">FPS:</span>
          <span className="font-bold">{fps}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-blue-400">MS:</span>
          <span className="font-bold">{ms.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
