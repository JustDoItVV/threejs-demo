'use client';

import {
  selectCameraMode,
  selectPointBudget,
  selectPointSize,
  selectShowControlPanel,
  selectUseLOD,
  usePointCloudStore,
} from '../../store/point-cloud-store';
import { VIEWER_CONFIG } from '../../config/viewer.config';
import { ViewModeSelector } from './ViewModeSelector';

export function ControlPanel() {
  const showControlPanel = usePointCloudStore(selectShowControlPanel);
  const cameraMode = usePointCloudStore(selectCameraMode);
  const pointSize = usePointCloudStore(selectPointSize);
  const pointBudget = usePointCloudStore(selectPointBudget);
  const useLOD = usePointCloudStore(selectUseLOD);

  const setCameraMode = usePointCloudStore((state) => state.setCameraMode);
  const setPointSize = usePointCloudStore((state) => state.setPointSize);
  const setPointBudget = usePointCloudStore((state) => state.setPointBudget);
  const setUseLOD = usePointCloudStore((state) => state.setUseLOD);
  const toggleGrid = usePointCloudStore((state) => state.toggleGrid);
  const toggleBounds = usePointCloudStore((state) => state.toggleBounds);
  const toggleStats = usePointCloudStore((state) => state.toggleStats);
  const toggleFileLoader = usePointCloudStore((state) => state.toggleFileLoader);
  const resetCamera = usePointCloudStore((state) => state.resetCamera);

  if (!showControlPanel) return null;

  return (
    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg max-w-xs z-10">
      <h3 className="font-bold mb-3 text-sm">Controls</h3>

      {/* View Mode Selector */}
      <div className="mb-3">
        <ViewModeSelector />
      </div>

      <div className="space-y-3 text-sm">
        {/* Load File Button */}
        <button
          onClick={toggleFileLoader}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-xs font-medium"
        >
          Load Point Cloud
        </button>

        {/* Camera Mode */}
        <div>
          <label className="block text-xs font-medium mb-1">Camera Mode</label>
          <select
            value={cameraMode}
            onChange={(e) => setCameraMode(e.target.value as 'orthographic' | 'firstPerson')}
            className="w-full px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="orthographic">Orthographic</option>
            <option value="firstPerson">First Person</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {cameraMode === 'orthographic'
              ? 'Drag: Pan | Wheel: Zoom | Q/E: Rotate'
              : 'WASD: Move | Mouse: Look | Space/Ctrl: Up/Down'}
          </p>
        </div>

        {/* Point Size */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Point Size: {pointSize.toFixed(1)}
          </label>
          <input
            type="range"
            min={VIEWER_CONFIG.minPointSize}
            max={VIEWER_CONFIG.maxPointSize}
            step={0.5}
            value={pointSize}
            onChange={(e) => setPointSize(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Point Budget */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Point Budget: {(pointBudget / 1000000).toFixed(1)}M
          </label>
          <input
            type="range"
            min={VIEWER_CONFIG.minPointBudget}
            max={VIEWER_CONFIG.maxPointBudget}
            step={100000}
            value={pointBudget}
            onChange={(e) => setPointBudget(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* LOD Method */}
        <div>
          <label className="block text-xs font-medium mb-1">LOD Method</label>
          <select
            value={useLOD}
            onChange={(e) => setUseLOD(e.target.value as 'simple' | 'octree')}
            className="w-full px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="simple">Simple (Uniform Skip)</option>
            <option value="octree">Octree (Distance-based)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {useLOD === 'simple'
              ? 'Fast, uniform point reduction'
              : 'Smart, distance-based LOD'}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toggleGrid}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-2 py-1 rounded text-xs"
          >
            Grid
          </button>
          <button
            onClick={toggleBounds}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-2 py-1 rounded text-xs"
          >
            Bounds
          </button>
          <button
            onClick={toggleStats}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-2 py-1 rounded text-xs"
          >
            Stats
          </button>
        </div>

        {/* Reset Camera */}
        <button
          onClick={resetCamera}
          className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-3 rounded text-xs"
        >
          Reset Camera (R)
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-3 pt-3 border-t text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-1">Shortcuts:</p>
        <p>C - Toggle Camera</p>
        <p>H - Toggle Help</p>
      </div>
    </div>
  );
}
