'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useStore } from '@/threejs-apps/froggy-road/store';
import { OrthographicCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

const CAMERA_OFFSET = new THREE.Vector3(300, -300, 300);

export function PlayerCamera() {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const currentPosRef = useRef(new THREE.Vector3(300, -300, 300));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const { size: viewportSize } = useThree();
  const viewMode = useStore((state) => state.viewMode);

  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const baseSize = 300;
    const viewRatio = viewportSize.width / viewportSize.height;
    const width = viewRatio < 1 ? baseSize : baseSize * viewRatio;
    const height = viewRatio < 1 ? baseSize / viewRatio : baseSize;

    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.updateProjectionMatrix();
  }, [viewportSize.width, viewportSize.height, viewMode]);

  useFrame(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const { enableFreeCameraControl } = useStore.getState();

    if (enableFreeCameraControl) {
      return;
    }

    const playerPos = useStore.getState().coordinates;

    const targetPosition = new THREE.Vector3(
      playerPos.x + CAMERA_OFFSET.x,
      playerPos.y + CAMERA_OFFSET.y,
      playerPos.z + CAMERA_OFFSET.z
    );

    const targetLookAt = new THREE.Vector3(playerPos.x, playerPos.y, 0);

    currentPosRef.current.lerp(targetPosition, 0.1);
    currentLookAtRef.current.lerp(targetLookAt, 0.1);

    camera.position.copy(currentPosRef.current);
    camera.lookAt(currentLookAtRef.current);
  });

  return (
    <>
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        near={1}
        far={2000}
        up={[0, 0, 1]}
        position={[300, -300, 300]}
      />
    </>
  );
}
