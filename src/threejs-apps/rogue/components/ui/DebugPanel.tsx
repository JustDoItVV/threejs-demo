'use client';

import { useState } from 'react';

import { cn } from '@/libs/ui/utils';
import { Button } from '@/ui/button';

import { selectDebugSlice, useStore } from '../../store';

export function DebugPanel() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const {
    cameraPos,
    roomInfo,
    cameraZoom,
    entityCount,
    setCameraZoom,
    godMode,
    toggleGodMode,
    characterPos,
    enableFreeCameraControl,
    toggleFreeCameraControl,
    toggleMarkers,
    toggleFog,
    showGrid,
    toggleGrid,
  } = useStore(selectDebugSlice);

  const handleZoomChange = (newZoom: number) => setCameraZoom(newZoom);

  return (
    <div className="absolute top-4 left-4 pointer-events-auto">
      <div className="bg-black/90 dark:bg-black/90 text-gray-100 dark:text-white p-3 rounded-lg border border-green-500/50 min-w-[280px] max-h-[80vh] overflow-hidden">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h3 className="text-sm font-bold text-green-400">
            🔧 Debug Panel {godMode && '(GOD MODE)'}
          </h3>
          <button className="text-green-400 hover:text-green-300 text-xs font-mono">
            {isCollapsed ? '[+]' : '[-]'}
          </button>
        </div>

        {!isCollapsed && (
          <div className="space-y-3 overflow-y-auto max-h-[70vh]">
            <div className="border-b border-green-500/30 pb-2">
              <Button
                size="sm"
                variant={godMode ? 'destructive' : 'outline'}
                onClick={toggleGodMode}
                className="w-full h-7 text-xs"
              >
                {godMode ? '⚡ God Mode: ON ⚡' : 'God Mode: OFF'}
              </Button>
            </div>

            <div className="border-b border-green-500/30 pb-2">
              <div className="font-bold text-green-400 text-xs mb-2">Zoom: {cameraZoom}</div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={cameraZoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="w-full h-2 bg-green-900/30 rounded-lg appearance-none cursor-pointer accent-green-500"
                style={{
                  background: `linear-gradient(to right, rgb(34 197 94 / 0.5) 0%, rgb(34 197 94 / 0.5) ${
                    ((cameraZoom - 5) / 95) * 100
                  }%, rgb(20 83 45 / 0.3) ${
                    ((cameraZoom - 5) / 95) * 100
                  }%, rgb(20 83 45 / 0.3) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5</span>
                <span>100</span>
              </div>
            </div>

            {characterPos && (
              <>
                <div className="border-b border-green-500/30 pb-2">
                  <div className="font-bold text-green-400 text-xs mb-2">Position Info</div>
                  <div className="text-xs font-mono space-y-1 text-gray-200 dark:text-gray-100">
                    {characterPos && (
                      <div>
                        Char: ({characterPos.x.toFixed(1)}, {characterPos.y.toFixed(1)})
                      </div>
                    )}
                    {cameraPos && (
                      <div>
                        Cam: ({cameraPos.x.toFixed(1)}, {cameraPos.y.toFixed(1)},{' '}
                        {cameraPos.z.toFixed(1)})
                      </div>
                    )}
                    {roomInfo && (
                      <div>
                        Room: field({roomInfo.fieldX}, {roomInfo.fieldY}) size(
                        {roomInfo.sizeX}x{roomInfo.sizeY})
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-b border-green-500/30 pb-2">
                  <div className="font-bold text-green-400 text-xs mb-2">Entity Count</div>
                  <div className="text-xs font-mono space-y-1 text-gray-200 dark:text-gray-100">
                    <div>Rooms: {entityCount.rooms}</div>
                    <div>Enemies: {entityCount.enemies}</div>
                    <div>Items: {entityCount.items}</div>
                    <div>Corridors: {entityCount.corridors}</div>
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="font-bold text-green-400 text-xs mb-2">Toggles</div>
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleMarkers}
                  className="w-full h-7 text-xs border-green-500/50 bg-green-900/20 hover:bg-green-800/30 text-gray-100"
                >
                  Toggle Debug Markers
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleFog}
                  className="w-full h-7 text-xs border-green-500/50 bg-green-900/20 hover:bg-green-800/30 text-gray-100"
                >
                  Toggle Fog of War
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleGrid}
                  className={cn(
                    'w-full h-7 text-xs border-green-500/50  hover:bg-green-800/30 text-gray-100',
                    showGrid && 'bg-green-500/50',
                    !showGrid && 'bg-green-900/20'
                  )}
                >
                  Toggle grid
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleFreeCameraControl}
                  className={cn(
                    'w-full h-7 text-xs border-green-500/50  hover:bg-green-800/30 text-gray-100',
                    enableFreeCameraControl && 'bg-green-500/50',
                    !enableFreeCameraControl && 'bg-green-900/20'
                  )}
                >
                  Enable free camera
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
