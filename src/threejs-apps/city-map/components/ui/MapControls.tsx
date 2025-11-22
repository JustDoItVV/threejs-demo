import { Camera, CameraOff, Cloud, CloudRain, CloudSnow, Eye, EyeOff, Ruler } from 'lucide-react';

import { Button } from '@/libs/ui/button';

import { useMapStore } from '../../store/map-store';
import { WeatherType } from '../../types/map-types';

export function MapControls() {
  const { cameraMode, settings, toggleCameraMode, updateSettings, setWeather, setMeasuring, isМeasuring } =
    useMapStore();

  const weatherIcons: Record<WeatherType, React.ReactNode> = {
    clear: <Eye className="w-4 h-4" />,
    rain: <CloudRain className="w-4 h-4" />,
    snow: <CloudSnow className="w-4 h-4" />,
    fog: <Cloud className="w-4 h-4" />,
  };

  const weatherLabels: Record<WeatherType, string> = {
    clear: 'Ясно',
    rain: 'Дождь',
    snow: 'Снег',
    fog: 'Туман',
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      {/* Переключатель камеры */}
      <Button
        onClick={toggleCameraMode}
        size="sm"
        variant="default"
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title={cameraMode === '2d' ? 'Переключить на 3D вид' : 'Переключить на 2D вид'}
      >
        {cameraMode === '2d' ? (
          <>
            <Camera className="w-4 h-4 mr-2" />
            3D
          </>
        ) : (
          <>
            <CameraOff className="w-4 h-4 mr-2" />
            2D
          </>
        )}
      </Button>

      {/* Погода */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-2">
        <div className="text-xs font-semibold mb-2 px-2 text-gray-700 dark:text-gray-300">
          Погода
        </div>
        <div className="grid grid-cols-2 gap-1">
          {(['clear', 'rain', 'snow', 'fog'] as WeatherType[]).map((weather) => (
            <Button
              key={weather}
              onClick={() => setWeather(weather)}
              size="sm"
              variant={settings.weather === weather ? 'default' : 'outline'}
              className="text-xs"
              title={weatherLabels[weather]}
            >
              {weatherIcons[weather]}
            </Button>
          ))}
        </div>
      </div>

      {/* Видимость слоёв */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-2">
        <div className="text-xs font-semibold mb-2 px-2 text-gray-700 dark:text-gray-300">
          Слои
        </div>
        <div className="flex flex-col gap-1">
          <Button
            onClick={() => updateSettings({ showBuildings: !settings.showBuildings })}
            size="sm"
            variant={settings.showBuildings ? 'default' : 'outline'}
            className="text-xs justify-start"
          >
            {settings.showBuildings ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
            Здания
          </Button>
          <Button
            onClick={() => updateSettings({ showRoads: !settings.showRoads })}
            size="sm"
            variant={settings.showRoads ? 'default' : 'outline'}
            className="text-xs justify-start"
          >
            {settings.showRoads ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
            Дороги
          </Button>
          <Button
            onClick={() => updateSettings({ showParks: !settings.showParks })}
            size="sm"
            variant={settings.showParks ? 'default' : 'outline'}
            className="text-xs justify-start"
          >
            {settings.showParks ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
            Парки
          </Button>
          <Button
            onClick={() => updateSettings({ showTraffic: !settings.showTraffic })}
            size="sm"
            variant={settings.showTraffic ? 'default' : 'outline'}
            className="text-xs justify-start"
          >
            {settings.showTraffic ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
            Трафик
          </Button>
        </div>
      </div>

      {/* Инструменты */}
      <Button
        onClick={() => setMeasuring(!isМeasuring)}
        size="sm"
        variant={isМeasuring ? 'default' : 'outline'}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg"
        title="Измерение расстояний"
      >
        <Ruler className="w-4 h-4 mr-2" />
        Измерить
      </Button>
    </div>
  );
}
