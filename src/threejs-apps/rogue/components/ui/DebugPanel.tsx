'use client';

import { useState } from 'react';

import { Button } from '@/ui/button';

import {
  selectCameraZoom,
  selectDebugInfo,
  selectGodMode,
  useRogueStore,
} from '../../store/rogue-store';

export function DebugPanel() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Get state from zustand store
  const debugInfo = useRogueStore(selectDebugInfo);
  const zoom = useRogueStore(selectCameraZoom);
  const godMode = useRogueStore(selectGodMode);

  // Get actions from store
  const setCameraZoom = useRogueStore((state) => state.setCameraZoom);
  const toggleMarkers = useRogueStore((state) => state.toggleMarkers);
  const toggleFog = useRogueStore((state) => state.toggleFog);
  const toggleGodMode = useRogueStore((state) => state.toggleGodMode);

  const handleZoomChange = (newZoom: number) => {
    setCameraZoom(newZoom);
  };

  return (
    <div className="absolute top-4 left-4 pointer-events-auto">
      <div className="bg-black/90 dark:bg-black/90 text-gray-100 dark:text-white p-3 rounded-lg border border-green-500/50 min-w-[280px] max-h-[80vh] overflow-hidden">
        {/* Header with collapse toggle */}
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
            {/* God Mode Toggle */}
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

            {/* Zoom Controls - Range Slider */}
            <div className="border-b border-green-500/30 pb-2">
              <div className="font-bold text-green-400 text-xs mb-2">Zoom: {zoom}</div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={zoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="w-full h-2 bg-green-900/30 rounded-lg appearance-none cursor-pointer accent-green-500"
                style={{
                  background: `linear-gradient(to right, rgb(34 197 94 / 0.5) 0%, rgb(34 197 94 / 0.5) ${
                    ((zoom - 5) / 95) * 100
                  }%, rgb(20 83 45 / 0.3) ${((zoom - 5) / 95) * 100}%, rgb(20 83 45 / 0.3) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5</span>
                <span>100</span>
              </div>
            </div>

            {/* Position Info */}
            {debugInfo && (
              <>
                <div className="border-b border-green-500/30 pb-2">
                  <div className="font-bold text-green-400 text-xs mb-2">Position Info</div>
                  <div className="text-xs font-mono space-y-1 text-gray-200 dark:text-gray-100">
                    {debugInfo.characterPos && (
                      <div>
                        Char: ({debugInfo.characterPos.x.toFixed(1)},{' '}
                        {debugInfo.characterPos.y.toFixed(1)})
                      </div>
                    )}
                    {debugInfo.cameraPos && (
                      <div>
                        Cam: ({debugInfo.cameraPos.x.toFixed(1)}, {debugInfo.cameraPos.y.toFixed(1)}
                        , {debugInfo.cameraPos.z.toFixed(1)})
                      </div>
                    )}
                    {debugInfo.roomInfo && (
                      <div>
                        Room: field({debugInfo.roomInfo.fieldX}, {debugInfo.roomInfo.fieldY}) size(
                        {debugInfo.roomInfo.sizeX}x{debugInfo.roomInfo.sizeY})
                      </div>
                    )}
                  </div>
                </div>

                {/* Entity Count */}
                <div className="border-b border-green-500/30 pb-2">
                  <div className="font-bold text-green-400 text-xs mb-2">Entity Count</div>
                  <div className="text-xs font-mono space-y-1 text-gray-200 dark:text-gray-100">
                    <div>Rooms: {debugInfo.entityCount?.rooms || 0}</div>
                    <div>Enemies: {debugInfo.entityCount?.enemies || 0}</div>
                    <div>Items: {debugInfo.entityCount?.items || 0}</div>
                    <div>Corridors: {debugInfo.entityCount?.corridors || 0}</div>
                  </div>
                </div>
              </>
            )}

            {/* Toggle Controls */}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
