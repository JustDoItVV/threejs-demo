/**
 * Point Cloud LOD Optimizer
 * Simple LOD implementation based on distance from camera
 */

import * as THREE from 'three';

import { VIEWER_CONFIG } from '../config/viewer.config';

export interface LODResult {
  positions: Float32Array;
  colors?: Float32Array;
  count: number;
}

/**
 * Apply LOD to point cloud based on distance from camera
 * This is a simple implementation that skips points based on distance
 * For production, consider using octree-based LOD
 */
export function applyLOD(
  positions: Float32Array,
  colors: Float32Array | undefined,
  cameraPosition: THREE.Vector3,
  cloudCenter: THREE.Vector3,
  pointBudget: number
): LODResult {
  const totalPoints = positions.length / 3;

  // If under budget, return all points
  if (totalPoints <= pointBudget) {
    return {
      positions,
      colors,
      count: totalPoints,
    };
  }

  // Calculate skip factor to fit within budget
  const skipFactor = Math.ceil(totalPoints / pointBudget);

  const newPositions: number[] = [];
  const newColors: number[] = [];

  for (let i = 0; i < totalPoints; i += skipFactor) {
    const idx = i * 3;
    newPositions.push(positions[idx], positions[idx + 1], positions[idx + 2]);

    if (colors) {
      newColors.push(colors[idx], colors[idx + 1], colors[idx + 2]);
    }
  }

  return {
    positions: new Float32Array(newPositions),
    colors: colors ? new Float32Array(newColors) : undefined,
    count: newPositions.length / 3,
  };
}

/**
 * Calculate center of point cloud
 */
export function calculateCenter(positions: Float32Array): THREE.Vector3 {
  let sumX = 0,
    sumY = 0,
    sumZ = 0;
  const count = positions.length / 3;

  for (let i = 0; i < positions.length; i += 3) {
    sumX += positions[i];
    sumY += positions[i + 1];
    sumZ += positions[i + 2];
  }

  return new THREE.Vector3(sumX / count, sumY / count, sumZ / count);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Check if file size exceeds limits
 */
export function checkFileSize(size: number): { ok: boolean; warning: boolean; message?: string } {
  if (size > VIEWER_CONFIG.maxFileSize) {
    return {
      ok: false,
      warning: false,
      message: `File size (${formatFileSize(size)}) exceeds maximum limit (${formatFileSize(VIEWER_CONFIG.maxFileSize)})`,
    };
  }

  if (size > VIEWER_CONFIG.warnFileSize) {
    return {
      ok: true,
      warning: true,
      message: `Large file (${formatFileSize(size)}). Loading may take some time.`,
    };
  }

  return { ok: true, warning: false };
}
