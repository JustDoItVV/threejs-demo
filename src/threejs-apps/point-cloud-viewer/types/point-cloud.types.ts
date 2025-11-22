/**
 * Point Cloud data types
 */

export type PointCloudFormat = 'las' | 'laz' | 'pts' | 'ptx';

export type LoadingSource = 'local' | 'url' | 'yandex' | 'google';

export interface Point {
  x: number;
  y: number;
  z: number;
  intensity?: number;
  r?: number;
  g?: number;
  b?: number;
}

export interface PointCloudData {
  points: Float32Array; // Packed as [x, y, z, r, g, b, ...] or [x, y, z, ...]
  colors?: Float32Array; // Optional separate colors array [r, g, b, ...]
  count: number;
  hasColor: boolean;
  bounds: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  format: PointCloudFormat;
  metadata?: {
    scannerPosition?: { x: number; y: number; z: number };
    transformMatrix?: number[][]; // 4x4 matrix
    [key: string]: unknown;
  };
}

export interface PointCloudMetrics {
  totalPoints: number;
  visiblePoints: number;
  fileSize: number;
  loadTime: number;
  format: PointCloudFormat;
}

export interface LoadingProgress {
  loaded: number;
  total: number;
  percentage: number;
  stage: 'downloading' | 'parsing' | 'processing' | 'complete';
}
