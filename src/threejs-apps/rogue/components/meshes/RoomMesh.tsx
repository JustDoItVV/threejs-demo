'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

import { getTileSprite } from '../../config/assets';
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

      return texture;
    } catch (error) {
      console.error('[RoomMesh] Failed to load wall texture:', error);
      return null;
    }
  }, []);

  const wallHeight = 1.0;
  const wallThickness = 0.15;
  const cornerSize = wallThickness;

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
      <mesh position={[centerX, centerY, 0]} receiveShadow>
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
      <mesh position={[centerX, room.fieldY - wallThickness / 2, wallHeight / 2]} castShadow>
        <boxGeometry args={[room.sizeX - 2 * cornerSize, wallThickness, wallHeight]} />
        {wallMaterial}
      </mesh>

      {/* South Wall */}
      <mesh
        position={[centerX, room.fieldY + room.sizeY + wallThickness / 2, wallHeight / 2]}
        castShadow
      >
        <boxGeometry args={[room.sizeX - 2 * cornerSize, wallThickness, wallHeight]} />
        {wallMaterial}
      </mesh>

      {/* West Wall */}
      <mesh position={[room.fieldX - wallThickness / 2, centerY, wallHeight / 2]} castShadow>
        <boxGeometry args={[wallThickness, room.sizeY - 2 * cornerSize, wallHeight]} />
        {wallMaterial}
      </mesh>

      {/* East Wall (at maximum X) - shortened to avoid corners */}
      <mesh
        position={[room.fieldX + room.sizeX + wallThickness / 2, centerY, wallHeight / 2]}
        castShadow
      >
        <boxGeometry args={[wallThickness, room.sizeY - 2 * cornerSize, wallHeight]} />
        {wallMaterial}
      </mesh>

      {/* Corner Blocks - prevent wall intersections */}
      {/* Northwest Corner */}
      <mesh
        position={[
          room.fieldX - wallThickness / 2,
          room.fieldY - wallThickness / 2,
          wallHeight / 2,
        ]}
        castShadow
      >
        <boxGeometry args={[cornerSize, cornerSize, wallHeight]} />
        {wallMaterial}
      </mesh>

      {/* Northeast Corner */}
      <mesh
        position={[
          room.fieldX + room.sizeX + wallThickness / 2,
          room.fieldY - wallThickness / 2,
          wallHeight / 2,
        ]}
        castShadow
      >
        <boxGeometry args={[cornerSize, cornerSize, wallHeight]} />
        {wallMaterial}
      </mesh>

      {/* Southwest Corner */}
      <mesh
        position={[
          room.fieldX - wallThickness / 2,
          room.fieldY + room.sizeY + wallThickness / 2,
          wallHeight / 2,
        ]}
        castShadow
      >
        <boxGeometry args={[cornerSize, cornerSize, wallHeight]} />
        {wallMaterial}
      </mesh>

      {/* Southeast Corner */}
      <mesh
        position={[
          room.fieldX + room.sizeX + wallThickness / 2,
          room.fieldY + room.sizeY + wallThickness / 2,
          wallHeight / 2,
        ]}
        castShadow
      >
        <boxGeometry args={[cornerSize, cornerSize, wallHeight]} />
        {wallMaterial}
      </mesh>
    </group>
  );
}
