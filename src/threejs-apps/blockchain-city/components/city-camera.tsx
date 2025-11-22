import { useRef } from 'react';
import * as THREE from 'three';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import type { OrbitControls as OrbitControlsType } from 'three-stdlib';

interface CityCameraProps {
  autoTour?: boolean;
}

export function CityCamera({ autoTour = false }: CityCameraProps) {
  const controlsRef = useRef<OrbitControlsType>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const tourProgress = useRef(0);

  useFrame((state, delta) => {
    if (!autoTour || !controlsRef.current || !cameraRef.current) return;

    tourProgress.current += delta * 0.1;

    // Circular camera path around center
    const radius = 20;
    const height = 12;
    const angle = tourProgress.current;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = height + Math.sin(angle * 2) * 3;

    cameraRef.current.position.x = x;
    cameraRef.current.position.y = y;
    cameraRef.current.position.z = z;

    // Look at center (origin)
    controlsRef.current.target.set(0, 2, 0);
    controlsRef.current.update();
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[15, 10, 15]} fov={60} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, 2, 0]}
        enabled={!autoTour}
      />
    </>
  );
}
