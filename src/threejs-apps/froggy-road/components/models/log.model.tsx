'use client';

import { TILE_SIZE } from '../../config/game.coofig';

interface LogModelProps {
  xPosition: number;
  yPosition: number;
}

export function LogModel({ xPosition, yPosition }: LogModelProps) {
  const logLength = TILE_SIZE * 2;
  const logSize = TILE_SIZE * 0.3;

  return (
    <group position={[xPosition, yPosition, 0]}>
      <mesh>
        <boxGeometry args={[logLength, logSize, logSize]} />
        <meshLambertMaterial color={0xa56506} />
      </mesh>
    </group>
  );
}
