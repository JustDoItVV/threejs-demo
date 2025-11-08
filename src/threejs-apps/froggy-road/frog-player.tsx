'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import { Obstacle } from './types';

interface FrogPlayerProps {
  onMove: (newX: number, newZ: number) => void;
  platform: Obstacle | null;
}

const GRID_SIZE = 1;
const MOVE_DURATION = 0.2;

export function FrogPlayer({ onMove, platform }: FrogPlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [gridPosition, setGridPosition] = useState({ x: 0, z: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, z: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const moveProgress = useRef(0);
  const startPosition = useRef({ x: 0, z: 0 });
  const previousPlatformX = useRef<number | null>(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMoving) return;

      let newX = gridPosition.x;
      let newZ = gridPosition.z;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newZ -= GRID_SIZE;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX -= GRID_SIZE;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX += GRID_SIZE;
          break;
        default:
          return;
      }

      // Limit movement range (4x wider field)
      if (Math.abs(newX) > 18) return;

      startPosition.current = { ...gridPosition };
      setTargetPosition({ x: newX, z: newZ });
      setIsMoving(true);
      moveProgress.current = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gridPosition, isMoving]);

  // Animate movement and handle platform riding
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isMoving) {
      moveProgress.current += delta / MOVE_DURATION;

      if (moveProgress.current >= 1) {
        // Movement complete
        moveProgress.current = 1;
        setIsMoving(false);
        setGridPosition(targetPosition);
        onMove(targetPosition.x, targetPosition.z);
      }

      // Smooth interpolation with hop animation
      const t = Math.min(moveProgress.current, 1);
      const eased = 1 - Math.pow(1 - t, 3); // Ease out cubic

      const currentX = THREE.MathUtils.lerp(startPosition.current.x, targetPosition.x, eased);
      const currentZ = THREE.MathUtils.lerp(startPosition.current.z, targetPosition.z, eased);

      // Hop arc (parabola)
      const hopHeight = Math.sin(t * Math.PI) * 0.5;

      groupRef.current.position.set(currentX, hopHeight, currentZ);
    } else if (platform) {
      // Frog riding on platform (log or lilypad)
      if (previousPlatformX.current !== null) {
        const platformDelta = platform.position.x - previousPlatformX.current;
        const newX = gridPosition.x + platformDelta;

        // Update grid position to match platform movement
        setGridPosition({ x: newX, z: gridPosition.z });
        groupRef.current.position.set(newX, 0, gridPosition.z);
      }
      previousPlatformX.current = platform.position.x;
    } else {
      // Not on platform
      previousPlatformX.current = null;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]} rotation={[0, Math.PI, 0]}>
      {/* Frog body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.6]} />
        <meshLambertMaterial color="#4CAF50" />
      </mesh>

      {/* Frog head */}
      <mesh position={[0, 0.25, 0.15]} castShadow>
        <boxGeometry args={[0.4, 0.25, 0.3]} />
        <meshLambertMaterial color="#66BB6A" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.12, 0.4, 0.25]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshLambertMaterial color="#FFF" />
      </mesh>
      <mesh position={[0.12, 0.4, 0.25]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshLambertMaterial color="#FFF" />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.12, 0.4, 0.32]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshLambertMaterial color="#000" />
      </mesh>
      <mesh position={[0.12, 0.4, 0.32]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshLambertMaterial color="#000" />
      </mesh>

      {/* Back legs */}
      <mesh position={[-0.2, -0.1, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.3]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>
      <mesh position={[0.2, -0.1, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.3]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>

      {/* Front legs */}
      <mesh position={[-0.2, -0.1, -0.15]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.2]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>
      <mesh position={[0.2, -0.1, -0.15]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.2]} />
        <meshLambertMaterial color="#388E3C" />
      </mesh>
    </group>
  );
}
