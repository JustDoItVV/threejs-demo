import * as THREE from 'three';

import { useGameStore } from '../store/game-store';
import { Car } from './car';
import { Grass } from './grass';
import { Road } from './road';
import { Tree } from './tree';

interface MapProps {
  vehicleRefs?: Map<string, React.MutableRefObject<THREE.Group | null>>;
}

export function Map({ vehicleRefs }: MapProps) {
  const mapRows = useGameStore((state) => state.mapRows);

  return (
    <group>
      {/* Starting grass row */}
      <Grass rowIndex={0} />

      {/* Generate map rows */}
      {mapRows.map((rowData, index) => {
        const rowIndex = index + 1;

        if (rowData.type === 'forest') {
          return (
            <group key={`row-${rowIndex}`}>
              <Grass rowIndex={rowIndex} />
              {rowData.trees.map((tree, treeIndex) => (
                <group key={`tree-${rowIndex}-${treeIndex}`} position={[0, rowIndex * 42, 0]}>
                  <Tree tileIndex={tree.tileIndex} height={tree.height} />
                </group>
              ))}
            </group>
          );
        }

        if (rowData.type === 'car') {
          return (
            <group key={`row-${rowIndex}`}>
              <Road rowIndex={rowIndex} />
              {rowData.vehicles.map((vehicle, vehicleIndex) => {
                const key = `${index}-${vehicleIndex}`;
                const vehicleRef = vehicleRefs.get(key);

                return (
                  <group key={`car-${rowIndex}-${vehicleIndex}`} position={[0, rowIndex * 42, 0]}>
                    <Car
                      initialTileIndex={vehicle.initialTileIndex}
                      direction={rowData.direction}
                      color={vehicle.color}
                      vehicleRef={vehicleRef}
                    />
                  </group>
                );
              })}
            </group>
          );
        }

        return null;
      })}
    </group>
  );
}
