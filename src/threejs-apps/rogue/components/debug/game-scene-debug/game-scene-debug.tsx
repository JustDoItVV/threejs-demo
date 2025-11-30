'use client';

import { useRef } from 'react';

import { TILE_SIZE } from '@/threejs-apps/rogue/config/game.config';
import { CameraControls } from '@react-three/drei';

import { selectController, selectRenderTrigger, useStore } from '../../../store';
import { GroundGrid } from './ground-grid/ground-grid';

export function GameSceneDebug() {
  useStore(selectRenderTrigger);
  const controller = useStore(selectController);
  const character = controller?.getEntitiesToRender().character;
  const charRoom = character?.position.room;
  const showGrid = useStore((state) => state.showGrid);
  const showMarkers = useStore((state) => state.showMarkers);
  const enableFreeCameraControl = useStore((state) => state.enableFreeCameraControl);
  const cameraControlsRef = useRef<CameraControls | null>(null);

  if (!charRoom) return null;

  const worldX = charRoom.fieldX + character.position.x;
  const worldY = charRoom.fieldY + character.position.y;

  return (
    <>
      {showGrid && <GroundGrid />}
      {showMarkers && (
        <>
          <mesh position={[worldX, worldY, 1]}>
            <boxGeometry args={[0.5, 0.5, 2]} />
            <meshBasicMaterial color="red" />
          </mesh>

          <mesh
            position={[
              charRoom.fieldX + charRoom.sizeX / 2 - TILE_SIZE / 2,
              charRoom.fieldY + charRoom.sizeY / 2 - TILE_SIZE / 2,
              0.1,
            ]}
          >
            <boxGeometry args={[0.3, 0.3, 1.5]} />
            <meshBasicMaterial color="green" />
          </mesh>

          <axesHelper args={[50]} />
        </>
      )}
      {enableFreeCameraControl && <CameraControls ref={cameraControlsRef} />}
    </>
  );
}
