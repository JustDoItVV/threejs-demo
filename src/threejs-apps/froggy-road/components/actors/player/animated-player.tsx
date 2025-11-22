'use client';

import { useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import { TILE_SIZE } from '../../../config/game.coofig';
import { LOG_BOB_AMPLITUDE, LOG_BOB_PERIOD } from '../../../config/movement.config';
import { useStore } from '../../../store';
import { EGameState } from '../../../types';

interface AnimatedPlayerProps {
  children: React.ReactNode;
}

const ANIMATION_SPEED = 0.08;
const JUMP_HEIGHT = 8;

export function AnimatedPlayer({ children }: AnimatedPlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const gameState = useStore.getState().state;
    if (gameState !== EGameState.Game) return;

    timeRef.current += delta;

    const {
      isMoving,
      isBouncing,
      bounceDirection,
      animationProgress,
      startPosition,
      targetPosition,
      updateAnimationProgress,
      updateCoordinates,
      completeAnimation,
      completeBounce,
      isOnLog,
      currentLog,
      checkWaterCollision,
      mountLog,
      dismountLog,
    } = useStore.getState();

    if (isBouncing) {
      const newProgress = Math.min(animationProgress + ANIMATION_SPEED, 1);
      updateAnimationProgress(newProgress);

      const midPoint = { ...startPosition };
      if (bounceDirection === 'forward') {
        midPoint.y += TILE_SIZE / 2;
      } else if (bounceDirection === 'left') {
        midPoint.x -= TILE_SIZE / 2;
      } else if (bounceDirection === 'right') {
        midPoint.x += TILE_SIZE / 2;
      }

      let x: number, y: number;

      if (newProgress < 0.5) {
        const phase1Progress = newProgress * 2;
        x = THREE.MathUtils.lerp(startPosition.x, midPoint.x, phase1Progress);
        y = THREE.MathUtils.lerp(startPosition.y, midPoint.y, phase1Progress);
      } else {
        const phase2Progress = (newProgress - 0.5) * 2;
        x = THREE.MathUtils.lerp(midPoint.x, startPosition.x, phase2Progress);
        y = THREE.MathUtils.lerp(midPoint.y, startPosition.y, phase2Progress);
      }

      const jumpOffset = Math.sin(newProgress * Math.PI) * JUMP_HEIGHT;
      group.position.set(x, y, jumpOffset);
      updateCoordinates({ x, y, z: jumpOffset });

      if (newProgress >= 1) {
        completeBounce();
      }

      return;
    }

    if (!isMoving) {
      const { coordinates } = useStore.getState();

      if (isOnLog && currentLog) {
        const bobOffset =
          Math.sin((timeRef.current * 2 * Math.PI) / LOG_BOB_PERIOD) * LOG_BOB_AMPLITUDE;
        group.position.set(currentLog.worldX, coordinates.y, bobOffset);
        updateCoordinates({ x: currentLog.worldX, y: coordinates.y, z: bobOffset });
      } else {
        group.position.set(coordinates.x, coordinates.y, coordinates.z);
      }
      return;
    }

    if (isOnLog) {
      dismountLog();
    }

    const newProgress = Math.min(animationProgress + ANIMATION_SPEED, 1);
    updateAnimationProgress(newProgress);

    const x = THREE.MathUtils.lerp(startPosition.x, targetPosition.x, newProgress);
    const y = THREE.MathUtils.lerp(startPosition.y, targetPosition.y, newProgress);
    const z = THREE.MathUtils.lerp(startPosition.z, targetPosition.z, newProgress);

    group.position.set(x, y, z);
    updateCoordinates({ x, y, z });

    if (group) {
      const jumpOffset = Math.sin(newProgress * Math.PI) * JUMP_HEIGHT;
      group.position.z = jumpOffset;
    }

    if (newProgress >= 1) {
      completeAnimation();

      const waterCheck = checkWaterCollision();
      if (waterCheck.onLog && waterCheck.log) {
        mountLog(waterCheck.log);
      }
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
