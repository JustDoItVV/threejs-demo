import { TILE_SIZE } from '../utils/constants';

interface TreeProps {
  tileIndex: number;
  height: number;
}

export function Tree({ tileIndex, height }: TreeProps) {
  return (
    <group position={[tileIndex * TILE_SIZE, 0, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0, 10]}>
        <boxGeometry args={[15, 15, 20]} />
        <meshLambertMaterial color={0x4d2926} />
      </mesh>

      {/* Crown */}
      <mesh position={[0, 0, height / 2 + 20]}>
        <boxGeometry args={[30, 30, height]} />
        <meshLambertMaterial color={0x7aa21d} />
      </mesh>
    </group>
  );
}
