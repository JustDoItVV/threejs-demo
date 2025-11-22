'use client';

import { TILE_SIZE } from '../../config/game.coofig';

interface CarModelProps {
  initialTileIndex: number;
  color: number;
  isPosDirection?: boolean;
}

export function CarModel({ initialTileIndex, color, isPosDirection = true }: CarModelProps) {
  const wheelsColor = 0x333333;

  return (
    <group position={[initialTileIndex * TILE_SIZE, 0, 0]} rotateZ={isPosDirection ? 0 : Math.PI}>
      {/* Main body */}
      <mesh position={[0, 0, 16]}>
        <boxGeometry args={[60, 30, 24]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Upper body */}
      <mesh position={[-5, 0, 38]}>
        <boxGeometry args={[35, 25, 20]} />
        <meshLambertMaterial color="white" />
      </mesh>
      {/* Front wheels */}
      <mesh position={[20, 0, 8]}>
        <boxGeometry args={[8, 32, 16]} />
        <meshLambertMaterial color={wheelsColor} />
      </mesh>
      {/* Back wheels */}
      <mesh position={[-20, 0, 8]}>
        <boxGeometry args={[8, 32, 16]} />
        <meshLambertMaterial color={wheelsColor} />
      </mesh>
    </group>
  );
}
