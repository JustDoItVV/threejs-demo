'use client';

import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';

import { TILE_SIZE } from '../../config/game.coofig';
import { useStore } from '../../store';
import { EGameState, ELaneType } from '../../types';

const CHECK_INTERVAL = 0.1;

export function CollisionChecker() {
  const timeAccumulatorRef = useRef(0);

  useFrame((state, delta) => {
    const {
      state: gameState,
      isMoving,
      isBouncing,
      coordinates,
      lanes,
      isOnLog,
      checkCarCollision,
      gameOver,
    } = useStore.getState();

    if (gameState !== EGameState.Game) return;
    if (isMoving || isBouncing) return;

    timeAccumulatorRef.current += delta;

    if (timeAccumulatorRef.current < CHECK_INTERVAL) return;

    timeAccumulatorRef.current = 0;

    const carCheck = checkCarCollision();
    if (carCheck.fatal) {
      gameOver();
      return;
    }

    const currentLaneIndex = Math.round(coordinates.y / TILE_SIZE);
    const currentLane = lanes.find((lane) => lane.yIndex === currentLaneIndex);

    if (currentLane && currentLane.type === ELaneType.Water) {
      if (!isOnLog) {
        gameOver();
        return;
      }
    }
  });

  return null;
}
