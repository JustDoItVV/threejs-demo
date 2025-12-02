'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

import { getTileSprite } from '../../config/assets';
import { TILE_SIZE } from '../../config/game.config';
import { Room } from '../../types/game-types';

interface RoomMeshProps {
  room: Room;
  useBasicMaterial?: boolean;
  disableFog?: boolean;
}

export function RoomMesh({ room, useBasicMaterial = false, disableFog = false }: RoomMeshProps) {
  const floorTexture = useMemo(() => {
    try {
      const tileIndex = room.id % 3;
      const texturePath = getTileSprite('floor', tileIndex);

      const loader = new THREE.TextureLoader();
      const texture = loader.load(texturePath);

      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(room.sizeX, room.sizeY);

      return texture;
    } catch (error) {
      console.error('[RoomMesh] Failed to load floor texture:', error);
      return null;
    }
  }, [room.id, room.sizeX, room.sizeY]);

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

  const wallHeight = 1.0;
  const wallThickness = 0.15;

  const opacity = disableFog ? 1.0 : room.isSeen ? 1.0 : 0.3;
  const MaterialComponent = useBasicMaterial ? 'meshBasicMaterial' : 'meshLambertMaterial';

  const centerX = room.fieldX + room.sizeX / 2;
  const centerY = room.fieldY + room.sizeY / 2;

  const wallMaterial = wallTexture ? (
    <MaterialComponent map={wallTexture} opacity={opacity} transparent />
  ) : (
    <MaterialComponent color="#3a2a1a" opacity={opacity} transparent />
  );

  return (
    <group>
      {/* Floor */}
      <mesh position={[centerX - TILE_SIZE / 2, centerY - TILE_SIZE / 2, 0]} receiveShadow>
        <planeGeometry args={[room.sizeX, room.sizeY]} />
        {floorTexture ? (
          <MaterialComponent
            map={floorTexture}
            opacity={opacity}
            transparent
            side={THREE.DoubleSide}
          />
        ) : (
          <MaterialComponent
            color="#5a4a3a"
            opacity={opacity}
            transparent
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* North Wall */}
      <mesh
        position={[centerX - TILE_SIZE / 2, room.fieldY - wallThickness / 2 - TILE_SIZE / 2, 0]}
        rotation={[Math.PI / 16, 0, 0]}
        castShadow
      >
        <mesh position={[0, 0, wallHeight / 2]}>
          <boxGeometry args={[room.sizeX, wallThickness, wallHeight]} />
          {wallMaterial}
        </mesh>
      </mesh>

      {/* South Wall */}
      <mesh
        position={[
          centerX - TILE_SIZE / 2,
          room.fieldY + room.sizeY + wallThickness / 2 - TILE_SIZE / 2,
          0,
        ]}
        rotation={[-Math.PI / 16, 0, 0]}
        castShadow
      >
        <mesh position={[0, 0, wallHeight / 2]}>
          <boxGeometry args={[room.sizeX, wallThickness, wallHeight]} />
          {wallMaterial}
        </mesh>
      </mesh>

      {/* West Wall */}
      <mesh
        position={[room.fieldX - wallThickness / 2 - TILE_SIZE / 2, centerY - TILE_SIZE / 2, 0]}
        rotation={[0, -Math.PI / 16, 0]}
        castShadow
      >
        <mesh position={[0, 0, wallHeight / 2]}>
          <boxGeometry args={[wallThickness, room.sizeY, wallHeight]} />
          {wallMaterial}
        </mesh>
      </mesh>

      {/* East Wall */}
      <mesh
        position={[
          room.fieldX + room.sizeX + wallThickness / 2 - TILE_SIZE / 2,
          centerY - TILE_SIZE / 2,
          0,
        ]}
        rotation={[0, Math.PI / 16, 0]}
        castShadow
      >
        <mesh position={[0, 0, wallHeight / 2]}>
          <boxGeometry args={[wallThickness, room.sizeY, wallHeight]} />
          {wallMaterial}
        </mesh>
      </mesh>
    </group>
  );
}
