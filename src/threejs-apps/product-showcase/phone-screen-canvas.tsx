import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { apps, PhoneScreenState, SCREEN_HEIGHT, SCREEN_WIDTH } from './phone-screen-logic';

interface PhoneScreenCanvasProps {
  state: PhoneScreenState;
  onTextureUpdate?: (texture: THREE.CanvasTexture) => void;
}

export function PhoneScreenCanvas({ state, onTextureUpdate }: PhoneScreenCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    // Create canvas programmatically (not through JSX to avoid R3F conflict)
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = SCREEN_WIDTH;
      canvasRef.current.height = SCREEN_HEIGHT;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create texture on first render
    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvas);
      textureRef.current.needsUpdate = true;
      onTextureUpdate?.(textureRef.current);
    }

    // Clear canvas
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    gradient.addColorStop(0, '#60a5fa'); // blue-400
    gradient.addColorStop(1, '#a855f7'); // purple-600
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    if (state.openApp === 'camera') {
      // Render camera app
      drawCameraApp(ctx);
    } else {
      // Render home screen
      drawHomeScreen(ctx, state.currentPage);
    }

    // Update texture
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  }, [state, onTextureUpdate]);

  return null;
}

function drawHomeScreen(ctx: CanvasRenderingContext2D, currentPage: number) {
  const padding = 32;
  const topOffset = 60;

  // Status bar
  ctx.fillStyle = 'white';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('9:41', padding, 32);
  ctx.fillText('100%', SCREEN_WIDTH - 60, 32);

  // Draw battery icon
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.strokeRect(SCREEN_WIDTH - 50, 24, 24, 12);
  ctx.fillRect(SCREEN_WIDTH - 50, 24, 24, 12);
  ctx.fillRect(SCREEN_WIDTH - 26, 28, 2, 4);

  // App grid
  const currentApps = apps[currentPage] || apps[0];
  const iconSize = 64;
  const iconPadding = 24;
  const cols = 3;
  const startX = padding;
  const startY = topOffset + padding;

  currentApps.forEach((app, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * (iconSize + iconPadding + 40);
    const y = startY + row * (iconSize + iconPadding + 40);

    // Draw app icon background
    ctx.fillStyle = app.color;
    ctx.beginPath();
    ctx.roundRect(x, y, iconSize, iconSize, 14);
    ctx.fill();

    // Draw simplified icon (circle for now)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x + iconSize / 2, y + iconSize / 2, 16, 0, Math.PI * 2);
    ctx.fill();

    // Draw app name
    ctx.fillStyle = 'white';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(app.name, x + iconSize / 2, y + iconSize + 18);

    // Draw pulsing badge for camera
    if (app.id === 'camera') {
      ctx.fillStyle = '#ef4444'; // red-500
      ctx.beginPath();
      ctx.arc(x + iconSize - 4, y + 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  ctx.textAlign = 'left';

  // Page indicators
  const indicatorY = SCREEN_HEIGHT - 100;
  const indicatorSpacing = 12;
  const totalWidth = apps.length * indicatorSpacing;
  const startIndicatorX = (SCREEN_WIDTH - totalWidth) / 2;

  apps.forEach((_, index) => {
    const x = startIndicatorX + index * indicatorSpacing;
    ctx.fillStyle = index === currentPage ? 'white' : 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    if (index === currentPage) {
      ctx.roundRect(x, indicatorY, 24, 8, 4);
    } else {
      ctx.arc(x + 4, indicatorY + 4, 4, 0, Math.PI * 2);
    }
    ctx.fill();
  });

  // Home indicator
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.roundRect(SCREEN_WIDTH / 2 - 64, SCREEN_HEIGHT - 16, 128, 6, 3);
  ctx.fill();
}

function drawCameraApp(ctx: CanvasRenderingContext2D) {
  // Background (camera viewfinder)
  const gradient = ctx.createLinearGradient(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  gradient.addColorStop(0, '#475569'); // slate-700
  gradient.addColorStop(1, '#1e293b'); // slate-900
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  // Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  // Status bar
  ctx.fillStyle = 'white';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('9:41', 24, 32);

  // Battery icons (simplified)
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeRect(SCREEN_WIDTH - 80 + i * 18, 24, 14, 14);
  }

  // Camera controls at bottom
  const controlsY = SCREEN_HEIGHT - 140;
  const controlsHeight = 128;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, controlsY, SCREEN_WIDTH, controlsHeight);

  // Close button (X)
  const closeX = SCREEN_WIDTH / 2 - 160;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(closeX, controlsY + controlsHeight / 2, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();

  // Draw X
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(closeX - 10, controlsY + controlsHeight / 2 - 10);
  ctx.lineTo(closeX + 10, controlsY + controlsHeight / 2 + 10);
  ctx.moveTo(closeX + 10, controlsY + controlsHeight / 2 - 10);
  ctx.lineTo(closeX - 10, controlsY + controlsHeight / 2 + 10);
  ctx.stroke();

  // Shutter button
  const shutterX = SCREEN_WIDTH / 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(shutterX, controlsY + controlsHeight / 2, 36, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(shutterX, controlsY + controlsHeight / 2, 30, 0, Math.PI * 2);
  ctx.fill();

  // Gallery preview
  const galleryX = SCREEN_WIDTH / 2 + 160;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.roundRect(galleryX - 28, controlsY + controlsHeight / 2 - 28, 56, 56, 8);
  ctx.fill();
}
