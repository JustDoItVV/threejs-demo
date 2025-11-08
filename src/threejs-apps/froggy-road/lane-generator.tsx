'use client';

import { useMemo } from 'react';

import { Lane } from './types';

interface LaneGeneratorProps {
  lanes: Lane[];
  playerZ: number;
}

export function LaneGenerator({ lanes, playerZ }: LaneGeneratorProps) {
  const visibleLanes = useMemo(() => {
    // Show lanes within camera view range
    const minZ = Math.floor(playerZ) - 15;
    const maxZ = Math.floor(playerZ) + 15;
    return lanes.filter((lane) => lane.position >= minZ && lane.position <= maxZ);
  }, [lanes, playerZ]);

  return (
    <>
      {visibleLanes.map((lane) => (
        <group key={lane.id} position={[0, 0, lane.position]}>
          {/* Lane base - using BoxGeometry, 4x wider */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[40, 0.2, 1]} />
            <meshLambertMaterial color={getLaneColor(lane.type)} />
          </mesh>

          {/* Lane markers for roads */}
          {lane.type === 'road' && (
            <>
              {/* Center dashed line */}
              {[-2, -1, 0, 1, 2].map((i) => (
                <mesh key={i} position={[0, 0.15, i * 0.3]}>
                  <boxGeometry args={[0.1, 0.05, 0.15]} />
                  <meshLambertMaterial color="#FFF" />
                </mesh>
              ))}
            </>
          )}

          {/* River effect - slightly higher */}
          {lane.type === 'river' && (
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[40, 0.05, 1]} />
              <meshLambertMaterial
                color="#1E88E5"
                transparent
                opacity={0.7}
              />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

function getLaneColor(type: Lane['type']): string {
  switch (type) {
    case 'grass':
      return '#6B8E23';
    case 'road':
      return '#3a3a3a';
    case 'river':
      return '#2196F3';
    default:
      return '#6B8E23';
  }
}
