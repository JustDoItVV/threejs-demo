'use client';

import { useRef } from 'react';
import * as THREE from 'three';

import { useStore } from '@/threejs-apps/rogue/store';
import { OrthographicCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const CAMERA_OFFSET = new THREE.Vector3(0, -4, 25);

export function PlayerCamera() {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const currentPosRef = useRef(CAMERA_OFFSET);
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  const size = 300;
  const viewRatio = window.innerWidth / window.innerHeight;
  const width = viewRatio < 1 ? size : size * viewRatio;
  const height = viewRatio < 1 ? size / viewRatio : size;

  useFrame(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const { enableFreeCameraControl } = useStore.getState();

    if (enableFreeCameraControl) {
      return;
    }

    const playerPos = useStore.getState().controller?.model?.gameSession?.character.position;
    if (!playerPos) return;

    const worldX = (playerPos.room?.fieldX ?? 0) + playerPos.x;
    const worldY = (playerPos.room?.fieldY ?? 0) + playerPos.y;

    const targetPosition = new THREE.Vector3(
      worldX + CAMERA_OFFSET.x,
      worldY + CAMERA_OFFSET.y,
      playerPos.z + CAMERA_OFFSET.z
    );
    const targetLookAt = new THREE.Vector3(worldX, worldY, playerPos.z);
    const zoom = useStore.getState().cameraZoom;

    // currentPosRef.current.lerp(targetPosition, 0.1);
    // currentLookAtRef.current.lerp(targetLookAt, 0.1);
    currentPosRef.current = targetPosition;
    currentLookAtRef.current = targetLookAt;

    camera.position.copy(currentPosRef.current);
    camera.lookAt(currentLookAtRef.current);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        left={width / -2}
        right={width / 2}
        top={height / 2}
        bottom={height / -2}
        near={0.1}
        far={1000}
        up={[0, 0, 1]}
        position={[0, -8, 8]}
      />
    </>
  );
}
