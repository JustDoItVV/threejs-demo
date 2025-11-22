import { Vector2, Vector3 } from 'three';

import { MAP_CONFIG } from '../config/map.config';
import { GeoCoordinate, MapCoordinate } from '../types/map-types';

const { CENTER, SCALE } = MAP_CONFIG;

/**
 * Конвертирует географические координаты (lat, lon) в координаты карты (x, z)
 */
export function geoToMap(coord: GeoCoordinate): MapCoordinate {
  const deltaLat = coord.lat - CENTER.lat;
  const deltaLon = coord.lon - CENTER.lon;

  // Конвертируем в метры, затем масштабируем
  const x = (deltaLon * SCALE.metersPerDegreeLon) / SCALE.worldScale;
  const z = -(deltaLat * SCALE.metersPerDegree) / SCALE.worldScale; // Инвертируем Z

  return { x, z };
}

/**
 * Конвертирует координаты карты обратно в географические
 */
export function mapToGeo(coord: MapCoordinate): GeoCoordinate {
  const deltaLon = (coord.x * SCALE.worldScale) / SCALE.metersPerDegreeLon;
  const deltaLat = -(coord.z * SCALE.worldScale) / SCALE.metersPerDegree;

  return {
    lat: CENTER.lat + deltaLat,
    lon: CENTER.lon + deltaLon,
  };
}

/**
 * Конвертирует массив географических координат в Vector2
 */
export function geoArrayToVector2Array(coords: GeoCoordinate[]): Vector2[] {
  return coords.map((coord) => {
    const { x, z } = geoToMap(coord);
    return new Vector2(x, z);
  });
}

/**
 * Конвертирует массив географических координат в Vector3
 */
export function geoArrayToVector3Array(coords: GeoCoordinate[], height = 0): Vector3[] {
  return coords.map((coord) => {
    const { x, z } = geoToMap(coord);
    return new Vector3(x, height, z);
  });
}

/**
 * Вычисляет центр многоугольника
 */
export function getPolygonCenter(coords: GeoCoordinate[]): MapCoordinate {
  if (coords.length === 0) return { x: 0, z: 0 };

  let sumX = 0;
  let sumZ = 0;

  coords.forEach((coord) => {
    const { x, z } = geoToMap(coord);
    sumX += x;
    sumZ += z;
  });

  return {
    x: sumX / coords.length,
    z: sumZ / coords.length,
  };
}

/**
 * Вычисляет расстояние между двумя географическими точками (в метрах)
 * Использует формулу гаверсинусов
 */
export function getDistance(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
  const R = 6371000; // Радиус Земли в метрах
  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;
  const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLon = ((coord2.lon - coord1.lon) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Вычисляет расстояние между двумя точками на карте (в метрах)
 */
export function getMapDistance(coord1: MapCoordinate, coord2: MapCoordinate): number {
  const dx = coord2.x - coord1.x;
  const dz = coord2.z - coord1.z;
  return Math.sqrt(dx * dx + dz * dz) * SCALE.worldScale;
}

/**
 * Проверяет, находится ли точка внутри bounds
 */
export function isInBounds(coord: GeoCoordinate): boolean {
  const { radius } = MAP_CONFIG.BOUNDS;
  const deltaLat = Math.abs(coord.lat - CENTER.lat);
  const deltaLon = Math.abs(coord.lon - CENTER.lon);
  return deltaLat <= radius && deltaLon <= radius;
}

/**
 * Форматирует расстояние для отображения
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} м`;
  }
  return `${(meters / 1000).toFixed(2)} км`;
}
