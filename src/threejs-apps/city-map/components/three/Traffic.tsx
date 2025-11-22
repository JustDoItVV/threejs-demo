import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Mesh, Vector3 } from 'three';

import { MAP_CONFIG } from '../../config/map.config';
import { Road, TrafficVehicle } from '../../types/map-types';
import { geoArrayToVector3Array } from '../../utils/geo-utils';
import { randomElement, randomRange } from '../../utils/map-utils';

interface VehicleProps {
  vehicle: TrafficVehicle;
  roadPoints: Vector3[];
}

function Vehicle({ vehicle, roadPoints }: VehicleProps) {
  const meshRef = useRef<Mesh>(null);
  const progressRef = useRef(vehicle.progress);

  useFrame((state, delta) => {
    if (!meshRef.current || roadPoints.length < 2) return;

    // Обновляем прогресс движения
    progressRef.current += (vehicle.speed / 100) * delta;
    if (progressRef.current >= 1) {
      progressRef.current = 0;
    }

    // Вычисляем позицию на пути
    const totalPoints = roadPoints.length - 1;
    const segment = progressRef.current * totalPoints;
    const segmentIndex = Math.floor(segment);
    const segmentProgress = segment - segmentIndex;

    if (segmentIndex < totalPoints) {
      const p1 = roadPoints[segmentIndex];
      const p2 = roadPoints[segmentIndex + 1];

      // Интерполяция позиции
      const pos = new Vector3().lerpVectors(p1, p2, segmentProgress);
      meshRef.current.position.copy(pos);
      meshRef.current.position.y = 0.5;

      // Поворот в направлении движения
      const direction = new Vector3().subVectors(p2, p1).normalize();
      const angle = Math.atan2(direction.x, direction.z);
      meshRef.current.rotation.y = angle;
    }
  });

  const size = MAP_CONFIG.TRAFFIC.vehicleSize;

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[size * 0.6, size * 0.5, size]} />
      <meshStandardMaterial color={vehicle.type === 'bus' ? '#FFA500' : randomElement(MAP_CONFIG.TRAFFIC.colors)} />
    </mesh>
  );
}

interface TrafficProps {
  roads: Road[];
}

export function Traffic({ roads }: TrafficProps) {
  const vehicles = useMemo<TrafficVehicle[]>(() => {
    const result: TrafficVehicle[] = [];
    const { vehicleCount, minSpeed, maxSpeed } = MAP_CONFIG.TRAFFIC;

    // Фильтруем только основные дороги для трафика
    const mainRoads = roads.filter(
      (road) =>
        road.type === 'primary' ||
        road.type === 'secondary' ||
        (road.type === 'residential' && road.coordinates.length > 3)
    );

    if (mainRoads.length === 0) return result;

    // Создаем машины, распределяя их по дорогам
    for (let i = 0; i < vehicleCount; i++) {
      const road = randomElement(mainRoads);
      const vehicleTypes: TrafficVehicle['type'][] = ['car', 'car', 'car', 'bus', 'truck'];

      result.push({
        id: `vehicle_${i}`,
        position: new Vector3(),
        rotation: 0,
        roadId: road.id,
        progress: Math.random(),
        speed: randomRange(minSpeed, maxSpeed),
        type: randomElement(vehicleTypes),
      });
    }

    return result;
  }, [roads]);

  // Создаем кэш путей для каждой дороги
  const roadPaths = useMemo(() => {
    const paths: Record<string, Vector3[]> = {};

    roads.forEach((road) => {
      paths[road.id] = geoArrayToVector3Array(road.coordinates, 0.2);
    });

    return paths;
  }, [roads]);

  return (
    <group>
      {vehicles.map((vehicle) => {
        const roadPoints = roadPaths[vehicle.roadId];
        if (!roadPoints || roadPoints.length < 2) return null;

        return <Vehicle key={vehicle.id} vehicle={vehicle} roadPoints={roadPoints} />;
      })}
    </group>
  );
}
