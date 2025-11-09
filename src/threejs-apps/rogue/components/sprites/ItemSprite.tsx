'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { Item } from '../../core/types/game-types';

interface ItemSpriteProps {
  item: Item;
}

function getItemColor(item: Item): string {
  if (item.type === 'treasure') return '#ffd700';
  if (item.type === 'food') return '#ff6347';
  if (item.type === 'elixir') return '#9370db';
  if (item.type === 'scroll') return '#4682b4';
  if (item.type === 'weapon') return '#c0c0c0';
  return '#ffffff';
}

function drawItemIcon(ctx: CanvasRenderingContext2D, item: Item, color: string) {
  ctx.fillStyle = color;

  if (item.type === 'treasure') {
    ctx.beginPath();
    ctx.moveTo(64, 30);
    ctx.lineTo(85, 50);
    ctx.lineTo(75, 95);
    ctx.lineTo(53, 95);
    ctx.lineTo(43, 50);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.fillRect(54, 55, 20, 8);
  } else if (item.type === 'food') {
    ctx.beginPath();
    ctx.arc(64, 64, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8b4513';
    ctx.fillRect(60, 25, 8, 15);
  } else if (item.type === 'elixir') {
    ctx.fillRect(50, 40, 28, 50);
    ctx.beginPath();
    ctx.arc(64, 40, 14, Math.PI, 0);
    ctx.fill();
  } else if (item.type === 'scroll') {
    ctx.fillRect(35, 45, 58, 38);
    ctx.fillStyle = '#000';
    ctx.fillRect(40, 52, 48, 4);
    ctx.fillRect(40, 62, 48, 4);
    ctx.fillRect(40, 72, 48, 4);
  } else if (item.type === 'weapon') {
    ctx.fillRect(60, 30, 8, 60);
    ctx.fillRect(50, 35, 28, 8);
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(58, 75, 12, 15);
  } else {
    ctx.fillRect(50, 50, 28, 28);
  }
}

export function ItemSprite({ item }: ItemSpriteProps) {
  const spriteRef = useRef<THREE.Sprite>(null);

  useEffect(() => {
    if (spriteRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const color = getItemColor(item);
        drawItemIcon(ctx, item, color);

        const texture = new THREE.CanvasTexture(canvas);
        spriteRef.current.material.map = texture;
        spriteRef.current.material.needsUpdate = true;
      }
    }
  }, [item]);

  if (!item?.position?.room) {
    return null;
  }

  const room = item.position.room;
  const worldX = room.fieldX + item.position.x;
  const worldY = room.fieldY + item.position.y;
  const worldZ = 0.3;
  const visible = room.isSeen;

  return (
    <sprite
      ref={spriteRef}
      position={[worldX, worldY, worldZ]}
      scale={[0.7, 0.7, 0.7]}
      visible={visible}
    >
      <spriteMaterial attach="material" transparent />
    </sprite>
  );
}
