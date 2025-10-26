'use client';

import { Canvas } from '@react-three/fiber';
import { ReactNode } from 'react';

interface CanvasWrapperProps {
  children: ReactNode;
  className?: string;
}

export function CanvasWrapper({ children, className = '' }: CanvasWrapperProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {children}
      </Canvas>
    </div>
  );
}
