'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import { LANE_WIDTH, WRAP_BUFFER } from '../../../config/movement.config';
import { useStore } from '../../../store';
import { EGameState, ILaneObject } from '../../../types';
import { CarModel } from '../../models/car.model';

interface CarProps {
  car: ILaneObject;
  laneId: number;
  objectIndex: number;
}

export function Car({ car, laneId, objectIndex }: CarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const worldXRef = useRef(car.worldX);
  const updateAccumulatorRef = useRef(0);

  const color = car.color || 0xff0000;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const gameState = useStore.getState().state;
    if (gameState !== EGameState.Game) return;

    updateAccumulatorRef.current += delta;

    worldXRef.current += car.velocity * car.direction * delta;

    if (worldXRef.current > LANE_WIDTH / 2 + WRAP_BUFFER) {
      worldXRef.current = -LANE_WIDTH / 2 - WRAP_BUFFER;
    }
    if (worldXRef.current < -LANE_WIDTH / 2 - WRAP_BUFFER) {
      worldXRef.current = LANE_WIDTH / 2 + WRAP_BUFFER;
    }

    groupRef.current.position.set(worldXRef.current, 0, 0);
    groupRef.current.rotation.z = car.direction === -1 ? Math.PI : 0;

    if (updateAccumulatorRef.current >= 0.1) {
      updateAccumulatorRef.current = 0;
      useStore.getState().updateLaneObjectPosition(laneId, objectIndex, worldXRef.current);
    }
  });

  return (
    <group ref={groupRef}>
      <CarModel initialTileIndex={0} color={color} isPosDirection={car.direction === 1} />
    </group>
  );
}
