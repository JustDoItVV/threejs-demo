'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

interface ParticlesProps {
  count?: number;
}

export function Particles({ count = 1000 }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  // eslint-disable-next-line react-hooks/purity
  const seedRef = useRef(Math.random() * 1000); // Фиксированный seed для детерминированной генерации

  // Генерация позиций и цветов частиц с использованием детерминированного подхода
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    // Детерминированная псевдослучайная функция
    const deterministicRandom = (index: number, offset: number) => {
      const x = Math.sin(index * 12.9898 + offset * 78.233 + seedRef.current) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Используем детерминированную случайность
      const radius = 3 + deterministicRandom(i, 0) * 2;
      const theta = deterministicRandom(i, 1) * Math.PI * 2;
      const phi = Math.acos(deterministicRandom(i, 2) * 2 - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      // Детерминированные цвета
      const t = deterministicRandom(i, 3);
      if (t < 0.5) {
        // Cyan
        cols[i3] = 0.0;
        cols[i3 + 1] = 0.83;
        cols[i3 + 2] = 1.0;
      } else {
        // Pink/Magenta
        cols[i3] = 1.0;
        cols[i3 + 1] = 0.2;
        cols[i3 + 2] = 0.8;
      }
    }

    return { positions: pos, colors: cols };
  }, [count]);

  // Анимация частиц
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Орбитальное движение
      const angle = time * 0.2 + i * 0.01;

      positions[i3] += Math.sin(angle) * 0.001;
      positions[i3 + 1] += Math.cos(angle) * 0.001;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]} // Добавлен args
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]} // Добавлен args
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
