/**
 * Camera configuration types
 */

export type CameraMode = 'orthographic' | 'firstPerson';

export type ViewMode = 'normal' | 'fullWindow' | 'fullscreen';

export interface OrthographicCameraConfig {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  panSpeed: number;
  rotationSpeed: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
}

export interface FirstPersonCameraConfig {
  movementSpeed: number;
  fastMovementMultiplier: number;
  lookSensitivity: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number }; // pitch, yaw
  verticalSpeed: number; // For up/down movement
}

export interface CameraControls {
  enablePan: boolean;
  enableRotate: boolean;
  enableZoom: boolean;
  enableLook: boolean;
  enableMove: boolean;
}
