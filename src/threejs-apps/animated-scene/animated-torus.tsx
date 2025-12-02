'use client';

import { useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;
    // Волновой эффект
    float wave = sin(pos.x * 2.0 + uTime) * 0.1;
    pos.z += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    // Анимированный градиент
    vec3 color1 = vec3(0.0, 0.83, 1.0); // Cyan
    vec3 color2 = vec3(1.0, 0.0, 0.5);  // Pink

    float mixValue = sin(vUv.y * 3.14159 + uTime) * 0.5 + 0.5;
    vec3 color = mix(color1, color2, mixValue);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function AnimatedTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.005;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}
