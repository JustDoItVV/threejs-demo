import { TILES_PER_ROW, TILE_SIZE } from '../utils/constants';

interface RoadProps {
  rowIndex: number;
}

export function Road({ rowIndex }: RoadProps) {
  return (
    <group position={[0, rowIndex * TILE_SIZE, 0]}>
      {/* Foundation */}
      <mesh>
        <planeGeometry args={[TILES_PER_ROW * TILE_SIZE, TILE_SIZE]} />
        <meshLambertMaterial color={0x454a59} />
      </mesh>
    </group>
  );
}
