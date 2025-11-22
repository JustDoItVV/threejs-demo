import { Vector3 } from 'three';

import { useMapStore } from '../../store/map-store';
import { Building } from '../../types/map-types';
import { Buildings } from './Buildings';
import { CameraController } from './CameraController';
import { Ground } from './Ground';
import { Landmarks } from './Landmarks';
import { MeasurementTool } from './MeasurementTool';
import { Parks } from './Parks';
import { Roads } from './Roads';
import { Traffic } from './Traffic';
import { Water } from './Water';
import { Weather } from './Weather';

export function CityScene() {
  const { cityData, settings, setSelectedObject } = useMapStore();

  const handleBuildingClick = (building: Building) => {
    if (building.coordinates.length > 0) {
      const firstCoord = building.coordinates[0];
      setSelectedObject({
        type: 'building',
        id: building.id,
        name: building.name,
        position: new Vector3(0, 0, 0), // Будет обновлено
        data: building,
      });
    }
  };

  if (!cityData) {
    return null;
  }

  return (
    <>
      {/* Камера и контролы */}
      <CameraController />

      {/* Освещение */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[100, 200, 100]}
        intensity={0.8}
        castShadow={settings.shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={1000}
        shadow-camera-left={-500}
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
      />

      {/* Земля */}
      <Ground />

      {/* Вода */}
      {settings.showWater && cityData.water.length > 0 && <Water water={cityData.water} />}

      {/* Парки */}
      {settings.showParks && cityData.parks.length > 0 && <Parks parks={cityData.parks} />}

      {/* Дороги */}
      {settings.showRoads && cityData.roads.length > 0 && <Roads roads={cityData.roads} />}

      {/* Здания */}
      {settings.showBuildings && cityData.buildings.length > 0 && (
        <Buildings
          buildings={cityData.buildings}
          onBuildingClick={handleBuildingClick}
        />
      )}

      {/* Трафик */}
      {settings.showTraffic && cityData.roads.length > 0 && <Traffic roads={cityData.roads} />}

      {/* Достопримечательности */}
      {settings.showLandmarks && cityData.landmarks.length > 0 && (
        <Landmarks landmarks={cityData.landmarks} />
      )}

      {/* Погода */}
      <Weather weather={settings.weather} />

      {/* Инструмент измерения */}
      <MeasurementTool />
    </>
  );
}
