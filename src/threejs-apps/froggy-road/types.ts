export type LaneType = 'grass' | 'road' | 'river';

export interface Lane {
  id: string;
  type: LaneType;
  position: number;
  speed?: number;
  direction?: 1 | -1;
}

export interface Obstacle {
  id: string;
  laneId: string;
  type: 'car' | 'log' | 'lilypad';
  position: { x: number; z: number };
  size: { width: number; height: number; depth: number };
  speed: number;
  color?: string;
}

export interface PlayerPosition {
  x: number;
  z: number;
}
