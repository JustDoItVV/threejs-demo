'use client';

import { useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import {
  LANE_WIDTH,
  LOG_BOB_AMPLITUDE,
  LOG_BOB_PERIOD,
  WRAP_BUFFER,
} from '../../../config/movement.config';
import { useStore } from '../../../store';
import { EGameState, ILaneObject } from '../../../types';
import { LogModel } from '../../models/log.model';

interface LogProps {
  log: ILaneObject;
  laneId: number;
  objectIndex: number;
}

export function Log({ log, laneId, objectIndex }: LogProps) {
  const groupRef = useRef<THREE.Group>(null);
  const worldXRef = useRef(log.worldX);
  const timeRef = useRef(0);
  const updateAccumulatorRef = useRef(0);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const gameState = useStore.getState().state;
    if (gameState !== EGameState.Game) return;

    timeRef.current += delta;
    updateAccumulatorRef.current += delta;

    worldXRef.current += log.velocity * log.direction * delta;

    if (worldXRef.current > LANE_WIDTH / 2 + WRAP_BUFFER) {
      worldXRef.current = -LANE_WIDTH / 2 - WRAP_BUFFER;
    }
    if (worldXRef.current < -LANE_WIDTH / 2 - WRAP_BUFFER) {
      worldXRef.current = LANE_WIDTH / 2 + WRAP_BUFFER;
    }

    const bobOffset =
      Math.sin((timeRef.current * 2 * Math.PI) / LOG_BOB_PERIOD) * LOG_BOB_AMPLITUDE;
    const zPosition = bobOffset;

    groupRef.current.position.set(worldXRef.current, 0, zPosition);

    if (updateAccumulatorRef.current >= 0.1) {
      updateAccumulatorRef.current = 0;
      useStore.getState().updateLaneObjectPosition(laneId, objectIndex, worldXRef.current);
    }
  });

  return (
    <group ref={groupRef}>
      <LogModel xPosition={0} yPosition={0} />
    </group>
  );
}
