import { CityData } from '../types/map-types';
import moscowData from './moscow-data.json';

/**
 * Загружает данные карты для Москвы
 * В будущем можно добавить загрузку из реального Overpass API
 */
export async function loadMoscowData(): Promise<CityData> {
  // Используем статические данные
  return moscowData as CityData;
}

/**
 * Загружает данные из Overpass API (пример для будущей реализации)
 */
export async function loadFromOverpassAPI(
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number
): Promise<CityData> {
  const query = `
    [out:json][timeout:25];
    (
      way["building"](${minLat},${minLon},${maxLat},${maxLon});
      way["highway"](${minLat},${minLon},${maxLat},${maxLon});
      way["leisure"="park"](${minLat},${minLon},${maxLat},${maxLon});
      way["natural"="water"](${minLat},${minLon},${maxLat},${maxLon});
    );
    out body;
    >;
    out skel qt;
  `;

  const url = 'https://overpass-api.de/api/interpreter';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Overpass API');
    }

    const data = await response.json();

    // Парсинг данных из OSM формата
    return parseOverpassData(data);
  } catch (error) {
    console.error('Error loading from Overpass API:', error);
    // Возвращаем статические данные в случае ошибки
    return loadMoscowData();
  }
}

/**
 * Парсит данные из формата Overpass API в наш формат
 */
function parseOverpassData(data: any): CityData {
  // Это упрощенная версия парсера
  // В реальной реализации нужно правильно обработать все элементы
  const buildings: CityData['buildings'] = [];
  const roads: CityData['roads'] = [];
  const parks: CityData['parks'] = [];
  const water: CityData['water'] = [];

  // Парсинг элементов...
  // TODO: Реализовать полный парсинг

  return {
    buildings,
    roads,
    parks,
    water,
    landmarks: [],
    bounds: {
      minLat: 0,
      maxLat: 0,
      minLon: 0,
      maxLon: 0,
    },
  };
}
