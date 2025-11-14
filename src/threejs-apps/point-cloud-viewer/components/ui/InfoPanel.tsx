'use client';

import {
  selectError,
  selectIsLoading,
  selectLoadingProgress,
  selectMetrics,
  selectPointCloud,
  selectShowStats,
  usePointCloudStore,
} from '../../store/point-cloud-store';
import { formatFileSize, formatNumber } from '../../utils/point-cloud-optimizer';

export function InfoPanel() {
  const isLoading = usePointCloudStore(selectIsLoading);
  const loadingProgress = usePointCloudStore(selectLoadingProgress);
  const error = usePointCloudStore(selectError);
  const pointCloud = usePointCloudStore(selectPointCloud);
  const metrics = usePointCloudStore(selectMetrics);
  const showStats = usePointCloudStore(selectShowStats);

  // Error message
  if (error) {
    return (
      <div className="absolute bottom-4 left-4 bg-red-500/90 text-white p-4 rounded-lg shadow-lg max-w-md z-10">
        <h4 className="font-bold mb-1">Error</h4>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // Loading indicator
  if (isLoading && loadingProgress) {
    return (
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg z-10">
        <h4 className="font-bold mb-2 text-sm">Loading...</h4>
        <div className="w-64">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {loadingProgress.stage}: {loadingProgress.percentage.toFixed(1)}%
            {loadingProgress.total > 0 && ` (${formatNumber(loadingProgress.loaded)} / ${formatNumber(loadingProgress.total)})`}
          </p>
        </div>
      </div>
    );
  }

  // Stats panel
  if (showStats && pointCloud && metrics) {
    return (
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg z-10">
        <h4 className="font-bold mb-2 text-sm">Point Cloud Info</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Format:</span>
            <span className="font-mono">{metrics.format.toUpperCase()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Total Points:</span>
            <span className="font-mono">{formatNumber(metrics.totalPoints)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Visible Points:</span>
            <span className="font-mono">{formatNumber(metrics.visiblePoints)}</span>
          </div>
          {metrics.totalPoints > metrics.visiblePoints && (
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 italic">
              ⚠ Auto-downsampled for performance ({((metrics.visiblePoints / metrics.totalPoints) * 100).toFixed(1)}% shown)
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">File Size:</span>
            <span className="font-mono">{formatFileSize(metrics.fileSize)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Load Time:</span>
            <span className="font-mono">{(metrics.loadTime / 1000).toFixed(2)}s</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Has Colors:</span>
            <span className="font-mono">{pointCloud.hasColor ? 'Yes' : 'No'}</span>
          </div>
          <div className="mt-2 pt-2 border-t">
            <span className="text-gray-600 dark:text-gray-400">Bounds:</span>
            <div className="mt-1 font-mono text-xs">
              <div>X: [{pointCloud.bounds.min.x.toFixed(2)}, {pointCloud.bounds.max.x.toFixed(2)}]</div>
              <div>Y: [{pointCloud.bounds.min.y.toFixed(2)}, {pointCloud.bounds.max.y.toFixed(2)}]</div>
              <div>Z: [{pointCloud.bounds.min.z.toFixed(2)}, {pointCloud.bounds.max.z.toFixed(2)}]</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
