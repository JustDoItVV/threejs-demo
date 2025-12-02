'use client';

import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import { getEnemySprite } from '../../config/assets';
import { IEnemyEntity } from '../../types/entities';

interface EnemySpriteProps {
  enemy: IEnemyEntity;
}

export function EnemySprite({ enemy }: EnemySpriteProps) {
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
  const frameRate = 6;
  const frameDuration = 1 / frameRate;

  const texturePath = useMemo(
    () => getEnemySprite(enemy.subtype, animation, direction),
    [enemy.subtype, animation, direction]
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
      console.error(`[EnemySprite] Failed to load texture for ${enemy.subtype}:`, error);
      return null;
    }
  }, [texturePath, totalFrames, enemy.subtype]);

  useFrame((_state, delta: number) => {
    if (!texture || !spriteRef.current) return;

    timeAccumulator.current += delta;

    if (timeAccumulator.current >= frameDuration) {
      timeAccumulator.current -= frameDuration;

      const nextFrame = (currentFrame + 1) % totalFrames;
      setCurrentFrame(nextFrame);

      texture.offset.set(nextFrame / totalFrames, 0);
    }

    if (enemy?.position?.room) {
      const room = enemy.position.room;
      const targetX = room.fieldX + enemy.position.x;
      const targetY = room.fieldY + enemy.position.y;
      const targetZ = 0.5;

      if (!isInitialized.current) {
        visualPosition.current.set(targetX, targetY, targetZ);
        isInitialized.current = true;
      }

      if (enemy.isAttacking) {
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
      if (enemy.isAttacking && enemy.attackDirection) {
        const offset =
          attackProgress.current <= 1
            ? attackProgress.current * 0.5
            : (2 - attackProgress.current) * 0.5;

        switch (enemy.attackDirection) {
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

      const lerpFactor = Math.min(delta * 10, 1);
      visualPosition.current.x += (targetX + attackOffsetX - visualPosition.current.x) * lerpFactor;
      visualPosition.current.y += (targetY + attackOffsetY - visualPosition.current.y) * lerpFactor;
      visualPosition.current.z = targetZ;

      spriteRef.current.position.copy(visualPosition.current);
    }
  });

  if (!enemy?.position?.room) {
    return null;
  }

  const room = enemy.position.room;
  const visible = room.isSeen;

  if (!texture) {
    console.warn(`[EnemySprite] Texture not loaded for ${enemy.subtype}, skipping render`);
    return null;
  }

  return (
    <sprite ref={spriteRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1]} visible={visible}>
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
