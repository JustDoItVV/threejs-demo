/* eslint-disable react-hooks/preserve-manual-memoization */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useThree } from '@react-three/fiber';

import { FrogPlayer } from './frog-player';
import { LaneGenerator } from './lane-generator';
import { Obstacles } from './obstacles';
import { Lane, Obstacle } from './types';

import type { GameState } from './index';
interface GameSceneProps {
  gameState: GameState;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

export function GameScene({ gameState, onGameOver, onScoreUpdate }: GameSceneProps) {
  const { camera } = useThree();
  const scoreRef = useRef(0);
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 0 });
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [currentPlatform, setCurrentPlatform] = useState<Obstacle | null>(null);

  // Generate initial lanes
  useEffect(() => {
    if (gameState === 'playing') {
      const initialLanes = generateLanes(10, -20);
      console.log('Generated initial lanes:', initialLanes.length, 'lanes');
      setLanes(initialLanes);
      setObstacles(generateObstacles(initialLanes));
    }
  }, [gameState]);

  // Reset camera and score on game start
  useEffect(() => {
    if (gameState === 'playing') {
      camera.position.set(8, 8, 8);
      camera.lookAt(0, 0, 0);
      scoreRef.current = 0;
      onScoreUpdate(0);
      setPlayerPos({ x: 0, z: 0 });
    }
  }, [gameState, camera, onScoreUpdate]);

  const checkCollision = (x: number, z: number) => {
    const playerLane = lanes.find((lane) => Math.abs(lane.position - z) < 0.5);

    if (!playerLane) return;

    // Check if on river without platform
    if (playerLane.type === 'river') {
      const platform = obstacles.find(
        (obs) =>
          (obs.type === 'log' || obs.type === 'lilypad') &&
          Math.abs(obs.position.z - z) < 0.5 &&
          Math.abs(obs.position.x - x) < 0.8
      );

      if (!platform) {
        setCurrentPlatform(null);
        onGameOver(scoreRef.current);
      } else {
        setCurrentPlatform(platform);
      }
    } else {
      setCurrentPlatform(null);
    }

    // Check collision with cars
    if (playerLane.type === 'road') {
      const hitByCar = obstacles.some(
        (obs) =>
          obs.type === 'car' &&
          Math.abs(obs.position.z - z) < 0.5 &&
          Math.abs(obs.position.x - x) < 0.8
      );

      if (hitByCar) {
        onGameOver(scoreRef.current);
      }
    }
  };

  const handlePlayerMove = useCallback(
    (newX: number, newZ: number) => {
      setPlayerPos({ x: newX, z: newZ });

      // Update score when player moves forward
      if (newZ < -scoreRef.current) {
        scoreRef.current = Math.abs(Math.floor(newZ));
        onScoreUpdate(scoreRef.current);

        // Generate new lanes ahead
        const minLaneZ = Math.min(...lanes.map((l) => l.position));
        if (newZ < minLaneZ + 15) {
          const newLanes = generateLanes(minLaneZ - 10, minLaneZ);
          setLanes((prev) => [...prev, ...newLanes]);
          setObstacles((prev) => [...prev, ...generateObstacles(newLanes)]);
        }
      }

      // Move camera to follow player (isometric view - 45 degrees in all directions)
      const offset = 8;
      camera.position.set(newX + offset, offset, newZ + offset);
      camera.lookAt(newX, 0, newZ);

      // Check collision
      checkCollision(newX, newZ);
    },
    [lanes, camera, onScoreUpdate]
  );

  const handleObstacleUpdate = (id: string, newX: number) => {
    setObstacles((prev) =>
      prev.map((obs) => (obs.id === id ? { ...obs, position: { ...obs.position, x: newX } } : obs))
    );
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.4} />
      <hemisphereLight args={['#87CEEB', '#6B8E23', 0.5]} />

      {/* Lanes */}
      <LaneGenerator lanes={lanes} playerZ={playerPos.z} />

      {/* Obstacles */}
      {gameState === 'playing' && (
        <Obstacles obstacles={obstacles} onObstacleUpdate={handleObstacleUpdate} />
      )}

      {/* Player */}
      {gameState === 'playing' && (
        <FrogPlayer onMove={handlePlayerMove} platform={currentPlatform} />
      )}
    </>
  );
}

// Generate lanes with random types
function generateLanes(startZ: number, endZ: number): Lane[] {
  const lanes: Lane[] = [];
  for (let z = startZ; z >= endZ; z--) {
    const random = Math.random();
    let type: Lane['type'];
    let speed: number | undefined;
    let direction: 1 | -1 | undefined;

    if (z === 0 || z === -1) {
      type = 'grass'; // Safe starting lanes
    } else if (random < 0.3) {
      type = 'grass';
    } else if (random < 0.65) {
      type = 'road';
      speed = 1 + Math.random() * 2;
      direction = Math.random() > 0.5 ? 1 : -1;
    } else {
      type = 'river';
      speed = 0.5 + Math.random() * 1.5;
      direction = Math.random() > 0.5 ? 1 : -1;
    }

    lanes.push({
      id: `lane-${z}`,
      type,
      position: z,
      speed,
      direction,
    });
  }
  return lanes;
}

// Generate obstacles for lanes
function generateObstacles(lanes: Lane[]): Obstacle[] {
  const obstacles: Obstacle[] = [];

  lanes.forEach((lane) => {
    if (lane.type === 'road' && lane.speed && lane.direction) {
      // Generate 2-3 cars per road lane (4x wider spacing)
      const carCount = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < carCount; i++) {
        const colors = ['#FF5722', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0'];
        obstacles.push({
          id: `car-${lane.id}-${i}`,
          laneId: lane.id,
          type: 'car',
          position: {
            x: -20 + (i * 44) / carCount,
            z: lane.position,
          },
          size: { width: 0.8, height: 0.4, depth: 0.6 },
          speed: lane.speed * lane.direction,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    if (lane.type === 'river' && lane.speed && lane.direction) {
      // Generate 2-4 logs/lilypads per river lane (4x wider spacing)
      const platformCount = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < platformCount; i++) {
        const isLog = Math.random() > 0.3;
        obstacles.push({
          id: `platform-${lane.id}-${i}`,
          laneId: lane.id,
          type: isLog ? 'log' : 'lilypad',
          position: {
            x: -20 + (i * 44) / platformCount,
            z: lane.position,
          },
          size: isLog
            ? { width: 1.5, height: 0.3, depth: 0.3 }
            : { width: 0.8, height: 0.1, depth: 0.8 },
          speed: lane.speed * lane.direction,
        });
      }
    }
  });

  return obstacles;
}
