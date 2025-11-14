'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import {
  selectCameraMode,
  selectPointCloud,
  selectShowBounds,
  selectShowGrid,
  usePointCloudStore,
} from '../../store/point-cloud-store';
import { FirstPersonCameraController } from './FirstPersonCameraController';
import { OrthographicCameraController } from './OrthographicCameraController';
import { PointCloudRenderer } from './PointCloudRenderer';

export function PointCloudScene() {
  const cameraMode = usePointCloudStore(selectCameraMode);
  const pointCloud = usePointCloudStore(selectPointCloud);
  const showBounds = usePointCloudStore(selectShowBounds);
  const showGrid = usePointCloudStore(selectShowGrid);

  const originalUpRef = useRef(new THREE.Vector3());

  // Set Z-up coordinate system
  useEffect(() => {
    // Save original DEFAULT_UP
    originalUpRef.current.copy(THREE.Object3D.DEFAULT_UP);

    // Set Z-up coordinate system for point clouds
    THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

    // Restore on unmount
    return () => {
      THREE.Object3D.DEFAULT_UP.copy(originalUpRef.current);
    };
  }, []);

  // Calculate grid size based on point cloud bounds
  const gridSize = pointCloud
    ? Math.max(
        pointCloud.bounds.max.x - pointCloud.bounds.min.x,
        pointCloud.bounds.max.y - pointCloud.bounds.min.y,
        pointCloud.bounds.max.z - pointCloud.bounds.min.z
      ) * 1.5
    : 100;

  return (
    <>
      {/* Camera */}
      {cameraMode === 'orthographic' ? (
        <OrthographicCameraController />
      ) : (
        <FirstPersonCameraController />
      )}

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[100, 100, 100]} intensity={0.8} />
      <hemisphereLight args={['#ffffff', '#444444', 0.4]} />

      {/* Grid Helper (XY plane for Z-up) */}
      {showGrid && (
        <>
          <gridHelper
            args={[gridSize, 50, '#555555', '#333333']}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
          />
          <axesHelper args={[gridSize / 4]} />
        </>
      )}

      {/* Point Cloud */}
      {pointCloud && <PointCloudRenderer />}

      {/* Bounding Box */}
      {showBounds && pointCloud && (
        <mesh position={[
          (pointCloud.bounds.min.x + pointCloud.bounds.max.x) / 2,
          (pointCloud.bounds.min.y + pointCloud.bounds.max.y) / 2,
          (pointCloud.bounds.min.z + pointCloud.bounds.max.z) / 2,
        ]}>
          <boxGeometry
            args={[
              pointCloud.bounds.max.x - pointCloud.bounds.min.x,
              pointCloud.bounds.max.y - pointCloud.bounds.min.y,
              pointCloud.bounds.max.z - pointCloud.bounds.min.z,
            ]}
          />
          <meshBasicMaterial color="#00ff00" wireframe />
        </mesh>
      )}

      {/* Empty scene placeholder */}
      {!pointCloud && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      )}
    </>
  );
}
