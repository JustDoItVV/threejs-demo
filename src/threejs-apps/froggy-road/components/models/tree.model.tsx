'use client';

import { TILE_SIZE } from '../../config/game.coofig';

interface TreeModelProps {
  tileIndex: number;
  height: number;
}

export function TreeModel({ tileIndex, height }: TreeModelProps) {
  const trunkHeight = 20;
  const trunkSize = 10;
  const crownSize = 20;

  return (
    <group position={[tileIndex * TILE_SIZE, 0, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0, trunkHeight / 2]}>
        <boxGeometry args={[trunkSize, trunkSize, trunkHeight]} />
        <meshLambertMaterial color={0x4d2926} />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 0, (height - trunkHeight) / 2 + trunkHeight]}>
        <boxGeometry args={[crownSize, crownSize, height]} />
        <meshLambertMaterial color={0x7aa21d} />
      </mesh>
    </group>
  );
}
