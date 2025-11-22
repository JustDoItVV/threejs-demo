import { StateCreator } from 'zustand';

import { TILE_INDEX_MAX, TILE_INDEX_MIN, TILE_SIZE } from '../../config/game.coofig';
import { EPlayerModels, ICoordinates } from '../../types';
import { CollisionSlice } from './collision.slice';
import { LevelSlice } from './level.slice';
import { StatisticsSlice } from './statistics.slice';

export interface PlayerSlice {
  coordinates: ICoordinates;
  model: EPlayerModels;
  isMoving: boolean;
  animationProgress: number;
  startPosition: ICoordinates;
  targetPosition: ICoordinates;
  isForwardMovement: boolean;
  isBouncing: boolean;
  bounceDirection: 'forward' | 'left' | 'right' | null;
  moveForward: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  resetPosition: () => void;
  updateAnimationProgress: (progress: number) => void;
  updateCoordinates: (coordinates: ICoordinates) => void;
  completeAnimation: () => void;
  startBounce: (direction: 'forward' | 'left' | 'right') => void;
  completeBounce: () => void;
  setModel: (model: EPlayerModels) => void;
}

const INITIAL_COORDINATES: ICoordinates = { x: 0, y: 0, z: 0 };

export const createPlayerSlice: StateCreator<
  PlayerSlice & LevelSlice & StatisticsSlice & CollisionSlice,
  [],
  [],
  PlayerSlice
> = (set, get) => ({
  coordinates: INITIAL_COORDINATES,
  model: EPlayerModels.Frog,
  isMoving: false,
  animationProgress: 0,
  startPosition: INITIAL_COORDINATES,
  targetPosition: INITIAL_COORDINATES,
  isForwardMovement: false,
  isBouncing: false,
  bounceDirection: null,

  moveForward: () => {
    const { coordinates, isMoving, isBouncing, addLaneAhead, incrementScore, checkTreeCollision } =
      get();
    if (isMoving || isBouncing) return;

    const targetY = coordinates.y + TILE_SIZE;

    if (checkTreeCollision(coordinates.x, targetY)) {
      get().startBounce('forward');
      return;
    }

    addLaneAhead();
    incrementScore();

    set({
      isMoving: true,
      animationProgress: 0,
      startPosition: { ...coordinates },
      targetPosition: { ...coordinates, y: targetY },
      isForwardMovement: true,
    });
  },

  moveLeft: () => {
    const { coordinates, isMoving, isBouncing, checkTreeCollision } = get();
    if (isMoving || isBouncing) return;

    const newX = coordinates.x - TILE_SIZE;
    const minX = TILE_INDEX_MIN * TILE_SIZE;
    if (newX >= minX) {
      if (checkTreeCollision(newX, coordinates.y)) {
        get().startBounce('left');
        return;
      }

      set({
        isMoving: true,
        animationProgress: 0,
        startPosition: { ...coordinates },
        targetPosition: { ...coordinates, x: newX },
        isForwardMovement: false,
      });
    }
  },

  moveRight: () => {
    const { coordinates, isMoving, isBouncing, checkTreeCollision } = get();
    if (isMoving || isBouncing) return;

    const newX = coordinates.x + TILE_SIZE;
    const maxX = TILE_INDEX_MAX * TILE_SIZE;
    if (newX <= maxX) {
      if (checkTreeCollision(newX, coordinates.y)) {
        get().startBounce('right');
        return;
      }

      set({
        isMoving: true,
        animationProgress: 0,
        startPosition: { ...coordinates },
        targetPosition: { ...coordinates, x: newX },
        isForwardMovement: false,
      });
    }
  },

  resetPosition: () => {
    set({
      coordinates: INITIAL_COORDINATES,
      isMoving: false,
      animationProgress: 0,
      startPosition: INITIAL_COORDINATES,
      targetPosition: INITIAL_COORDINATES,
      isBouncing: false,
      bounceDirection: null,
    });
  },

  updateAnimationProgress: (progress) => {
    set({ animationProgress: progress });
  },

  updateCoordinates: (coordinates) => {
    set({ coordinates });
  },

  completeAnimation: () => {
    const { targetPosition, isForwardMovement, removeLaneBehind } = get();

    if (isForwardMovement) {
      removeLaneBehind();
    }

    set({
      coordinates: targetPosition,
      isMoving: false,
      animationProgress: 0,
      isForwardMovement: false,
    });
  },

  startBounce: (direction: 'forward' | 'left' | 'right') => {
    const { coordinates } = get();
    set({
      isBouncing: true,
      bounceDirection: direction,
      animationProgress: 0,
      startPosition: { ...coordinates },
    });
  },

  completeBounce: () => {
    const { startPosition } = get();
    set({
      coordinates: startPosition,
      isBouncing: false,
      bounceDirection: null,
      animationProgress: 0,
    });
  },

  setModel: (model: EPlayerModels) => {
    set({ model });
  },
});
