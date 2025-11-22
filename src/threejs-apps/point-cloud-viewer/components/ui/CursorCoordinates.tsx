'use client';

import { useState, useEffect } from 'react';
import { selectPointCloud, usePointCloudStore } from '../../store/point-cloud-store';

export function CursorCoordinates() {
  const pointCloud = usePointCloudStore(selectPointCloud);
  const [coords, setCoords] = useState<{ x: number; y: number; z: number } | null>(null);
  const [screenPos, setScreenPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pointCloud) return;

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      // Check if mouse is over canvas
      const isOverCanvas =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      setVisible(isOverCanvas);

      if (isOverCanvas) {
        // Update screen position
        setScreenPos({ x: event.clientX, y: event.clientY });

        // Calculate normalized device coordinates
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // For now, show NDC coordinates (simplified version without raycasting)
        // This avoids the need to access Three.js context from outside Canvas
        const { center } = pointCloud.bounds.min;
        const centerX = (pointCloud.bounds.min.x + pointCloud.bounds.max.x) / 2;
        const centerY = (pointCloud.bounds.min.y + pointCloud.bounds.max.y) / 2;
        const centerZ = (pointCloud.bounds.min.z + pointCloud.bounds.max.z) / 2;

        const sizeX = pointCloud.bounds.max.x - pointCloud.bounds.min.x;
        const sizeY = pointCloud.bounds.max.y - pointCloud.bounds.min.y;

        // Approximate world position based on NDC
        setCoords({
          x: centerX + (x * sizeX) / 2,
          y: centerY + (y * sizeY) / 2,
          z: centerZ,
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pointCloud]);

  if (!coords || !pointCloud || !visible) return null;

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
