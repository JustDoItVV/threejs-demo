'use client';

import { TILE_SIZE } from '../../config/game.coofig';

export function BoxModel() {
  return (
    <mesh position={[0, 0, TILE_SIZE / 2]}>
      <boxGeometry args={[TILE_SIZE / 4, TILE_SIZE / 4, TILE_SIZE]} />
      <meshLambertMaterial color="white" />
    </mesh>
  );
}
