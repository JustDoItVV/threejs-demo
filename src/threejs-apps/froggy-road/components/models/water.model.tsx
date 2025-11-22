'use client';

import { PropsWithChildren } from 'react';

import { TILE_SIZE, TILES_PER_ROW } from '../../config/game.coofig';

interface WaterModelProps extends PropsWithChildren {
  y: number;
}

export function WaterModel({ y, children }: WaterModelProps) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0, -1.5]}>
        <boxGeometry args={[TILES_PER_ROW * TILE_SIZE, TILE_SIZE, 3]} />
        <meshLambertMaterial color={0x4a90e2} />
      </mesh>
      {children}
    </group>
  );
}
