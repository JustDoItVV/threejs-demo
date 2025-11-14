import { useRef } from 'react';

import * as THREE from 'three';

import { TILE_SIZE } from '../utils/constants';

interface CarProps {
  initialTileIndex: number;
  direction: boolean;
  color: number;
  vehicleRef?: React.MutableRefObject<THREE.Group | null>;
}

export function Car({ initialTileIndex, direction, color, vehicleRef }: CarProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group
      ref={(ref) => {
        groupRef.current = ref;
        if (vehicleRef) {
          vehicleRef.current = ref;
        }
      }}
      position={[initialTileIndex * TILE_SIZE, 0, 0]}
      rotation={[0, 0, direction ? 0 : Math.PI]}
    >
      {/* Main body */}
      <mesh position={[0, 0, 12]}>
        <boxGeometry args={[60, 30, 15]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Cabin */}
      <mesh position={[-6, 0, 25.5]}>
        <boxGeometry args={[33, 24, 12]} />
        <meshLambertMaterial color="white" />
      </mesh>

      {/* Front wheel */}
      <mesh position={[18, 0, 6]}>
        <boxGeometry args={[12, 33, 12]} />
        <meshLambertMaterial color={0x333333} />
      </mesh>

      {/* Back wheel */}
      <mesh position={[-18, 0, 6]}>
        <boxGeometry args={[12, 33, 12]} />
        <meshLambertMaterial color={0x333333} />
      </mesh>
    </group>
  );
}
