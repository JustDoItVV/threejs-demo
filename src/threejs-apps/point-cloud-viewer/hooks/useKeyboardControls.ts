import { useEffect } from 'react';

import { usePointCloudStore } from '../store/point-cloud-store';

/**
 * Global keyboard controls
 * Handles app-level hotkeys like camera toggle, help, etc.
 */
export function useKeyboardControls() {
  const setCameraMode = usePointCloudStore((state) => state.setCameraMode);
  const cameraMode = usePointCloudStore((state) => state.cameraMode);
  const toggleHelp = usePointCloudStore((state) => state.toggleHelp);
  const toggleControlPanel = usePointCloudStore((state) => state.toggleControlPanel);
  const toggleFileLoader = usePointCloudStore((state) => state.toggleFileLoader);
  const resetCamera = usePointCloudStore((state) => state.resetCamera);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'KeyC':
          // Toggle camera mode
          setCameraMode(cameraMode === 'orthographic' ? 'firstPerson' : 'orthographic');
          break;

        case 'KeyH':
          // Toggle help
          toggleHelp();
          break;

        case 'KeyP':
          // Toggle control panel
          toggleControlPanel();
          break;

        case 'KeyL':
          // Open file loader
          toggleFileLoader();
          break;

        case 'KeyR':
          // Reset camera
          resetCamera();
          break;

        case 'Escape':
          // Close file loader if open
          const showFileLoader = usePointCloudStore.getState().showFileLoader;
          if (showFileLoader) {
            toggleFileLoader();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cameraMode, setCameraMode, toggleHelp, toggleControlPanel, toggleFileLoader, resetCamera]);
}
