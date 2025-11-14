import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useGameStore } from '../store/game-store';

export function useCollisionDetection(
  playerRef: React.RefObject<THREE.Group>,
  vehicleRefs: Map<string, React.MutableRefObject<THREE.Group | null>>
) {
  const playerPosition = useGameStore((state) => state.playerPosition);
  const mapRows = useGameStore((state) => state.mapRows);
  const gameState = useGameStore((state) => state.gameState);
  const gameOver = useGameStore((state) => state.gameOver);
  const godMode = useGameStore((state) => state.godMode);

  const playerBoundingBox = useRef(new THREE.Box3());

  useFrame(() => {
    if (gameState !== 'playing' || !playerRef.current || godMode) return;

    // Get current row
    const currentRow = mapRows[playerPosition.currentRow - 1];
    if (!currentRow) return;

    // Only check collision on car rows
    if (currentRow.type !== 'car') return;

    // Update player bounding box
    playerBoundingBox.current.setFromObject(playerRef.current);

    // Check collision with each vehicle in current row
    let collision = false;
    const rowIndex = playerPosition.currentRow - 1;

    currentRow.vehicles.forEach((vehicle, vehicleIndex) => {
      const key = `${rowIndex}-${vehicleIndex}`;
      const vehicleRef = vehicleRefs.get(key);

      if (!vehicleRef?.current) return;

      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(vehicleRef.current);

      if (playerBoundingBox.current.intersectsBox(vehicleBoundingBox)) {
        collision = true;
      }
    });

    if (collision) {
      gameOver();
    }
  });
}
