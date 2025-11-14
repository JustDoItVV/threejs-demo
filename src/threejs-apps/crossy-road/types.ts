import type * as THREE from 'three';

export type Direction = 'forward' | 'backward' | 'left' | 'right';

export type GameState = 'menu' | 'playing' | 'gameOver';

export type DisplayMode = 'normal' | 'fullWindow' | 'fullscreen';

export interface Position {
  currentRow: number;
  currentTile: number;
}

export interface TreeData {
  tileIndex: number;
  height: number;
}

export interface VehicleData {
  initialTileIndex: number;
  color: number;
  ref?: THREE.Group;
}

export interface ForestRowData {
  type: 'forest';
  trees: TreeData[];
}

export interface CarRowData {
  type: 'car';
  direction: boolean;
  speed: number;
  vehicles: VehicleData[];
}

export type RowData = ForestRowData | CarRowData;

export interface DebugInfo {
  playerPosition: Position;
  cameraPosition: { x: number; y: number; z: number };
  cameraZoom: number;
  vehicleCount: number;
  fps: number;
  ms: number;
}
