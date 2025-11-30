'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { getDoorSprite } from '../../config/assets';
import { IItemEntity } from '../../types/entities';

interface DoorSpriteProps {
  door: IItemEntity;
}

export function DoorSprite({ door }: DoorSpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);

  const direction: 'down' | 'side' | 'up' = useMemo(() => {
    const room = door.position.room;
    const { x, y } = door.position;

    if (!room) return 'down';

    if (y === 0) return 'down';
    if (y >= room.sizeY - 1) return 'up';
    if (x === 0 || x >= room.sizeX - 1) return 'side';

    return 'down';
  }, [door.position]);

  const texturePath = useMemo(() => getDoorSprite(direction, false), [direction]);

  const texture = useMemo(() => {
    try {
      const loader = new THREE.TextureLoader();
      const texture = loader.load(texturePath);

      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;

      const totalFrames = 1;
      const frameIndex = 0;
      texture.repeat.set(1 / totalFrames, 1);
      texture.offset.set(frameIndex / totalFrames, 0);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      return texture;
    } catch (error) {
      console.error('[DoorSprite] Failed to load texture:', error);
      return null;
    }
  }, [texturePath]);

  if (!door?.position?.room) {
    return null;
  }

  const room = door.position.room;
  const worldX = room.fieldX + door.position.x;
  const worldY = room.fieldY + door.position.y;
  const worldZ = 0.5;
  const visible = room.isSeen;

  if (!texture) {
    console.warn('[DoorSprite] Texture not loaded, skipping render');
    return null;
  }

  return (
    <sprite
      ref={spriteRef}
      position={[worldX, worldY, worldZ]}
      scale={[0.7, 0.7, 1]}
      visible={visible}
    >
      <spriteMaterial attach="material" map={texture} transparent />
    </sprite>
  );
}
