import { WeatherType } from '../types/map-types';

export const MAP_CONFIG = {
  // Красная площадь координаты
  CENTER: {
    lat: 55.7539,
    lon: 37.6208,
  },

  // Область для загрузки (примерно 3x3 км вокруг центра)
  BOUNDS: {
    radius: 0.015, // в градусах (~1.5км)
  },

  // Камеры
  CAMERAS: {
    orthographic: {
      zoom: 100,
      position: [0, 500, 0] as [number, number, number],
      near: 0.1,
      far: 2000,
    },
    perspective: {
      fov: 50,
      position: [400, 300, 400] as [number, number, number],
      near: 0.1,
      far: 2000,
    },
    transitionDuration: 1.5, // секунды
  },

  // Масштабирование координат (метры на градус широты на широте Москвы)
  SCALE: {
    metersPerDegree: 111320, // для широты
    metersPerDegreeLon: 66700, // для долготы на широте Москвы
    worldScale: 10000, // масштаб world единиц
  },

  // Здания
  BUILDINGS: {
    defaultHeight: 15,
    floorHeight: 3,
    minHeight: 5,
    maxHeight: 300,
    colors: {
      default: '#B0B0B0',
      residential: '#C0C0C0',
      commercial: '#A0A0A0',
      industrial: '#909090',
      landmark: '#8B4513',
      glass: '#B0D0E0',
    },
  },

  // Дороги
  ROADS: {
    widths: {
      highway: 12,
      primary: 8,
      secondary: 6,
      residential: 4,
      pedestrian: 2,
    },
    color: '#2A2A2A',
    lineColor: '#FFD700',
  },

  // Парки
  PARKS: {
    color: '#4CAF50',
    height: 0.5,
  },

  // Вода
  WATER: {
    color: '#1976D2',
    opacity: 0.7,
    height: 0.2,
  },

  // Земля
  GROUND: {
    color: '#E8E8E8',
    size: 10000,
  },

  // Освещение
  LIGHTING: {
    ambient: {
      color: '#ffffff',
      intensity: 0.6,
    },
    directional: {
      color: '#ffffff',
      intensity: 0.8,
      position: [100, 200, 100] as [number, number, number],
    },
  },

  // Трафик
  TRAFFIC: {
    vehicleCount: 50,
    minSpeed: 10,
    maxSpeed: 30,
    vehicleSize: 3,
    colors: ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#FFFFFF'] as string[],
  },

  // Погода
  WEATHER: {
    rain: {
      particleCount: 1000,
      speed: 50,
      color: '#AAAAFF',
    },
    snow: {
      particleCount: 1000,
      speed: 10,
      color: '#FFFFFF',
    },
    fog: {
      color: '#CCCCCC',
      near: 100,
      far: 500,
    },
  },

  // Достопримечательности Москвы (центр)
  LANDMARKS: [
    {
      name: 'Кремль',
      lat: 55.7520,
      lon: 37.6175,
      description: 'Московский Кремль - резиденция Президента России',
      icon: '🏛️',
    },
    {
      name: 'Красная площадь',
      lat: 55.7539,
      lon: 37.6208,
      description: 'Главная площадь Москвы',
      icon: '🏛️',
    },
    {
      name: 'Собор Василия Блаженного',
      lat: 55.7525,
      lon: 37.6231,
      description: 'Покровский собор',
      icon: '⛪',
    },
    {
      name: 'ГУМ',
      lat: 55.7546,
      lon: 37.6211,
      description: 'Главный универсальный магазин',
      icon: '🏬',
    },
    {
      name: 'Исторический музей',
      lat: 55.7556,
      lon: 37.6178,
      description: 'Государственный исторический музей',
      icon: '🏛️',
    },
    {
      name: 'Мавзолей Ленина',
      lat: 55.7535,
      lon: 37.6196,
      description: 'Мавзолей В.И. Ленина',
      icon: '🏛️',
    },
  ],

  // UI
  UI: {
    miniMapSize: 200,
    infoPanelWidth: 300,
  },

  // Производительность
  PERFORMANCE: {
    lodDistances: [0, 200, 500, 1000],
    maxVisibleBuildings: 500,
    frustumCulling: true,
  },
} as const;

export type MapConfig = typeof MAP_CONFIG;
