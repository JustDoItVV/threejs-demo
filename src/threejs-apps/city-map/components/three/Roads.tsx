import { useMemo } from 'react';
import { BufferGeometry, CatmullRomCurve3, TubeGeometry, Vector3 } from 'three';

import { MAP_CONFIG } from '../../config/map.config';
import { Road } from '../../types/map-types';
import { geoArrayToVector3Array } from '../../utils/geo-utils';
import { getRoadWidth } from '../../utils/map-utils';

interface RoadMeshProps {
  road: Road;
}

function RoadMesh({ road }: RoadMeshProps) {
  const geometry = useMemo<BufferGeometry>(() => {
    const points = geoArrayToVector3Array(road.coordinates, 0.1);

    if (points.length < 2) {
      return new BufferGeometry();
    }

    // Создаем кривую из точек
    const curve = new CatmullRomCurve3(points);

    // Создаем трубу вдоль кривой
    const width = getRoadWidth(road.type);
    const tubeGeometry = new TubeGeometry(curve, points.length * 2, width / 2, 4, false);

    return tubeGeometry;
  }, [road]);

  if (road.coordinates.length < 2) return null;

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={MAP_CONFIG.ROADS.color}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

interface RoadsProps {
  roads: Road[];
}

export function Roads({ roads }: RoadsProps) {
  return (
    <group>
      {roads.map((road) => (
        <RoadMesh key={road.id} road={road} />
      ))}
    </group>
  );
}
