import { ThreeEvent } from '@react-three/fiber';
import { useCallback, useState } from 'react';
import * as THREE from 'three';

import { PhoneScreenCanvas } from './phone-screen-canvas';
import { apps, PhoneScreenState, SCREEN_HEIGHT, SCREEN_WIDTH } from './phone-screen-logic';

interface PhoneScreenMeshProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export function PhoneScreenMesh({
  position = [0.05, 1.04, 0.11],
  rotation = [0, 0, 0],
  scale = 1,
}: PhoneScreenMeshProps) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [state, setState] = useState<PhoneScreenState>({
    currentPage: 0,
    openApp: null,
  });

  const handleTextureUpdate = useCallback((newTexture: THREE.CanvasTexture) => {
    setTexture(newTexture);
  }, []);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();

      // Get UV coordinates from intersection
      const uv = event.uv;
      if (!uv) return;

      // Convert UV to canvas coordinates
      const x = uv.x * SCREEN_WIDTH;
      const y = (1 - uv.y) * SCREEN_HEIGHT; // Flip Y axis

      console.log('Click at:', x, y);

      // If in camera app, check for close button
      if (state.openApp === 'camera') {
        const closeButtonX = SCREEN_WIDTH / 2 - 160;
        const closeButtonY = SCREEN_HEIGHT - 76;
        const distance = Math.sqrt(
          Math.pow(x - closeButtonX, 2) + Math.pow(y - closeButtonY, 2),
        );

        if (distance < 32) {
          setState((prev) => ({ ...prev, openApp: null }));
          return;
        }
        return;
      }

      // Check if clicked on app icon
      const padding = 32;
      const topOffset = 60;
      const iconSize = 64;
      const iconPadding = 24;
      const cols = 3;
      const startX = padding;
      const startY = topOffset + padding;

      const currentApps = apps[state.currentPage] || apps[0];

      for (let i = 0; i < currentApps.length; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const appX = startX + col * (iconSize + iconPadding + 40);
        const appY = startY + row * (iconSize + iconPadding + 40);

        if (x >= appX && x <= appX + iconSize && y >= appY && y <= appY + iconSize) {
          const app = currentApps[i];
          console.log('Clicked app:', app.name);

          if (app.id === 'camera') {
            setState((prev) => ({ ...prev, openApp: 'camera' }));
          }
          return;
        }
      }

      // Check for page indicators (swipe simulation)
      const indicatorY = SCREEN_HEIGHT - 100;
      if (y >= indicatorY - 20 && y <= indicatorY + 20) {
        // Swipe left/right based on X position
        if (x < SCREEN_WIDTH / 2 && state.currentPage > 0) {
          setState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
        } else if (x >= SCREEN_WIDTH / 2 && state.currentPage < apps.length - 1) {
          setState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
        }
      }
    },
    [state],
  );

  // Calculate plane size based on iPhone 14 Pro screen aspect ratio
  // Screen width: 0.1, height proportional
  const planeWidth = 0.1;
  const planeHeight = (planeWidth * SCREEN_HEIGHT) / SCREEN_WIDTH;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <PhoneScreenCanvas state={state} onTextureUpdate={handleTextureUpdate} />

      <mesh onClick={handleClick}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}
