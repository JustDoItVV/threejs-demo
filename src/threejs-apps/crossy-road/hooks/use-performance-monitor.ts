import { useEffect, useRef } from 'react';

import { useFrame } from '@react-three/fiber';

import { useGameStore } from '../store/game-store';

export function usePerformanceMonitor() {
  const updatePerformance = useGameStore((state) => state.updatePerformance);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const frameTimes = useRef<number[]>([]);

  useFrame(() => {
    const currentTime = performance.now();
    const delta = currentTime - lastTime.current;

    frameTimes.current.push(delta);
    frameCount.current++;

    // Update every 30 frames
    if (frameCount.current >= 30) {
      const avgMs = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
      const fps = Math.round(1000 / avgMs);

      updatePerformance(fps, Math.round(avgMs));

      frameCount.current = 0;
      frameTimes.current = [];
    }

    lastTime.current = currentTime;
  });
}
