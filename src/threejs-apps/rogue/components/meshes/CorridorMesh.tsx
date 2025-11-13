'use client';

import * as THREE from 'three';

import { Corridor, CorridorSegment } from '../../types/game-types';

interface CorridorMeshProps {
  corridor: Corridor;
  disableFog?: boolean;
}

export function CorridorMesh({ corridor, disableFog = false }: CorridorMeshProps) {
  if (!corridor.segments) return null;

  const isVisible = disableFog || corridor.start.room.isSeen || corridor.end.room.isSeen;
  const opacity = isVisible ? 1.0 : 0.3;

  return (
    <group>
      {corridor.segments.map((segment: CorridorSegment, idx: number) => {
        const centerX = segment.fieldX + segment.width / 2;
        const centerY = segment.fieldY + segment.height / 2;
        const z = 0;

        return (
          <mesh key={idx} position={[centerX, centerY, z]} receiveShadow>
            <planeGeometry args={[segment.width, segment.height]} />
            <meshLambertMaterial
              color="#2a1a0a"
              opacity={opacity}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}
