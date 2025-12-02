'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { getItemSprite } from '../../config/assets';
import { IItemEntity } from '../../types/entities';
import { loadTexture } from '../../utils/texture-loader';

interface ItemSpriteProps {
  item: IItemEntity;
}

export function ItemSprite({ item }: ItemSpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);

  const variant = useMemo(() => {
    if (!item.name) return 0;
    let hash = 0;
    for (let i = 0; i < item.name.length; i++) {
      hash = (hash << 5) - hash + item.name.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }, [item.name]);

  const texturePath = useMemo(
    () => getItemSprite(item.type as 'treasure' | 'food' | 'elixir' | 'scroll' | 'weapon', variant),
    [item.type, variant]
  );

  const texture = useMemo(() => {
    try {
      const isAnimated = texturePath.includes('Chest');
      const totalFrames = isAnimated ? 4 : 1;
      return loadTexture(texturePath, 0, totalFrames);
    } catch (error) {
      console.error(`[ItemSprite] Failed to load texture for ${item.type}:`, error);
      return null;
    }
  }, [texturePath, item.type]);

  if (!item?.position?.room) {
    return null;
  }

  const room = item.position.room;
  const worldX = room.fieldX + item.position.x;
  const worldY = room.fieldY + item.position.y;
  const worldZ = 0.3;
  const visible = room.isSeen;

  if (!texture) {
    console.warn(`[ItemSprite] Texture not loaded for ${item.type}, skipping render`);
    return null;
  }

  return (
    <sprite
      ref={spriteRef}
      position={[worldX, worldY, worldZ]}
      scale={[0.5, 0.5, 0.5]}
      visible={visible}
    >
      <spriteMaterial
        attach="material"
        map={texture}
        transparent
        alphaTest={0.5}
        depthWrite={false}
      />
    </sprite>
  );
}
