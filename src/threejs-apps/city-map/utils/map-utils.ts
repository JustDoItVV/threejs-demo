import { Color } from 'three';

import { MAP_CONFIG } from '../config/map.config';
import { Building } from '../types/map-types';

/**
 * Получает цвет здания в зависимости от типа
 */
export function getBuildingColor(building: Building): string {
  if (building.color) return building.color;
  if (building.isLandmark) return MAP_CONFIG.BUILDINGS.colors.landmark;

  // Определяем цвет по типу
  const type = building.type?.toLowerCase() || '';

  if (type.includes('residential') || type.includes('apartments')) {
    return MAP_CONFIG.BUILDINGS.colors.residential;
  }
  if (type.includes('commercial') || type.includes('retail') || type.includes('office')) {
    return MAP_CONFIG.BUILDINGS.colors.commercial;
  }
  if (type.includes('industrial')) {
    return MAP_CONFIG.BUILDINGS.colors.industrial;
  }
  if (type.includes('glass') || type.includes('modern')) {
    return MAP_CONFIG.BUILDINGS.colors.glass;
  }

  return MAP_CONFIG.BUILDINGS.colors.default;
}

/**
 * Генерирует случайную вариацию цвета для разнообразия
 */
export function getColorVariation(baseColor: string, variation = 0.1): Color {
  const color = new Color(baseColor);
  const r = Math.max(0, Math.min(1, color.r + (Math.random() - 0.5) * variation));
  const g = Math.max(0, Math.min(1, color.g + (Math.random() - 0.5) * variation));
  const b = Math.max(0, Math.min(1, color.b + (Math.random() - 0.5) * variation));

  return new Color(r, g, b);
}

/**
 * Вычисляет высоту здания из этажей или использует значение по умолчанию
 */
export function calculateBuildingHeight(building: Building): number {
  if (building.height > 0) return building.height;
  if (building.levels && building.levels > 0) {
    return building.levels * MAP_CONFIG.BUILDINGS.floorHeight;
  }
  return MAP_CONFIG.BUILDINGS.defaultHeight;
}

/**
 * Получает ширину дороги в зависимости от типа
 */
export function getRoadWidth(type: string): number {
  const roadType = type as keyof typeof MAP_CONFIG.ROADS.widths;
  return MAP_CONFIG.ROADS.widths[roadType] || MAP_CONFIG.ROADS.widths.residential;
}

/**
 * Генерирует уникальный ID
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Клампит значение между минимумом и максимумом
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Линейная интерполяция
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Плавная интерполяция (ease-in-out)
 */
export function smoothstep(start: number, end: number, t: number): number {
  const x = clamp((t - start) / (end - start), 0, 1);
  return x * x * (3 - 2 * x);
}

/**
 * Случайное число в диапазоне
 */
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Случайный элемент из массива
 */
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
