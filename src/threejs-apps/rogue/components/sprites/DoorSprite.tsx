'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { getDoorSprite } from '../../config/assets';
import { Item } from '../../types/game-types';

interface DoorSpriteProps {
  door: Item;
}

export function DoorSprite({ door }: DoorSpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);

  // Determine door direction based on position in room
  // Doors at top/bottom edges face down/up, doors at sides face side
  const direction: 'down' | 'side' | 'up' = useMemo(() => {
    const room = door.position.room;
    const { x, y } = door.position;

    // Check if door is at top or bottom edge
    if (y === 0) return 'down'; // Bottom edge
    if (y >= room.sizeY - 1) return 'up'; // Top edge

    // Check if door is at left or right edge
    if (x === 0 || x >= room.sizeX - 1) return 'side';

    // Default to down for doors in the middle of the room
    return 'down';
  }, [door.position]);

  const texturePath = useMemo(() => getDoorSprite(direction, false), [direction]);

  const texture = useMemo(() => {
    try {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(texturePath);

      tex.minFilter = THREE.NearestFilter;
      tex.magFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      tex.colorSpace = THREE.SRGBColorSpace;

      const totalFrames = 4;
      const frameIndex = 0;
      tex.repeat.set(1 / totalFrames, 1);
      tex.offset.set(frameIndex / totalFrames, 0);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;

      return tex;
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
      scale={[1.2, 1.2, 1]}
      visible={visible}
    >
      <spriteMaterial attach="material" map={texture} transparent />
    </sprite>
  );
}
