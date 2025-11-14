'use client';

import { useEffect, useState } from 'react';

export function ViewModeButtons() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullWindow, setIsFullWindow] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreen = async () => {
    const container = document.getElementById('point-cloud-viewer-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      try {
        await container.requestFullscreen();
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    } else {
      // Exit fullscreen
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error('Error exiting fullscreen:', error);
      }
    }
  };

  const handleFullWindow = () => {
    const container = document.getElementById('point-cloud-viewer-container');
    if (!container) return;

    if (!isFullWindow) {
      // Enter full window mode
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.zIndex = '50';

      setIsFullWindow(true);
    } else {
      // Exit full window mode
      container.style.position = '';
      container.style.top = '';
      container.style.left = '';
      container.style.width = '';
      container.style.height = '';
      container.style.zIndex = '';

      setIsFullWindow(false);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
      <button
        onClick={handleFullWindow}
        className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
        title="Toggle full window mode"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isFullWindow ? (
            // Minimize icon
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
              />
            </>
          ) : (
            // Maximize window icon
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </>
          )}
        </svg>
        <span>{isFullWindow ? 'Exit Full Window' : 'Full Window'}</span>
      </button>

      <button
        onClick={handleFullscreen}
        className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
        title="Toggle fullscreen mode"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isFullscreen ? (
            // Exit fullscreen icon
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </>
          ) : (
            // Enter fullscreen icon
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </>
          )}
        </svg>
        <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
      </button>
    </div>
  );
}
