import { Html, Line } from '@react-three/drei';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Raycaster, Vector2, Vector3 } from 'three';

import { useMapStore } from '../../store/map-store';
import { Measurement, MeasurementPoint } from '../../types/map-types';
import { formatDistance, mapToGeo } from '../../utils/geo-utils';
import { generateId } from '../../utils/map-utils';

export function MeasurementTool() {
  const { isМeasuring, measurements, addMeasurement, clearMeasurements } = useMapStore();
  const [currentPoints, setCurrentPoints] = useState<Vector3[]>([]);
  const { camera, gl, scene } = useThree();

  useEffect(() => {
    if (!isМeasuring) {
      setCurrentPoints([]);
    }
  }, [isМeasuring]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!isМeasuring) return;

    event.stopPropagation();

    const point = event.point;

    if (currentPoints.length === 0) {
      // Первая точка
      setCurrentPoints([point]);
    } else if (currentPoints.length === 1) {
      // Вторая точка - завершаем измерение
      const newPoints = [...currentPoints, point];
      setCurrentPoints(newPoints);

      // Вычисляем расстояние
      const distance = newPoints[0].distanceTo(newPoints[1]) * 10000; // Конвертируем в метры

      // Создаем объект измерения
      const measurementPoints: MeasurementPoint[] = newPoints.map((p) => ({
        position: p,
        worldPosition: mapToGeo({ x: p.x, z: p.z }),
      }));

      const measurement: Measurement = {
        id: generateId('measurement'),
        points: measurementPoints,
        distance,
      };

      addMeasurement(measurement);

      // Сбрасываем для нового измерения
      setCurrentPoints([]);
    }
  };

  if (!isМeasuring && measurements.length === 0) return null;

  return (
    <>
      {/* Плоскость для клика по земле */}
      {isМeasuring && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onClick={handleClick}>
          <planeGeometry args={[10000, 10000]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}

      {/* Текущее измерение */}
      {currentPoints.length > 0 && (
        <group>
          {/* Первая точка */}
          <mesh position={currentPoints[0]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="#FF0000" />
          </mesh>

          {/* Линия, если есть вторая точка */}
          {currentPoints.length === 2 && (
            <>
              <Line points={currentPoints} color="#FF0000" lineWidth={2} />
              <mesh position={currentPoints[1]}>
                <sphereGeometry args={[2, 16, 16]} />
                <meshBasicMaterial color="#FF0000" />
              </mesh>

              {/* Label с расстоянием */}
              <Html
                position={new Vector3().lerpVectors(currentPoints[0], currentPoints[1], 0.5)}
                center
              >
                <div className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg font-bold">
                  {formatDistance(currentPoints[0].distanceTo(currentPoints[1]) * 10000)}
                </div>
              </Html>
            </>
          )}
        </group>
      )}

      {/* Сохраненные измерения */}
      {measurements.map((measurement) => (
        <group key={measurement.id}>
          <Line
            points={measurement.points.map((p) => p.position)}
            color="#00FF00"
            lineWidth={2}
          />

          {measurement.points.map((point, index) => (
            <mesh key={index} position={point.position}>
              <sphereGeometry args={[2, 16, 16]} />
              <meshBasicMaterial color="#00FF00" />
            </mesh>
          ))}

          <Html
            position={new Vector3().lerpVectors(
              measurement.points[0].position,
              measurement.points[1].position,
              0.5
            )}
            center
          >
            <div className="bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg font-bold">
              {formatDistance(measurement.distance)}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}
