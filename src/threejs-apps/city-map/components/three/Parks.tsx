import { useMemo } from 'react';
import { ExtrudeGeometry, Shape } from 'three';

import { MAP_CONFIG } from '../../config/map.config';
import { Park } from '../../types/map-types';
import { geoArrayToVector2Array } from '../../utils/geo-utils';

interface ParkMeshProps {
  park: Park;
}

function ParkMesh({ park }: ParkMeshProps) {
  const geometry = useMemo(() => {
    const points = geoArrayToVector2Array(park.coordinates);

    if (points.length < 3) return null;

    const shape = new Shape();
    shape.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    shape.lineTo(points[0].x, points[0].y);

    const extrudeSettings = {
      depth: MAP_CONFIG.PARKS.height,
      bevelEnabled: false,
    };

    const geo = new ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(Math.PI / 2);

    return geo;
  }, [park.coordinates]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={MAP_CONFIG.PARKS.color}
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
}

interface ParksProps {
  parks: Park[];
}

export function Parks({ parks }: ParksProps) {
  return (
    <group>
      {parks.map((park) => (
        <ParkMesh key={park.id} park={park} />
      ))}
    </group>
  );
}
