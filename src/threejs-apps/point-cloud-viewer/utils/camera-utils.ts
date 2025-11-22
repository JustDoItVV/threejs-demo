/**
 * Camera utilities for auto-fitting point clouds
 */

import { PointCloudData } from '../types';
import { OrthographicCameraConfig, FirstPersonCameraConfig } from '../types';

/**
 * Calculate optimal camera position and zoom to fit the point cloud
 */
export function fitCameraToPointCloud(
  pointCloud: PointCloudData,
  cameraMode: 'orthographic' | 'firstPerson'
): {
  orthographicConfig?: Partial<OrthographicCameraConfig>;
  firstPersonConfig?: Partial<FirstPersonCameraConfig>;
} {
  const { bounds } = pointCloud;

  // Calculate bounding box dimensions
  const sizeX = bounds.max.x - bounds.min.x;
  const sizeY = bounds.max.y - bounds.min.y;
  const sizeZ = bounds.max.z - bounds.min.z;

  // Calculate center of bounding box
  const centerX = (bounds.min.x + bounds.max.x) / 2;
  const centerY = (bounds.min.y + bounds.max.y) / 2;
  const centerZ = (bounds.min.z + bounds.max.z) / 2;

  // Calculate diagonal size of bounding box
  const size = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);

  if (cameraMode === 'orthographic') {
    // For orthographic, calculate zoom to fit the entire model
    const maxDimension = Math.max(sizeX, sizeY, sizeZ);
    const zoom = 50 / (maxDimension || 1); // Adjusted for better initial view

    // Position camera at 45 degree angle to see the model
    const distance = size * 0.8;

    return {
      orthographicConfig: {
        zoom: Math.max(1, zoom),
        position: {
          x: centerX + distance * 0.7,
          y: centerY - distance * 0.7,
          z: centerZ + distance * 0.7,
        },
        target: {
          x: centerX,
          y: centerY,
          z: centerZ,
        },
      },
    };
  } else {
    // For first person, position camera outside and looking at center
    const distance = size * 1.5;

    return {
      firstPersonConfig: {
        position: {
          x: centerX,
          y: centerY - distance,
          z: centerZ + size * 0.5,
        },
        rotation: {
          x: 0, // Looking forward
          y: 0,
        },
      },
    };
  }
}

/**
 * Get info about bounding box size for debugging
 */
export function getBoundsInfo(pointCloud: PointCloudData): {
  size: { x: number; y: number; z: number };
  center: { x: number; y: number; z: number };
  diagonal: number;
} {
  const { bounds } = pointCloud;

  const sizeX = bounds.max.x - bounds.min.x;
  const sizeY = bounds.max.y - bounds.min.y;
  const sizeZ = bounds.max.z - bounds.min.z;

  const centerX = (bounds.min.x + bounds.max.x) / 2;
  const centerY = (bounds.min.y + bounds.max.y) / 2;
  const centerZ = (bounds.min.z + bounds.max.z) / 2;

  const diagonal = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);

  return {
    size: { x: sizeX, y: sizeY, z: sizeZ },
    center: { x: centerX, y: centerY, z: centerZ },
    diagonal,
  };
}
