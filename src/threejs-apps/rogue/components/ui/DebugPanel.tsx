'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/ui/button';

export function DebugPanel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [zoom, setZoom] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      // @ts-expect-error -- tmp
      if (typeof window !== 'undefined' && window.rogueDebug) {
        // @ts-expect-error -- tmp
        setDebugInfo(window.rogueDebug);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleLookAtCharacter = () => {
    // @ts-expect-error -- tmp
    if (typeof window !== 'undefined' && window.rogueCameraControls) {
      // @ts-expect-error -- tmp
      window.rogueCameraControls.lookAtCharacter();
    }
  };

  const handleLookAtRoomCenter = () => {
    // @ts-expect-error -- tmp
    if (typeof window !== 'undefined' && window.rogueCameraControls) {
      // @ts-expect-error -- tmp
      window.rogueCameraControls.lookAtRoomCenter();
    }
  };

  const handleResetCamera = () => {
    // @ts-expect-error -- tmp
    if (typeof window !== 'undefined' && window.rogueCameraControls) {
      // @ts-expect-error -- tmp
      window.rogueCameraControls.resetCamera();
    }
  };

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(5, Math.min(50, zoom + delta));
    setZoom(newZoom);
    // @ts-expect-error -- tmp
    if (typeof window !== 'undefined' && window.rogueCameraControls) {
      // @ts-expect-error -- tmp
      window.rogueCameraControls.setZoom(newZoom);
    }
  };

  const handleToggleMarkers = () => {
    setShowMarkers(!showMarkers);
    // @ts-expect-error -- tmp
    if (typeof window !== 'undefined' && window.rogueCameraControls) {
      // @ts-expect-error -- tmp
      window.rogueCameraControls.toggleMarkers(!showMarkers);
    }
  };

  const handleToggleFogOfWar = () => {
    // @ts-expect-error -- tmp
    if (typeof window !== 'undefined' && window.rogueCameraControls) {
      // @ts-expect-error -- tmp
      window.rogueCameraControls.toggleFogOfWar();
    }
  };

  const handleUseBasicMaterial = () => {
    // @ts-expect-error -- tmp
    if (typeof window !== 'undefined' && window.rogueCameraControls) {
      // @ts-expect-error -- tmp
      window.rogueCameraControls.useBasicMaterial();
    }
  };

  return (
    <div className="absolute bottom-4 right-4 pointer-events-auto">
      <div className="bg-black/90 text-white p-4 rounded-lg border border-green-500 min-w-[300px] max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-green-400 mb-3">🔧 Debug Panel</h3>
        {!debugInfo && <div className="text-yellow-400 text-xs mb-2">Waiting for game data...</div>}

        <div className="space-y-3">
          <div className="border-b border-green-500/30 pb-2">
            <div className="font-bold text-green-400 text-sm mb-2">Camera Controls</div>
            <div className="flex flex-col gap-1">
              <Button size="sm" onClick={handleLookAtCharacter} className="w-full">
                Look at Character
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLookAtRoomCenter}
                className="w-full"
              >
                Look at Room Center
              </Button>
              <Button size="sm" variant="outline" onClick={handleResetCamera} className="w-full">
                Reset Camera
              </Button>
            </div>
          </div>

          <div className="border-b border-green-500/30 pb-2">
            <div className="font-bold text-green-400 text-sm mb-2">Zoom: {zoom}</div>
            <div className="flex gap-1">
              <Button size="sm" onClick={() => handleZoomChange(-5)} className="flex-1">
                -
              </Button>
              <Button size="sm" onClick={() => handleZoomChange(5)} className="flex-1">
                +
              </Button>
            </div>
          </div>

          {debugInfo && (
            <>
              <div className="border-b border-green-500/30 pb-2">
                <div className="font-bold text-green-400 text-sm mb-2">Position Info</div>
                <div className="text-xs font-mono space-y-1">
                  {debugInfo.characterPos && (
                    <div>
                      Char: ({debugInfo.characterPos.x.toFixed(1)},{' '}
                      {debugInfo.characterPos.y.toFixed(1)})
                    </div>
                  )}
                  {debugInfo.cameraPos && (
                    <div>
                      Cam: ({debugInfo.cameraPos.x.toFixed(1)}, {debugInfo.cameraPos.y.toFixed(1)},{' '}
                      {debugInfo.cameraPos.y.toFixed(1)})
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

              <div className="border-b border-green-500/30 pb-2">
                <div className="font-bold text-green-400 text-sm mb-2">Entity Count</div>
                <div className="text-xs font-mono space-y-1">
                  <div>Rooms: {debugInfo.entityCount?.rooms || 0}</div>
                  <div>Enemies: {debugInfo.entityCount?.enemies || 0}</div>
                  <div>Items: {debugInfo.entityCount?.items || 0}</div>
                  <div>Corridors: {debugInfo.entityCount?.corridors || 0}</div>
                </div>
              </div>
            </>
          )}

          <div>
            <div className="font-bold text-green-400 text-sm mb-2">Toggles</div>
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleMarkers}
                className="w-full text-xs"
              >
                Toggle Debug Markers
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleFogOfWar}
                className="w-full text-xs"
              >
                Toggle Fog of War
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleUseBasicMaterial}
                className="w-full text-xs"
              >
                Use Basic Material
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
