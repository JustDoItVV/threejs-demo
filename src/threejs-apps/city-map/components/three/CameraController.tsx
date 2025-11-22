import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { OrthographicCamera as OrthographicCameraImpl, PerspectiveCamera as PerspectiveCameraImpl, Vector3 } from 'three';

import { MAP_CONFIG } from '../../config/map.config';
import { useMapStore } from '../../store/map-store';
import { CameraMode } from '../../types/map-types';

interface CameraControllerProps {
  mode?: CameraMode;
}

export function CameraController({ mode }: CameraControllerProps) {
  const { cameraMode } = useMapStore();
  const currentMode = mode ?? cameraMode;

  const { camera, size } = useThree();
  const orthoCameraRef = useRef<OrthographicCameraImpl>(null);
  const perspCameraRef = useRef<PerspectiveCameraImpl>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const prevModeRef = useRef<CameraMode>(currentMode);

  useEffect(() => {
    if (prevModeRef.current !== currentMode) {
      setIsTransitioning(true);
      setTransitionProgress(0);
      prevModeRef.current = currentMode;
    }
  }, [currentMode]);

  useFrame((state, delta) => {
    if (isTransitioning) {
      const speed = 1 / MAP_CONFIG.CAMERAS.transitionDuration;
      const newProgress = Math.min(transitionProgress + delta * speed, 1);
      setTransitionProgress(newProgress);

      if (newProgress >= 1) {
        setIsTransitioning(false);
        setTransitionProgress(0);
      }
    }
  });

  const orthoConfig = MAP_CONFIG.CAMERAS.orthographic;
  const perspConfig = MAP_CONFIG.CAMERAS.perspective;

  // Обновляем размеры orthographic камеры при изменении размера экрана
  const aspect = size.width / size.height;
  const orthoSize = 100;
  const orthoLeft = (-orthoSize * aspect) / 2;
  const orthoRight = (orthoSize * aspect) / 2;
  const orthoTop = orthoSize / 2;
  const orthoBottom = -orthoSize / 2;

  return (
    <>
      {currentMode === '2d' ? (
        <>
          <OrthographicCamera
            ref={orthoCameraRef}
            makeDefault
            zoom={orthoConfig.zoom}
            position={orthoConfig.position}
            left={orthoLeft}
            right={orthoRight}
            top={orthoTop}
            bottom={orthoBottom}
            near={orthoConfig.near}
            far={orthoConfig.far}
          />
          <OrbitControls
            enableRotate={false}
            enablePan={true}
            minZoom={50}
            maxZoom={200}
            panSpeed={1}
          />
        </>
      ) : (
        <>
          <PerspectiveCamera
            ref={perspCameraRef}
            makeDefault
            fov={perspConfig.fov}
            position={perspConfig.position}
            near={perspConfig.near}
            far={perspConfig.far}
          />
          <OrbitControls
            enableRotate={true}
            enablePan={true}
            minDistance={100}
            maxDistance={800}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 6}
            panSpeed={0.5}
            rotateSpeed={0.5}
          />
        </>
      )}
    </>
  );
}
