'use client';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { PointCloudScene } from './components/three/PointCloudScene';
import { ControlPanel } from './components/ui/ControlPanel';
import { FileLoader } from './components/ui/FileLoader';
import { InfoPanel } from './components/ui/InfoPanel';
import { useKeyboardControls } from './hooks/useKeyboardControls';

export function PointCloudViewer() {
  // Initialize keyboard controls
  useKeyboardControls();

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Three.js Canvas */}
      <CanvasWrapper className="bg-gray-900">
        <PointCloudScene />
      </CanvasWrapper>

      {/* UI Overlays */}
      <ControlPanel />
      <InfoPanel />
      <FileLoader />

      {/* Welcome Message (when no point cloud loaded) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white/70">
          <h1 className="text-3xl font-bold mb-2">Point Cloud Viewer</h1>
          <p className="text-lg mb-4">Press L or click &quot;Load Point Cloud&quot; to get started</p>
          <p className="text-sm">
            Supported formats: LAS, LAZ, PTS, PTX
          </p>
        </div>
      </div>
    </div>
  );
}
