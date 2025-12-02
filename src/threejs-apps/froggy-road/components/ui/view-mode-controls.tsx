'use client';

import { useEffect, useRef } from 'react';

import { useStore } from '../../store';

export function ViewModeControls() {
  const viewMode = useStore((state) => state.viewMode);
  const toggleFullWindow = useStore((state) => state.toggleFullWindow);
  const toggleFullscreen = useStore((state) => state.toggleFullscreen);
  const setViewMode = useStore((state) => state.setViewMode);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && viewMode === 'fullscreen') {
        setViewMode('normal');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [viewMode, setViewMode]);

  const handleFullscreenClick = async () => {
    if (viewMode === 'fullscreen') {
      toggleFullscreen();
    } else {
      const container = containerRef.current?.parentElement;
      if (container) {
        try {
          await container.requestFullscreen();
          toggleFullscreen();
        } catch (err) {
          console.error('Fullscreen request failed:', err);
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute bottom-4 right-4 z-50 flex gap-2 pointer-events-auto">
      <button
        onClick={toggleFullWindow}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          viewMode === 'fullwindow'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
        }`}
        title="Full Window Mode"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M8 12h8"
          />
        </svg>
      </button>

      <button
        onClick={handleFullscreenClick}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          viewMode === 'fullscreen'
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
        }`}
        title="Fullscreen Mode"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
          />
        </svg>
      </button>
    </div>
  );
}
