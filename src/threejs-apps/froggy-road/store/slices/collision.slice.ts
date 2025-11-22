import { StateCreator } from 'zustand';

import {
    CAR_HALF_SIZE, LOG_HALF_SIZE, PLAYER_COLLISION_THRESHOLD, PLAYER_HALF_SIZE, TREE_HALF_SIZE
} from '../../config/collision.config';
import { TILE_SIZE } from '../../config/game.coofig';
import { ELaneObjectType, ELaneType, ILaneObject } from '../../types';
import {
    checkCollision, createBoundingBox, getOverlapRatio, resetBoundingBoxPool
} from '../../utils/collision';
import { DebugSlice } from './debug.slice';
import { LevelSlice } from './level.slice';
import { PlayerSlice } from './player.slice';

export interface CollisionSlice {
  isOnLog: boolean;
  currentLog: ILaneObject | null;
  checkTreeCollision: (targetX: number, targetY: number) => boolean;
  checkCarCollision: () => { collided: boolean; fatal: boolean };
  checkWaterCollision: () => { onLog: boolean; log: ILaneObject | null; percentage: number };
  mountLog: (log: ILaneObject) => void;
  dismountLog: () => void;
}

export const createCollisionSlice: StateCreator<
  CollisionSlice & PlayerSlice & LevelSlice & DebugSlice,
  [],
  [],
  CollisionSlice
> = (set, get) => ({
  isOnLog: false,
  currentLog: null,

  checkTreeCollision: (targetX: number, targetY: number) => {
    resetBoundingBoxPool();
    const { lanes } = get();
    const playerBox = createBoundingBox(
      { x: targetX, y: targetY, z: TILE_SIZE / 2 },
      PLAYER_HALF_SIZE
    );

    const currentLaneIndex = Math.round(targetY / TILE_SIZE);

    for (const lane of lanes) {
      if (lane.type !== ELaneType.Grass) continue;
      if (Math.abs(lane.yIndex - currentLaneIndex) > 1) continue;

      for (const obj of lane.objects) {
        if (obj.type !== ELaneObjectType.Tree) continue;

        const treeBox = createBoundingBox(
          { x: obj.xIndex * TILE_SIZE, y: lane.yIndex * TILE_SIZE, z: TREE_HALF_SIZE.z },
          TREE_HALF_SIZE
        );

        if (checkCollision(playerBox, treeBox)) {
          return true;
        }
      }
    }

    return false;
  },

  checkCarCollision: () => {
    const { coordinates, lanes, godMode } = get();

    if (godMode) {
      return { collided: false, fatal: false };
    }

    resetBoundingBoxPool();
    const playerBox = createBoundingBox(coordinates, PLAYER_HALF_SIZE);
    const currentLaneIndex = Math.round(coordinates.y / TILE_SIZE);

    for (const lane of lanes) {
      if (lane.type !== ELaneType.Road) continue;
      if (Math.abs(lane.yIndex - currentLaneIndex) > 1) continue;

      for (const obj of lane.objects) {
        if (obj.type !== ELaneObjectType.Car) continue;

        const carBox = createBoundingBox(
          { x: obj.worldX, y: lane.yIndex * TILE_SIZE, z: CAR_HALF_SIZE.z },
          CAR_HALF_SIZE
        );

        if (checkCollision(playerBox, carBox)) {
          return { collided: true, fatal: true };
        }
      }
    }

    return { collided: false, fatal: false };
  },

  checkWaterCollision: () => {
    resetBoundingBoxPool();
    const { coordinates, lanes } = get();
    const playerBox = createBoundingBox(coordinates, PLAYER_HALF_SIZE);
    const currentLaneIndex = Math.round(coordinates.y / TILE_SIZE);

    for (const lane of lanes) {
      if (lane.type !== ELaneType.Water) continue;
      if (lane.yIndex !== currentLaneIndex) continue;

      for (const obj of lane.objects) {
        if (obj.type !== ELaneObjectType.Log) continue;

        const logBox = createBoundingBox(
          { x: obj.worldX, y: lane.yIndex * TILE_SIZE, z: LOG_HALF_SIZE.z },
          LOG_HALF_SIZE
        );

        const overlapRatio = getOverlapRatio(playerBox, logBox);

        if (overlapRatio >= PLAYER_COLLISION_THRESHOLD) {
          return { onLog: true, log: obj, percentage: overlapRatio };
        }
      }

      return { onLog: false, log: null, percentage: 0 };
    }

    return { onLog: false, log: null, percentage: 0 };
  },

  mountLog: (log: ILaneObject) => {
    set({ isOnLog: true, currentLog: log });
  },

  dismountLog: () => {
    set({ isOnLog: false, currentLog: null });
  },
});
