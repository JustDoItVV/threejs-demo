'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { Enemy } from '../../core/types/game-types';

interface EnemySpriteProps {
  enemy: Enemy;
}

const ENEMY_COLORS: Record<string, string> = {
  zombie: '#2a9d2f',
  vampire: '#c41e1e',
  ghost: '#e0e0e0',
  ogr: '#d4a017',
  snake: '#9370db',
};

export function EnemySprite({ enemy }: EnemySpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);

  const color = useMemo(() => {
    return ENEMY_COLORS[enemy.subtype] || '#ff0000';
  }, [enemy.subtype]);

  useEffect(() => {
    if (spriteRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(30, 30, 68, 68);

        ctx.fillStyle = 'black';
        ctx.fillRect(45, 45, 15, 15);
        ctx.fillRect(68, 45, 15, 15);

        ctx.fillRect(50, 75, 28, 8);

        const texture = new THREE.CanvasTexture(canvas);
        spriteRef.current.material.map = texture;
        spriteRef.current.material.needsUpdate = true;
      }
    }
  }, [color]);

  if (!enemy?.position?.room) {
    return null;
  }

  const room = enemy.position.room;
  const worldX = room.fieldX + enemy.position.x;
  const worldY = room.fieldY + enemy.position.y;
  const worldZ = 0.5;
  const visible = room.isSeen;

  return (
    <sprite
      ref={spriteRef}
      position={[worldX, worldY, worldZ]}
      scale={[0.9, 0.9, 0.9]}
      visible={visible}
    >
      <spriteMaterial attach="material" transparent />
    </sprite>
  );
}
