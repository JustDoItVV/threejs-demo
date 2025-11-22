import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import { Vector3 } from 'three';

import { Landmark } from '../../types/map-types';
import { geoToMap } from '../../utils/geo-utils';

interface LandmarkMarkerProps {
  landmark: Landmark;
}

function LandmarkMarker({ landmark }: LandmarkMarkerProps) {
  const position = useMemo(() => {
    const { x, z } = geoToMap(landmark.position);
    const height = landmark.height || 50;
    return new Vector3(x, height + 10, z);
  }, [landmark]);

  return (
    <group position={position}>
      {/* 3D Pin/Marker */}
      <mesh>
        <coneGeometry args={[3, 8, 4]} />
        <meshStandardMaterial color="#FF4444" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>

      {/* Вертикальная линия от земли до метки */}
      <mesh position={[0, -(landmark.height || 50) / 2 - 5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, landmark.height || 50]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.3}
          emissive="#FFFFFF"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* HTML Label */}
      <Html distanceFactor={50} position={[0, 8, 0]} center>
        <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border-2 border-red-500 whitespace-nowrap pointer-events-none">
          <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-xl">{landmark.icon}</span>
            <span>{landmark.name}</span>
          </div>
          {landmark.description && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-xs">
              {landmark.description}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

interface LandmarksProps {
  landmarks: Landmark[];
}

export function Landmarks({ landmarks }: LandmarksProps) {
  return (
    <group>
      {landmarks.map((landmark) => (
        <LandmarkMarker key={landmark.id} landmark={landmark} />
      ))}
    </group>
  );
}
