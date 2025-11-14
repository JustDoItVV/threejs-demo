import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useCollisionDetection } from '../hooks/use-collision-detection';
import { usePerformanceMonitor } from '../hooks/use-performance-monitor';
import { useVehicleAnimation } from '../hooks/use-vehicle-animation';
import { useGameStore } from '../store/game-store';
import { GameMap } from './map';
import { Player } from './player';

export function GameScene() {
  const playerRef = useRef<THREE.Group>(null);
  const mapRows = useGameStore((state) => state.mapRows);
  const vehicleRefsRef = useRef<Map<string, React.MutableRefObject<THREE.Group | null>>>(
    new Map({})
  );

  // Create vehicle refs when mapRows changes
  useEffect(() => {
    vehicleRefsRef.current.clear();

    mapRows.forEach((row, rowIndex) => {
      if (row.type === 'car') {
        row.vehicles.forEach((_, vehicleIndex) => {
          const key = `${rowIndex}-${vehicleIndex}`;
          vehicleRefsRef.current.set(key, { current: null });
        });
      }
    });
  }, [mapRows]);

  // Use hooks
  useVehicleAnimation(vehicleRefsRef.current);
  useCollisionDetection(playerRef, vehicleRefsRef.current);
  usePerformanceMonitor();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[-100, -100, 200]} intensity={0.8} />

      {/* Game objects */}
      <group ref={playerRef}>
        <Player />
      </group>
      <GameMap vehicleRefs={vehicleRefsRef.current} />
    </>
  );
}
