'use client';

import { useEffect } from 'react';

import { CanvasWrapper } from '../../components/three/canvas-wrapper';
import { CityScene } from './components/three/CityScene';
import { InfoPanel } from './components/ui/InfoPanel';
import { MapControls } from './components/ui/MapControls';
import { MiniMap } from './components/ui/MiniMap';
import { loadMoscowData } from './data/osm-loader';
import { useMapStore } from './store/map-store';

export function CityMapViewer() {
  const { setCityData, setLoading, setError, isLoading, error } = useMapStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadMoscowData();
        setCityData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load city data');
      }
    };

    loadData();
  }, [setCityData, setLoading, setError]);

  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-900">
      <CanvasWrapper>
        <CityScene />
      </CanvasWrapper>

      {/* UI компоненты */}
      <MiniMap />
      <MapControls />
      <InfoPanel />

      {/* Загрузка */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Загрузка карты Москвы...
            </div>
          </div>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md">
            <div className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Ошибка загрузки
            </div>
            <div className="text-gray-700 dark:text-gray-300">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}
