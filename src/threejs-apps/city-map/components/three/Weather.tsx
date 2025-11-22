import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { BufferGeometry, Fog, Points, PointsMaterial, Vector3 } from 'three';

import { MAP_CONFIG } from '../../config/map.config';
import { useMapStore } from '../../store/map-store';
import { WeatherType } from '../../types/map-types';

function RainParticles() {
  const pointsRef = useRef<Points>(null);
  const { particleCount, speed, color } = MAP_CONFIG.WEATHER.rain;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 1000;
      pos[i3 + 1] = Math.random() * 500;
      pos[i3 + 2] = (Math.random() - 0.5) * 1000;
      vel[i] = 20 + Math.random() * 30;
    }

    return [pos, vel];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3 + 1] -= velocities[i] * delta;

      // Сброс частицы наверх когда она упала
      if (pos[i3 + 1] < 0) {
        pos[i3 + 1] = 500;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={2} color={color} transparent opacity={0.6} />
    </points>
  );
}

function SnowParticles() {
  const pointsRef = useRef<Points>(null);
  const { particleCount, speed, color } = MAP_CONFIG.WEATHER.snow;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 1000;
      pos[i3 + 1] = Math.random() * 500;
      pos[i3 + 2] = (Math.random() - 0.5) * 1000;
      vel[i] = 5 + Math.random() * 10;
    }

    return [pos, vel];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Падение вниз
      pos[i3 + 1] -= velocities[i] * delta;

      // Дрейф по горизонтали (симуляция ветра)
      pos[i3] += Math.sin(time + i) * 0.5 * delta;
      pos[i3 + 2] += Math.cos(time + i) * 0.5 * delta;

      // Сброс частицы наверх когда она упала
      if (pos[i3 + 1] < 0) {
        pos[i3] = (Math.random() - 0.5) * 1000;
        pos[i3 + 1] = 500;
        pos[i3 + 2] = (Math.random() - 0.5) * 1000;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={4} color={color} transparent opacity={0.8} />
    </points>
  );
}

interface WeatherProps {
  weather: WeatherType;
}

export function Weather({ weather }: WeatherProps) {
  if (weather === 'clear') return null;

  return (
    <>
      {weather === 'rain' && <RainParticles />}
      {weather === 'snow' && <SnowParticles />}
      {weather === 'fog' && (
        <fog
          attach="fog"
          args={[MAP_CONFIG.WEATHER.fog.color, MAP_CONFIG.WEATHER.fog.near, MAP_CONFIG.WEATHER.fog.far]}
        />
      )}
    </>
  );
}
