'use client';

import { useMemo } from 'react';

import { Room } from '../../core/types/game-types';

interface RoomMeshProps {
  room: Room;
  useBasicMaterial?: boolean;
  disableFog?: boolean;
}

export function RoomMesh({ room, useBasicMaterial = false, disableFog = false }: RoomMeshProps) {
  const floorColor = useMemo(() => {
    const colors = ['#5a4a3a', '#4a3a2a', '#6a5a4a'];
    // @ts-expect-error -- tmp
    return colors[room.number % colors.length];
    // @ts-expect-error -- tmp
  }, [room.number]);

  const wallHeight = 0.5;
  const wallThickness = 0.1;

  const opacity = disableFog ? 1.0 : room.isSeen ? 1.0 : 0.3;
  const MaterialComponent = useBasicMaterial ? 'meshBasicMaterial' : 'meshLambertMaterial';

  const centerX = room.fieldX + room.sizeX / 2;
  const centerY = room.fieldY + room.sizeY / 2;

  return (
    <group>
      <mesh position={[centerX, centerY, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.sizeX, room.sizeY]} />
        <MaterialComponent color={floorColor} opacity={opacity} transparent />
      </mesh>

      <mesh position={[centerX, room.fieldY, wallHeight / 2]} castShadow>
        <boxGeometry args={[room.sizeX + wallThickness * 2, wallHeight, wallThickness]} />
        <MaterialComponent color="#3a2a1a" opacity={opacity} transparent />
      </mesh>

      <mesh position={[centerX, room.fieldY + room.sizeY, wallHeight / 2]} castShadow>
        <boxGeometry args={[room.sizeX + wallThickness * 2, wallHeight, wallThickness]} />
        <MaterialComponent color="#3a2a1a" opacity={opacity} transparent />
      </mesh>

      <mesh position={[room.fieldX, centerY, wallHeight / 2]} castShadow>
        <boxGeometry args={[wallThickness, wallHeight, room.sizeY]} />
        <MaterialComponent color="#3a2a1a" opacity={opacity} transparent />
      </mesh>

      <mesh position={[room.fieldX + room.sizeX, centerY, wallHeight / 2]} castShadow>
        <boxGeometry args={[wallThickness, wallHeight, room.sizeY]} />
        <MaterialComponent color="#3a2a1a" opacity={opacity} transparent />
      </mesh>
    </group>
  );
}
