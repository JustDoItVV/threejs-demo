'use client';

import { useStore } from '../../../store';

export function DebugPanel() {
  const showGrid = useStore((state) => state.showGrid);
  const showAxes = useStore((state) => state.showAxes);
  const enableFreeCameraControl = useStore((state) => state.enableFreeCameraControl);
  const godMode = useStore((state) => state.godMode);
  const isPanelOpen = useStore((state) => state.isPanelOpen);

  const toggleGrid = useStore((state) => state.toggleGrid);
  const toggleAxes = useStore((state) => state.toggleAxes);
  const toggleFreeCameraControl = useStore((state) => state.toggleFreeCameraControl);
  const toggleGodMode = useStore((state) => state.toggleGodMode);
  const togglePanel = useStore((state) => state.togglePanel);

  return (
    <div className="absolute top-4 left-4 bg-black/80 text-white rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-600">
        <h3 className="text-sm font-bold">Debug Controls</h3>
        <button
          onClick={togglePanel}
          className="text-white hover:bg-white/10 p-1 rounded transition-colors"
          aria-label={isPanelOpen ? 'Minimize panel' : 'Maximize panel'}
        >
          {isPanelOpen ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          )}
        </button>
      </div>

      {isPanelOpen && (
        <div className="p-3 space-y-2 min-w-[200px]">
          <label className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-1 rounded">
            <span className="text-sm">Grid</span>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={toggleGrid}
              className="w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-1 rounded">
            <span className="text-sm">Axes</span>
            <input
              type="checkbox"
              checked={showAxes}
              onChange={toggleAxes}
              className="w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-1 rounded">
            <span className="text-sm">Free Camera</span>
            <input
              type="checkbox"
              checked={enableFreeCameraControl}
              onChange={toggleFreeCameraControl}
              className="w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-1 rounded">
            <span className="text-sm">God Mode</span>
            <input
              type="checkbox"
              checked={godMode}
              onChange={toggleGodMode}
              className="w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
}
