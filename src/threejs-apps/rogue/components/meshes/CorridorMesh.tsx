'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

import { getTileSprite } from '../../config/assets';
import { TILE_SIZE } from '../../config/game.config';
import { Corridor, CorridorSegment } from '../../types/game-types';

interface CorridorMeshProps {
  corridor: Corridor;
  disableFog?: boolean;
}

export function CorridorMesh({ corridor, disableFog = false }: CorridorMeshProps) {
  const useBasicMaterial = false;

  const wallTexture = useMemo(() => {
    try {
      const texturePath = getTileSprite('wall', 0);

      const loader = new THREE.TextureLoader();
      const texture = loader.load(texturePath);

      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      texture.rotation = Math.PI / 2;

      return texture;
    } catch (error) {
      console.error('[RoomMesh] Failed to load wall texture:', error);
      return null;
    }
  }, []);

  if (!corridor.segments) return null;

  const isVisible = disableFog || corridor.start.room.isSeen || corridor.end.room.isSeen;
  const color = isVisible ? 'white' : 'grey';

  const MaterialComponent = useBasicMaterial ? 'meshBasicMaterial' : 'meshLambertMaterial';

  const wallMaterial = wallTexture ? (
    <MaterialComponent map={wallTexture} opacity={1} transparent />
  ) : (
    <MaterialComponent color={color} opacity={1} transparent />
  );

  return (
    <group>
      {corridor.segments.map((segment: CorridorSegment, idx: number) => {
        const centerX = segment.fieldX + segment.width / 2;
        const centerY = segment.fieldY + segment.height / 2;
        const z = 1;

        return (
          <mesh
            key={idx}
            position={[centerX - TILE_SIZE / 2, centerY - TILE_SIZE / 2, z * 2]}
            receiveShadow
          >
            <boxGeometry args={[segment.width, segment.height, z]} />
            {wallMaterial}
          </mesh>
        );
      })}
    </group>
  );
}
