import { useMemo } from 'react';
import { ExtrudeGeometry, Shape } from 'three';

import { MAP_CONFIG } from '../../config/map.config';
import { Water as WaterType } from '../../types/map-types';
import { geoArrayToVector2Array } from '../../utils/geo-utils';

interface WaterMeshProps {
  water: WaterType;
}

function WaterMesh({ water }: WaterMeshProps) {
  const geometry = useMemo(() => {
    const points = geoArrayToVector2Array(water.coordinates);

    if (points.length < 3) return null;

    const shape = new Shape();
    shape.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    shape.lineTo(points[0].x, points[0].y);

    const extrudeSettings = {
      depth: MAP_CONFIG.WATER.height,
      bevelEnabled: false,
    };

    const geo = new ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(Math.PI / 2);

    return geo;
  }, [water.coordinates]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={MAP_CONFIG.WATER.color}
        transparent
        opacity={MAP_CONFIG.WATER.opacity}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

interface WaterProps {
  water: WaterType[];
}

export function Water({ water }: WaterProps) {
  return (
    <group>
      {water.map((w) => (
        <WaterMesh key={w.id} water={w} />
      ))}
    </group>
  );
}
