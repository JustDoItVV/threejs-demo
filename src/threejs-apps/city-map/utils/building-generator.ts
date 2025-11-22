import { BufferGeometry, ExtrudeGeometry, Shape, Vector2 } from 'three';

import { Building } from '../types/map-types';
import { geoArrayToVector2Array } from './geo-utils';

/**
 * Генерирует геометрию здания из координат
 */
export function generateBuildingGeometry(building: Building): BufferGeometry {
  const points = geoArrayToVector2Array(building.coordinates);

  // Создаем Shape из точек
  const shape = new Shape();
  if (points.length < 3) {
    // Если недостаточно точек, создаем простой квадрат
    shape.moveTo(-2, -2);
    shape.lineTo(2, -2);
    shape.lineTo(2, 2);
    shape.lineTo(-2, 2);
    shape.lineTo(-2, -2);
  } else {
    shape.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    shape.lineTo(points[0].x, points[0].y);
  }

  // Экструдируем форму для создания 3D здания
  const extrudeSettings = {
    depth: building.height,
    bevelEnabled: false,
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);

  // Поворачиваем геометрию, чтобы она была вертикальной
  geometry.rotateX(Math.PI / 2);

  return geometry;
}

/**
 * Генерирует упрощенную геометрию для LOD
 */
export function generateSimplifiedBuildingGeometry(
  building: Building,
  simplificationLevel: number
): BufferGeometry {
  const points = geoArrayToVector2Array(building.coordinates);

  // Упрощаем количество точек
  const simplifiedPoints =
    simplificationLevel > 0 ? simplifyPolygon(points, simplificationLevel) : points;

  const shape = new Shape();
  if (simplifiedPoints.length < 3) {
    // Создаем простой box
    shape.moveTo(-2, -2);
    shape.lineTo(2, -2);
    shape.lineTo(2, 2);
    shape.lineTo(-2, 2);
  } else {
    shape.moveTo(simplifiedPoints[0].x, simplifiedPoints[0].y);
    for (let i = 1; i < simplifiedPoints.length; i++) {
      shape.lineTo(simplifiedPoints[i].x, simplifiedPoints[i].y);
    }
  }

  const extrudeSettings = {
    depth: building.height,
    bevelEnabled: false,
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(Math.PI / 2);

  return geometry;
}

/**
 * Упрощает полигон, уменьшая количество точек
 */
function simplifyPolygon(points: Vector2[], factor: number): Vector2[] {
  if (points.length <= 4) return points;

  const step = Math.max(1, Math.floor(factor));
  const simplified: Vector2[] = [];

  for (let i = 0; i < points.length; i += step) {
    simplified.push(points[i]);
  }

  // Убеждаемся, что первая и последняя точки включены
  if (simplified[simplified.length - 1] !== points[points.length - 1]) {
    simplified.push(points[points.length - 1]);
  }

  return simplified;
}

/**
 * Вычисляет центр здания в координатах карты
 */
export function getBuildingCenter(points: Vector2[]): Vector2 {
  if (points.length === 0) return new Vector2(0, 0);

  let sumX = 0;
  let sumY = 0;

  points.forEach((point) => {
    sumX += point.x;
    sumY += point.y;
  });

  return new Vector2(sumX / points.length, sumY / points.length);
}

/**
 * Вычисляет площадь здания (приблизительно)
 */
export function getBuildingArea(points: Vector2[]): number {
  if (points.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area / 2);
}
