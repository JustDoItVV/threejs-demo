'use client';

import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import { getCharacterSprite } from '../../config/assets';
import { ICharacterEntity } from '../../types/entities';

interface CharacterSpriteProps {
  character: ICharacterEntity;
}

export function CharacterSprite({ character }: CharacterSpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const timeAccumulator = useRef(0);

  const animation: 'idle' | 'walk' | 'attack' = 'idle';
  const direction: 'down' | 'side' | 'up' = 'down';
  const totalFrames = 4;
  const frameRate = 8;
  const frameDuration = 1 / frameRate;

  const texturePath = useMemo(
    () => getCharacterSprite(animation, direction),
    [animation, direction]
  );

  const texture = useMemo(() => {
    try {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(texturePath);

      tex.minFilter = THREE.NearestFilter;
      tex.magFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;

      tex.repeat.set(1 / totalFrames, 1); // Show 1/4 of texture width
      tex.offset.set(0, 0); // Start at frame 0

      return tex;
    } catch (error) {
      console.error('[CharacterSprite] Failed to load texture:', error);
      return null;
    }
  }, [texturePath, totalFrames]);

  useFrame((_state, delta: number) => {
    if (!texture) return;

    timeAccumulator.current += delta;

    if (timeAccumulator.current >= frameDuration) {
      timeAccumulator.current -= frameDuration;

      const nextFrame = (currentFrame + 1) % totalFrames;
      setCurrentFrame(nextFrame);

      texture.offset.set(nextFrame / totalFrames, 0);
    }
  });

  if (!character?.position?.room) {
    return null;
  }

  const room = character.position.room;
  const worldX = room.fieldX + character.position.x;
  const worldY = room.fieldY + character.position.y;
  const worldZ = 0.5;

  if (!texture) {
    console.warn('[CharacterSprite] Texture not loaded, skipping render');
    return null;
  }

  return (
    <sprite ref={spriteRef} position={[worldX, worldY, worldZ]} scale={[1.5, 1.5, 1]}>
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
