import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useGameStore } from '../store/game-store';
import { MIN_TILE_INDEX, MAX_TILE_INDEX, TILE_SIZE } from '../utils/constants';

export function useVehicleAnimation(
  vehicleRefs: Map<string, React.MutableRefObject<THREE.Group | null>>
) {
  const mapRows = useGameStore((state) => state.mapRows);
  const gameState = useGameStore((state) => state.gameState);
  const clockRef = useRef(new THREE.Clock());

  useFrame(() => {
    if (gameState !== 'playing') return;

    const delta = clockRef.current.getDelta();
    const beginningOfRow = (MIN_TILE_INDEX - 2) * TILE_SIZE;
    const endOfRow = (MAX_TILE_INDEX + 2) * TILE_SIZE;

    mapRows.forEach((rowData, rowIndex) => {
      if (rowData.type === 'car') {
        rowData.vehicles.forEach((vehicle, vehicleIndex) => {
          const key = `${rowIndex}-${vehicleIndex}`;
          const vehicleRef = vehicleRefs.get(key);

          if (!vehicleRef?.current) return;

          const mesh = vehicleRef.current;

          if (rowData.direction) {
            // Moving forward (positive direction)
            mesh.position.x =
              mesh.position.x > endOfRow
                ? beginningOfRow
                : mesh.position.x + rowData.speed * delta;
          } else {
            // Moving backward (negative direction)
            mesh.position.x =
              mesh.position.x < beginningOfRow
                ? endOfRow
                : mesh.position.x - rowData.speed * delta;
          }
        });
      }
    });
  });
}
