'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { Item } from '../../core/types/game-types';

interface DoorSpriteProps {
  door: Item;
}

export function DoorSprite({ door }: DoorSpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);

  useEffect(() => {
    if (spriteRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(35, 20, 58, 88);

        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.strokeRect(35, 20, 58, 88);

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(75, 64, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(42, 27, 44, 37);
        ctx.strokeRect(42, 71, 44, 30);

        const texture = new THREE.CanvasTexture(canvas);
        spriteRef.current.material.map = texture;
        spriteRef.current.material.needsUpdate = true;
      }
    }
  }, []);

  if (!door?.position?.room) {
    return null;
  }

  const room = door.position.room;
  const worldX = room.fieldX + door.position.x;
  const worldY = room.fieldY + door.position.y;
  const worldZ = 0.5;
  const visible = room.isSeen;

  return (
    <sprite ref={spriteRef} position={[worldX, worldY, worldZ]} scale={[1, 1, 1]} visible={visible}>
      <spriteMaterial attach="material" transparent />
    </sprite>
  );
}
