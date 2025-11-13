'use client';

import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import { getEnemySprite } from '../../config/assets';
import { Enemy } from '../../types/game-types';

interface EnemySpriteProps {
  enemy: Enemy;
}

export function EnemySprite({ enemy }: EnemySpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const timeAccumulator = useRef(0);

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
    if (!texture) return;

    timeAccumulator.current += delta;

    if (timeAccumulator.current >= frameDuration) {
      timeAccumulator.current -= frameDuration;

      const nextFrame = (currentFrame + 1) % totalFrames;
      setCurrentFrame(nextFrame);

      texture.offset.set(nextFrame / totalFrames, 0);
    }
  });

  if (!enemy?.position?.room) {
    return null;
  }

  const room = enemy.position.room;
  const worldX = room.fieldX + enemy.position.x;
  const worldY = room.fieldY + enemy.position.y;
  const worldZ = 0.5;
  const visible = room.isSeen;

  if (!texture) {
    console.warn(`[EnemySprite] Texture not loaded for ${enemy.subtype}, skipping render`);
    return null;
  }

  return (
    <sprite
      ref={spriteRef}
      position={[worldX, worldY, worldZ]}
      scale={[1.5, 1.5, 1]}
      visible={visible}
    >
      <spriteMaterial attach="material" map={texture} transparent alphaTest={0.5} depthWrite={false} />
    </sprite>
  );
}
