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
  const visualPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const isInitialized = useRef(false);
  const attackProgress = useRef(0);
  const wasAttacking = useRef(false);

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

      tex.repeat.set(1 / totalFrames, 1);
      tex.offset.set(0, 0);

      return tex;
    } catch (error) {
      console.error('[CharacterSprite] Failed to load texture:', error);
      return null;
    }
  }, [texturePath, totalFrames]);

  useFrame((_state, delta: number) => {
    if (!texture || !spriteRef.current) return;

    timeAccumulator.current += delta;

    if (timeAccumulator.current >= frameDuration) {
      timeAccumulator.current -= frameDuration;

      const nextFrame = (currentFrame + 1) % totalFrames;
      setCurrentFrame(nextFrame);

      texture.offset.set(nextFrame / totalFrames, 0);
    }

    if (character?.position?.room) {
      const room = character.position.room;
      const targetX = room.fieldX + character.position.x;
      const targetY = room.fieldY + character.position.y;
      const targetZ = 0.5;

      if (!isInitialized.current) {
        visualPosition.current.set(targetX, targetY, targetZ);
        isInitialized.current = true;
      }

      if (character.isAttacking) {
        if (!wasAttacking.current) {
          attackProgress.current = 0;
          wasAttacking.current = true;
        }
        attackProgress.current += delta * 10;
        if (attackProgress.current > 2) attackProgress.current = 2;
      } else {
        wasAttacking.current = false;
        attackProgress.current = 0;
      }

      let attackOffsetX = 0;
      let attackOffsetY = 0;
      if (character.isAttacking && character.attackDirection) {
        const offset =
          attackProgress.current <= 1
            ? attackProgress.current * 0.5
            : (2 - attackProgress.current) * 0.5;

        switch (character.attackDirection) {
          case 'up':
            attackOffsetY = offset;
            break;
          case 'down':
            attackOffsetY = -offset;
            break;
          case 'right':
            attackOffsetX = offset;
            break;
          case 'left':
            attackOffsetX = -offset;
            break;
        }
      }

      const lerpFactor = Math.min(delta * 12, 1);
      visualPosition.current.x += (targetX + attackOffsetX - visualPosition.current.x) * lerpFactor;
      visualPosition.current.y += (targetY + attackOffsetY - visualPosition.current.y) * lerpFactor;
      visualPosition.current.z = targetZ;

      spriteRef.current.position.copy(visualPosition.current);
    }
  });

  if (!character?.position?.room) {
    return null;
  }

  if (!texture) {
    console.warn('[CharacterSprite] Texture not loaded, skipping render');
    return null;
  }

  return (
    <sprite ref={spriteRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1]}>
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
