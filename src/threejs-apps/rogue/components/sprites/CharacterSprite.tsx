'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { getCharacterSprite } from '../../config/assets';
import { Character } from '../../core/types/game-types';
import { loadTexture } from '../../utils/texture-loader';

interface CharacterSpriteProps {
  character: Character;
}

export function CharacterSprite({ character }: CharacterSpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);

  // TODO: Add animation state management (idle, walk, attack)
  // TODO: Add direction state management (down, side, up)
  // For now, use static 'idle' animation facing 'down'
  const animation: 'idle' | 'walk' | 'attack' = 'idle';
  const direction: 'down' | 'side' | 'up' = 'down';

  // Get the sprite texture path based on animation and direction
  const texturePath = useMemo(
    () => getCharacterSprite(animation, direction),
    [animation, direction]
  );

  // Load and cache the texture
  // Character sprites are sprite sheets with 4 frames, we show frame 0
  const texture = useMemo(() => {
    try {
      return loadTexture(texturePath, 0, 4); // frameIndex=0, totalFrames=4
    } catch (error) {
      console.error('[CharacterSprite] Failed to load texture:', error);
      return null;
    }
  }, [texturePath]);

  if (!character?.position?.room) {
    return null;
  }

  const room = character.position.room;
  const worldX = room.fieldX + character.position.x;
  const worldY = room.fieldY + character.position.y;
  const worldZ = 0.5;

  // If texture failed to load, don't render the sprite
  if (!texture) {
    console.warn('[CharacterSprite] Texture not loaded, skipping render');
    return null;
  }

  return (
    <sprite ref={spriteRef} position={[worldX, worldY, worldZ]} scale={[1.5, 1.5, 1]}>
      <spriteMaterial attach="material" map={texture} transparent />
    </sprite>
  );
}
