'use client';

import { useEffect } from 'react';

import { selectViewMode, usePointCloudStore } from '../../store/point-cloud-store';
import { ViewMode } from '../../types';

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'fullWindow', label: 'Full Window' },
  { value: 'fullscreen', label: 'Fullscreen' },
];

export function ViewModeSelector() {
  const viewMode = usePointCloudStore(selectViewMode);
  const setViewMode = usePointCloudStore((state) => state.setViewMode);

  useEffect(() => {
    const container = document.getElementById('point-cloud-viewer-container');
    if (!container) return;

    // Apply view mode styles
    if (viewMode === 'fullWindow') {
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.zIndex = '50';
    } else if (viewMode === 'fullscreen') {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((error) => {
          console.error('Error entering fullscreen:', error);
        });
      }
    } else {
      // Normal mode - restore styles
      container.style.position = '';
      container.style.top = '';
      container.style.left = '';
      container.style.width = '';
      container.style.height = '';
      container.style.zIndex = '';

      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((error) => {
          console.error('Error exiting fullscreen:', error);
        });
      }
    }
  }, [viewMode]);

  // Listen to fullscreen changes to sync state
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && viewMode === 'fullscreen') {
        // User exited fullscreen via ESC or other means
        setViewMode('normal');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [viewMode, setViewMode]);

  return (
    <div className="flex gap-1 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg p-1">
      {VIEW_MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setViewMode(mode.value)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-all
            ${
              viewMode === mode.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
          title={`Switch to ${mode.label} mode`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
