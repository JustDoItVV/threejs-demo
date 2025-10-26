'use client';

import { useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import { Obstacle } from './types';

interface ObstaclesProps {
  obstacles: Obstacle[];
  onObstacleUpdate: (id: string, newX: number) => void;
}

export function Obstacles({ obstacles, onObstacleUpdate }: ObstaclesProps) {
  return (
    <>
      {obstacles.map((obstacle) => (
        <MovingObstacle key={obstacle.id} obstacle={obstacle} onUpdate={onObstacleUpdate} />
      ))}
    </>
  );
}

function MovingObstacle({
  obstacle,
  onUpdate,
}: {
  obstacle: Obstacle;
  onUpdate: (id: string, newX: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Sync mesh position with obstacle state
    meshRef.current.position.x = obstacle.position.x;

    const newX = obstacle.position.x + obstacle.speed * delta;

    // Wrap around when out of bounds (4x wider field)
    if (obstacle.speed > 0 && newX > 22) {
      onUpdate(obstacle.id, -22);
    } else if (obstacle.speed < 0 && newX < -22) {
      onUpdate(obstacle.id, 22);
    } else {
      onUpdate(obstacle.id, newX);
    }
  });

  if (obstacle.type === 'car') {
    return (
      <group position={[obstacle.position.x, 0.4, obstacle.position.z]}>
        {/* Car main body */}
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={[obstacle.size.width, obstacle.size.height, obstacle.size.depth]} />
          <meshLambertMaterial color={obstacle.color || '#FF5722'} />
        </mesh>
        {/* Car cabin */}
        <mesh position={[0, 0.35, -0.05]} castShadow>
          <boxGeometry args={[0.55, 0.35, 0.4]} />
          <meshLambertMaterial color="#FFF" />
        </mesh>
        {/* Front wheels */}
        <mesh position={[-0.3, -0.15, 0.25]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.15]} />
          <meshLambertMaterial color="#222" />
        </mesh>
        <mesh position={[0.3, -0.15, 0.25]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.15]} />
          <meshLambertMaterial color="#222" />
        </mesh>
        {/* Back wheels */}
        <mesh position={[-0.3, -0.15, -0.25]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.15]} />
          <meshLambertMaterial color="#222" />
        </mesh>
        <mesh position={[0.3, -0.15, -0.25]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.15]} />
          <meshLambertMaterial color="#222" />
        </mesh>
      </group>
    );
  }

  if (obstacle.type === 'log') {
    return (
      <mesh
        ref={meshRef}
        position={[obstacle.position.x, 0.2, obstacle.position.z]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.2, 0.2, obstacle.size.width, 16]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
    );
  }

  if (obstacle.type === 'lilypad') {
    return (
      <mesh
        ref={meshRef}
        position={[obstacle.position.x, 0.15, obstacle.position.z]}
        castShadow
      >
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshLambertMaterial color="#2E7D32" />
      </mesh>
    );
  }

  return null;
}
