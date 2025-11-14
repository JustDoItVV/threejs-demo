'use client';

import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { selectPointCloud, usePointCloudStore } from '../../store/point-cloud-store';

export function CursorCoordinates() {
  const pointCloud = usePointCloudStore(selectPointCloud);
  const { camera, raycaster, scene } = useThree();
  const [coords, setCoords] = useState<{ x: number; y: number; z: number } | null>(null);
  const [screenPos, setScreenPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!pointCloud) return;

    const handleMouseMove = (event: MouseEvent) => {
      // Update screen position
      setScreenPos({ x: event.clientX, y: event.clientY });

      // Calculate normalized device coordinates
      const canvas = event.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y: number = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update raycaster
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      // Raycast against point cloud
      const pointsObjects = scene.children.filter((child) => child.type === 'Points');

      if (pointsObjects.length > 0) {
        const intersects = raycaster.intersectObjects(pointsObjects, false);

        if (intersects.length > 0) {
          const point = intersects[0].point;
          setCoords({
            x: point.x,
            y: point.y,
            z: point.z,
          });
        } else {
          // If no intersection, show camera's forward projection
          const distance = 10;
          const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
          const projected = camera.position.clone().add(direction.multiplyScalar(distance));

          setCoords({
            x: projected.x,
            y: projected.y,
            z: projected.z,
          });
        }
      }
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);

      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [pointCloud, camera, raycaster, scene]);

  if (!coords || !pointCloud) return null;

  return (
    <div
      className="fixed bg-black/80 text-white px-2 py-1 rounded text-xs font-mono pointer-events-none z-50"
      style={{
        left: `${screenPos.x + 15}px`,
        top: `${screenPos.y + 15}px`,
      }}
    >
      <div>X: {coords.x.toFixed(2)}</div>
      <div>Y: {coords.y.toFixed(2)}</div>
      <div>Z: {coords.z.toFixed(2)}</div>
    </div>
  );
}
