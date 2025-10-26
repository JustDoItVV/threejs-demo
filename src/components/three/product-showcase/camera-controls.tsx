'use client';

import { useRef, useState } from 'react';
import * as THREE from 'three';

import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export function CameraControls() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const [enabled, setEnabled] = useState(true);

  const moveCameraTo = (
    position: [number, number, number],
    target: [number, number, number] = [0, 0, 0]
  ) => {
    if (!controlsRef.current) return;

    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(...position);
    const startTarget = controlsRef.current.target.clone();
    const endTarget = new THREE.Vector3(...target);

    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPosition, endPosition, eased);
      controlsRef.current.target.lerpVectors(startTarget, endTarget, eased);
      controlsRef.current.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/immutability
    window.moveCameraTo = moveCameraTo;
    // eslint-disable-next-line react-hooks/immutability
    window.disableOrbitControls = () => setEnabled(false);
    // eslint-disable-next-line react-hooks/immutability
    window.enableOrbitControls = () => setEnabled(true);
  }

  return (
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
  );
}
