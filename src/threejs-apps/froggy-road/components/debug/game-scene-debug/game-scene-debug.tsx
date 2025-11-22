'use client';

import { useRef } from 'react';

import { CameraControls } from '@react-three/drei';

import { useStore } from '../../../store';
import { GroundGrid } from './ground-grid/ground-grid';

export function GameSceneDebug() {
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const showGrid = useStore((state) => state.showGrid);
  const showAxes = useStore((state) => state.showAxes);
  const enableFreeCameraControl = useStore((state) => state.enableFreeCameraControl);

  return (
    <>
      {showGrid && <GroundGrid />}
      {showAxes && <axesHelper args={[50]} />}
      {enableFreeCameraControl && <CameraControls ref={cameraControlsRef} />}
    </>
  );
}
