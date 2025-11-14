'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export type CameraType = 'perspective' | 'orthographic';

interface CameraControlsProps {
  cameraType?: CameraType;
  onCameraTypeChange?: (type: CameraType) => void;
  modelBounds?: THREE.Box3 | null;
}

export function CameraControls({ cameraType = 'perspective', onCameraTypeChange, modelBounds }: CameraControlsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera>(null);
  const { camera, size } = useThree();
  const [enabled, setEnabled] = useState(true);
  const [initialSetup, setInitialSetup] = useState(false);

  const moveCameraTo = (
    position: [number, number, number],
    target: [number, number, number] = [0, 0, 0]
  ) => {
    if (!controlsRef.current) return;

    const activeCamera = cameraType === 'perspective' ? perspectiveCameraRef.current : orthographicCameraRef.current;
    if (!activeCamera) return;

    const startPosition = activeCamera.position.clone();
    const endPosition = new THREE.Vector3(...position);
    const startTarget = controlsRef.current.target.clone();
    const endTarget = new THREE.Vector3(...target);

    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      activeCamera.position.lerpVectors(startPosition, endPosition, eased);
      controlsRef.current.target.lerpVectors(startTarget, endTarget, eased);
      controlsRef.current.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const toggleCameraType = () => {
    const newType = cameraType === 'perspective' ? 'orthographic' : 'perspective';
    onCameraTypeChange?.(newType);
  };

  // Auto-adjust camera based on model bounds
  useEffect(() => {
    if (!modelBounds || !controlsRef.current || initialSetup) return;

    const activeCamera = cameraType === 'perspective' ? perspectiveCameraRef.current : orthographicCameraRef.current;
    if (!activeCamera) return;

    // Get model center and size
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    modelBounds.getCenter(center);
    modelBounds.getSize(size);

    // Calculate appropriate camera distance
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraType === 'perspective' ? 50 : 45;
    const cameraDistance = maxDim / (2 * Math.tan((fov * Math.PI) / 360)) * 1.5;

    // Set camera position and target
    const position = new THREE.Vector3(
      center.x + cameraDistance * 0.5,
      center.y + cameraDistance * 0.5,
      center.z + cameraDistance
    );

    activeCamera.position.copy(position);
    controlsRef.current.target.copy(center);
    controlsRef.current.minDistance = maxDim * 0.5;
    controlsRef.current.maxDistance = maxDim * 3;
    controlsRef.current.update();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialSetup(true);
  }, [modelBounds, cameraType, initialSetup]);

  // Reset initial setup when model bounds change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialSetup(false);
  }, [modelBounds]);

  // Expose functions to window for external access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/immutability
      window.moveCameraTo = moveCameraTo;
      // eslint-disable-next-line react-hooks/immutability
      window.disableOrbitControls = () => setEnabled(false);
      // eslint-disable-next-line react-hooks/immutability
      window.enableOrbitControls = () => setEnabled(true);
      // eslint-disable-next-line react-hooks/immutability
      window.toggleCameraType = toggleCameraType;
    }
  }, [cameraType]);

  return (
    <>
      {/* Perspective Camera */}
      {cameraType === 'perspective' && (
        <>
          <PerspectiveCamera
            ref={perspectiveCameraRef}
            makeDefault
            position={[3, 3, 6]}
            fov={50}
          />
          <OrbitControls
            ref={controlsRef}
            enabled={enabled}
            target={[0, 2.1, 0]}
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
            maxPolarAngle={Math.PI / 1.8}
          />
        </>
      )}

      {/* Orthographic Camera */}
      {cameraType === 'orthographic' && (
        <>
          <OrthographicCamera
            ref={orthographicCameraRef}
            makeDefault
            position={[3, 3, 6]}
            zoom={100}
            left={-size.width / 2}
            right={size.width / 2}
            top={size.height / 2}
            bottom={-size.height / 2}
            near={0.1}
            far={1000}
          />
          <OrbitControls
            ref={controlsRef}
            enabled={enabled}
            target={[0, 2.1, 0]}
            enableDamping
            dampingFactor={0.05}
            minZoom={50}
            maxZoom={200}
            maxPolarAngle={Math.PI / 1.8}
          />
        </>
      )}
    </>
  );
}

// Type definitions for window extensions
declare global {
  interface Window {
    moveCameraTo: (position: [number, number, number], target?: [number, number, number]) => void;
    disableOrbitControls: () => void;
    enableOrbitControls: () => void;
    toggleCameraType: () => void;
  }
}
