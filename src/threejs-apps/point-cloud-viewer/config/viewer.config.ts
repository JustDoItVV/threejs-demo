/**
 * Point Cloud Viewer Configuration
 */

import { OrthographicCameraConfig, FirstPersonCameraConfig } from '../types';

export const VIEWER_CONFIG = {
  // File constraints
  maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
  warnFileSize: 500 * 1024 * 1024, // 500MB warning threshold

  // Performance
  defaultPointBudget: 2_000_000, // Max points to render
  minPointBudget: 100_000,
  maxPointBudget: 5_000_000,

  // Point rendering
  defaultPointSize: 2,
  minPointSize: 0.5,
  maxPointSize: 10,

  // LOD (Level of Detail)
  lodLevels: [
    { distance: 0, skip: 1 }, // Full resolution
    { distance: 50, skip: 2 }, // Skip every other point
    { distance: 100, skip: 4 }, // Skip 3 out of 4 points
    { distance: 200, skip: 8 }, // Skip 7 out of 8 points
  ],

  // Supported formats
  supportedFormats: ['las', 'laz', 'pts', 'ptx'] as const,

  // File extensions
  acceptedExtensions: '.las,.laz,.pts,.ptx',
};

export const DEFAULT_ORTHOGRAPHIC_CONFIG: OrthographicCameraConfig = {
  zoom: 50,
  minZoom: 1,
  maxZoom: 500,
  panSpeed: 1.0,
  rotationSpeed: 0.5,
  position: { x: 50, y: -50, z: 50 },
  target: { x: 0, y: 0, z: 0 },
};

export const DEFAULT_FIRST_PERSON_CONFIG: FirstPersonCameraConfig = {
  movementSpeed: 10,
  fastMovementMultiplier: 3,
  lookSensitivity: 0.002,
  position: { x: 0, y: 0, z: 10 },
  rotation: { x: 0, y: 0 },
  verticalSpeed: 5,
};

export const KEYBOARD_CONTROLS = {
  // Orthographic camera
  orthographic: {
    panLeft: ['KeyA', 'ArrowLeft'],
    panRight: ['KeyD', 'ArrowRight'],
    panForward: ['KeyW', 'ArrowUp'],
    panBackward: ['KeyS', 'ArrowDown'],
    rotateLeft: ['KeyQ'],
    rotateRight: ['KeyE'],
  },

  // First person camera
  firstPerson: {
    moveForward: ['KeyW', 'ArrowUp'],
    moveBackward: ['KeyS', 'ArrowDown'],
    moveLeft: ['KeyA', 'ArrowLeft'],
    moveRight: ['KeyD', 'ArrowRight'],
    moveUp: ['Space'],
    moveDown: ['ShiftLeft', 'ShiftRight'],
    sprint: ['ShiftLeft', 'ShiftRight'],
  },

  // Global
  global: {
    toggleCamera: ['KeyC'],
    toggleHelp: ['KeyH'],
    resetCamera: ['KeyR'],
  },
};
