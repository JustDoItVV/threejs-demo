'use client';

import { Button } from '@/libs/ui/button';
import { Card } from '@/libs/ui/card';

import { useGameStore } from '../store/game-store';

export function DebugPanel() {
  const playerPosition = useGameStore((state) => state.playerPosition);
  const debugEnabled = useGameStore((state) => state.debugEnabled);
  const godMode = useGameStore((state) => state.godMode);
  const cameraZoom = useGameStore((state) => state.cameraZoom);
  const toggleDebug = useGameStore((state) => state.toggleDebug);
  const toggleGodMode = useGameStore((state) => state.toggleGodMode);
  const setCameraZoom = useGameStore((state) => state.setCameraZoom);

  if (!debugEnabled) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleDebug}
          variant="outline"
          size="sm"
          className="bg-black/70 text-white hover:bg-black/90"
        >
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <Card className="bg-black/80 text-white p-4 border-gray-700">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm">Debug Panel</h3>
            <Button onClick={toggleDebug} variant="ghost" size="sm" className="h-6 px-2">
              ×
            </Button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <div className="text-gray-400">Player Position</div>
              <div>Row: {playerPosition.currentRow}</div>
              <div>Tile: {playerPosition.currentTile}</div>
            </div>

            <div className="border-t border-gray-700 pt-2">
              <label className="flex items-center justify-between gap-2">
                <span>Camera Zoom</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={cameraZoom}
                  onChange={(e) => setCameraZoom(Number(e.target.value))}
                  className="w-24"
                />
              </label>
              <div className="text-gray-400 text-right">{cameraZoom}</div>
            </div>

            <div className="border-t border-gray-700 pt-2">
              <Button
                onClick={toggleGodMode}
                size="sm"
                variant={godMode ? 'default' : 'outline'}
                className="w-full"
              >
                {godMode ? '🛡️ God Mode ON' : 'God Mode OFF'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
