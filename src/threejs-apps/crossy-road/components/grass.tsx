import { TILES_PER_ROW, TILE_SIZE } from '../utils/constants';

interface GrassProps {
  rowIndex: number;
}

export function Grass({ rowIndex }: GrassProps) {
  return (
    <group position={[0, rowIndex * TILE_SIZE, 0]}>
      {/* Foundation */}
      <mesh position={[0, 0, 1.5]}>
        <boxGeometry args={[TILES_PER_ROW * TILE_SIZE, TILE_SIZE, 3]} />
        <meshLambertMaterial color={0xbaf455} />
      </mesh>
    </group>
  );
}
