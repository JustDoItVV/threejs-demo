'use client';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { PointCloudScene } from './components/three/PointCloudScene';
import { ControlPanel } from './components/ui/ControlPanel';
import { CursorCoordinates } from './components/ui/CursorCoordinates';
import { FileLoader } from './components/ui/FileLoader';
import { InfoPanel } from './components/ui/InfoPanel';
import { PerformanceStats } from './components/ui/PerformanceStats';
import { useKeyboardControls } from './hooks/useKeyboardControls';

export function PointCloudViewer() {
  // Initialize keyboard controls
  useKeyboardControls();

  return (
    <div id="point-cloud-viewer-container" className="relative w-full h-full bg-gray-900">
      {/* Three.js Canvas */}
      <CanvasWrapper className="bg-gray-900">
        <PointCloudScene />
      </CanvasWrapper>

      {/* UI Overlays */}
      <ControlPanel />
      <InfoPanel />
      <FileLoader />
      <PerformanceStats />
      <CursorCoordinates />

      {/* Welcome Message (when no point cloud loaded) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white/70">
          <h1 className="text-3xl font-bold mb-2">Point Cloud Viewer</h1>
          <p className="text-lg mb-4">Press L or click &quot;Load Point Cloud&quot; to get started</p>
          <p className="text-sm mb-2">
            Supported formats: LAS, LAZ, PTS, PTX
          </p>
          <p className="text-xs text-white/50">
            Note: LAS/LAZ versions 1.0-1.3 only (v1.4+ requires conversion)
          </p>
        </div>
      </div>
    </div>
  );
}
