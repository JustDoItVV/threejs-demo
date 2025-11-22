import { create } from 'zustand';

import {
  CameraMode,
  CityData,
  MapSettings,
  Measurement,
  SelectedObject,
  TrafficVehicle,
  WeatherType,
} from '../types/map-types';

interface MapState {
  // Данные карты
  cityData: CityData | null;
  isLoading: boolean;
  error: string | null;

  // Режим камеры
  cameraMode: CameraMode;

  // Настройки отображения
  settings: MapSettings;

  // Выбранный объект
  selectedObject: SelectedObject | null;

  // Трафик
  traffic: TrafficVehicle[];

  // Измерения
  measurements: Measurement[];
  isМeasuring: boolean;

  // Поиск
  searchQuery: string;

  // Actions
  setCityData: (data: CityData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  toggleCameraMode: () => void;
  setCameraMode: (mode: CameraMode) => void;

  updateSettings: (settings: Partial<MapSettings>) => void;
  toggleWeather: () => void;
  setWeather: (weather: WeatherType) => void;

  setSelectedObject: (object: SelectedObject | null) => void;

  setTraffic: (traffic: TrafficVehicle[]) => void;
  updateTraffic: (id: string, updates: Partial<TrafficVehicle>) => void;

  addMeasurement: (measurement: Measurement) => void;
  removeMeasurement: (id: string) => void;
  clearMeasurements: () => void;
  setMeasuring: (measuring: boolean) => void;

  setSearchQuery: (query: string) => void;

  reset: () => void;
}

const defaultSettings: MapSettings = {
  showBuildings: true,
  showRoads: true,
  showParks: true,
  showWater: true,
  showLandmarks: true,
  showTraffic: true,
  shadows: true,
  weather: 'clear',
  detailLevel: 'high',
};

export const useMapStore = create<MapState>((set, get) => ({
  // Начальное состояние
  cityData: null,
  isLoading: true,
  error: null,
  cameraMode: '3d',
  settings: defaultSettings,
  selectedObject: null,
  traffic: [],
  measurements: [],
  isМeasuring: false,
  searchQuery: '',

  // Actions
  setCityData: (data) => set({ cityData: data, isLoading: false }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  toggleCameraMode: () =>
    set((state) => ({
      cameraMode: state.cameraMode === '2d' ? '3d' : '2d',
    })),

  setCameraMode: (mode) => set({ cameraMode: mode }),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  toggleWeather: () =>
    set((state) => {
      const weatherTypes: WeatherType[] = ['clear', 'rain', 'snow', 'fog'];
      const currentIndex = weatherTypes.indexOf(state.settings.weather);
      const nextIndex = (currentIndex + 1) % weatherTypes.length;
      return {
        settings: {
          ...state.settings,
          weather: weatherTypes[nextIndex],
        },
      };
    }),

  setWeather: (weather) =>
    set((state) => ({
      settings: { ...state.settings, weather },
    })),

  setSelectedObject: (object) => set({ selectedObject: object }),

  setTraffic: (traffic) => set({ traffic }),

  updateTraffic: (id, updates) =>
    set((state) => ({
      traffic: state.traffic.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle
      ),
    })),

  addMeasurement: (measurement) =>
    set((state) => ({
      measurements: [...state.measurements, measurement],
    })),

  removeMeasurement: (id) =>
    set((state) => ({
      measurements: state.measurements.filter((m) => m.id !== id),
    })),

  clearMeasurements: () => set({ measurements: [] }),

  setMeasuring: (measuring) => set({ isМeasuring: measuring }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  reset: () =>
    set({
      selectedObject: null,
      measurements: [],
      isМeasuring: false,
      searchQuery: '',
      settings: defaultSettings,
    }),
}));
