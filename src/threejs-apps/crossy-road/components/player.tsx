import { useRef, useEffect } from 'react';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useGameStore } from '../store/game-store';
import { TILE_SIZE, STEP_TIME, JUMP_HEIGHT } from '../utils/constants';

export function Player() {
  const playerRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  const playerPosition = useGameStore((state) => state.playerPosition);
  const movesQueue = useGameStore((state) => state.movesQueue);
  const stepCompleted = useGameStore((state) => state.stepCompleted);

  // Initialize clock
  useEffect(() => {
    clockRef.current = new THREE.Clock(false);
  }, []);

  // Animate player movement
  useFrame(() => {
    if (!playerRef.current || !bodyRef.current || !clockRef.current) return;

    // No moves in queue - reset position and stop clock
    if (movesQueue.length === 0) {
      if (clockRef.current.running) {
        clockRef.current.stop();
      }

      // Set to current position
      playerRef.current.position.x = playerPosition.currentTile * TILE_SIZE;
      playerRef.current.position.y = playerPosition.currentRow * TILE_SIZE;
      bodyRef.current.position.z = 10;

      return;
    }

    // Start clock if not running
    if (!clockRef.current.running) {
      clockRef.current.start();
    }

    const progress = Math.min(1, clockRef.current.getElapsedTime() / STEP_TIME);

    // Calculate start and end positions
    const startX = playerPosition.currentTile * TILE_SIZE;
    const startY = playerPosition.currentRow * TILE_SIZE;
    let endX = startX;
    let endY = startY;

    const currentMove = movesQueue[0];

    if (currentMove === 'left') endX -= TILE_SIZE;
    if (currentMove === 'right') endX += TILE_SIZE;
    if (currentMove === 'forward') endY += TILE_SIZE;
    if (currentMove === 'backward') endY -= TILE_SIZE;

    // Interpolate position
    playerRef.current.position.x = THREE.MathUtils.lerp(startX, endX, progress);
    playerRef.current.position.y = THREE.MathUtils.lerp(startY, endY, progress);

    // Jump animation
    bodyRef.current.position.z = Math.sin(progress * Math.PI) * JUMP_HEIGHT + 10;

    // Step completed
    if (progress >= 1) {
      stepCompleted();
      clockRef.current.stop();
    }
  });

  return (
    <group ref={playerRef}>
      <mesh ref={bodyRef} position={[0, 0, 10]}>
        <boxGeometry args={[15, 15, 20]} />
        <meshLambertMaterial color="white" />
      </mesh>
    </group>
  );
}
