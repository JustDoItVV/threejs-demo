'use client';

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export function PostProcessing() {
  return (
    <EffectComposer>
      {/* Bloom - glowing effect for bright colors */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Vignette - darkens edges for focus */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Chromatic Aberration - slight color separation for style */}
      <ChromaticAberration
        offset={new THREE.Vector2(0.001, 0.001)}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
