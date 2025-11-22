'use client';

import { useEffect, useRef, useState } from 'react';

interface FrameStats {
  fps: number;
  frameTime: number; // ms
  minFps: number;
  maxFps: number;
}

export function PerformanceStats() {
  const showStats = true;
  const [stats, setStats] = useState<FrameStats>({
    fps: 0,
    frameTime: 0,
    minFps: Infinity,
    maxFps: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const frameTimesRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!showStats) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const measurePerformance = () => {
      const now = performance.now();

      // Инициализируем lastTimeRef при первом вызове
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
        animationFrameRef.current = requestAnimationFrame(measurePerformance);
        return;
      }

      const delta = now - lastTimeRef.current;

      frameCountRef.current++;
      frameTimesRef.current.push(delta);

      // Keep only last 60 frames
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Update stats every 10 frames
      if (frameCountRef.current % 10 === 0) {
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const currentFps = 1000 / avgFrameTime;

        setStats((prev) => ({
          fps: Math.round(currentFps),
          frameTime: Math.round(avgFrameTime * 10) / 10,
          minFps: Math.min(prev.minFps, currentFps),
          maxFps: Math.max(prev.maxFps, currentFps),
        }));
      }

      lastTimeRef.current = now;
      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    // Сбрасываем lastTimeRef при каждом включении статистики
    lastTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showStats]);

  const handleReset = () => {
    setStats({
      fps: stats.fps,
      frameTime: stats.frameTime,
      minFps: Infinity,
      maxFps: 0,
    });
  };

  if (!showStats) return null;

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg font-mono text-xs space-y-1 min-w-[180px] z-10">
      <div className="flex justify-between items-center border-b border-white/20 pb-1 mb-2">
        <span className="font-bold">Performance</span>
        <button
          onClick={handleReset}
          className="text-[10px] px-1 py-0.5 bg-white/10 hover:bg-white/20 rounded"
          title="Reset min/max"
        >
          Reset
        </button>
      </div>

      <div className="flex justify-between">
        <span>FPS:</span>
        <span className={`font-bold ${getFpsColor(stats.fps)}`}>{stats.fps}</span>
      </div>

      <div className="flex justify-between">
        <span>Frame:</span>
        <span className="text-blue-400">{stats.frameTime.toFixed(1)} ms</span>
      </div>

      <div className="flex justify-between text-[10px] text-gray-400">
        <span>Min FPS:</span>
        <span>{isFinite(stats.minFps) ? Math.round(stats.minFps) : '-'}</span>
      </div>

      <div className="flex justify-between text-[10px] text-gray-400">
        <span>Max FPS:</span>
        <span>{Math.round(stats.maxFps) || '-'}</span>
      </div>
    </div>
  );
}
