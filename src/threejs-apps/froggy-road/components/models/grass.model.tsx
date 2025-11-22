import { PropsWithChildren } from 'react';

import { TILE_SIZE, TILES_PER_ROW } from '../../config/game.coofig';

interface GrassModelProps extends PropsWithChildren {
  y: number;
}

export function GrassModel({ y, children }: GrassModelProps) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0, -1.5]}>
        <boxGeometry args={[TILES_PER_ROW * TILE_SIZE, TILE_SIZE, 3]} />
        <meshLambertMaterial color={0xbaf455} />
      </mesh>
      {children}
    </group>
  );
}
