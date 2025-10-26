'use client';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import { CanvasWrapper } from '../canvas-wrapper';
import { AnimatedTorus } from './animated-torus';
import { ControlsPanel } from './controls-panel';
import { Particles } from './particles';
import { SceneLighting } from './scene-lighting';

export function AnimatedScene() {
  return (
    <div className="relative w-full h-full">
      <CanvasWrapper>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <SceneLighting />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <AnimatedTorus />
        <Particles count={3000} />
      </CanvasWrapper>
      <ControlsPanel />
    </div>
  );
}
