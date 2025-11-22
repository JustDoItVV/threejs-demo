import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import { Group, Mesh } from 'three';

import { Building } from '../../types/map-types';
import { generateBuildingGeometry } from '../../utils/building-generator';
import { geoToMap } from '../../utils/geo-utils';
import { calculateBuildingHeight, getBuildingColor, getColorVariation } from '../../utils/map-utils';

interface BuildingMeshProps {
  building: Building;
  onClick?: (building: Building) => void;
  onHover?: (building: Building | null) => void;
  isSelected?: boolean;
}

function BuildingMesh({ building, onClick, onHover, isSelected }: BuildingMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const height = calculateBuildingHeight(building);
  const baseColor = getBuildingColor(building);
  const color = useMemo(() => getColorVariation(baseColor, 0.05), [baseColor]);

  const geometry = useMemo(() => {
    const geo = generateBuildingGeometry({ ...building, height });
    return geo;
  }, [building, height]);

  const position = useMemo(() => {
    if (building.coordinates.length === 0) return [0, 0, 0];
    const center = geoToMap(building.coordinates[0]);
    return [center.x, 0, center.z];
  }, [building.coordinates]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.(building);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover?.(building);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(null);
    document.body.style.cursor = 'default';
  };

  // Анимация подсветки при выборе
  useFrame((state) => {
    if (meshRef.current && (isSelected || hovered)) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
      meshRef.current.scale.y = scale;
    } else if (meshRef.current) {
      meshRef.current.scale.y = 1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position as [number, number, number]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={building.isLandmark ? 0.3 : 0.1}
        roughness={building.isLandmark ? 0.4 : 0.8}
        emissive={isSelected || hovered ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
      />
    </mesh>
  );
}

interface BuildingsProps {
  buildings: Building[];
  onBuildingClick?: (building: Building) => void;
  onBuildingHover?: (building: Building | null) => void;
  selectedBuildingId?: string;
}

export function Buildings({
  buildings,
  onBuildingClick,
  onBuildingHover,
  selectedBuildingId,
}: BuildingsProps) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {buildings.map((building) => (
        <BuildingMesh
          key={building.id}
          building={building}
          onClick={onBuildingClick}
          onHover={onBuildingHover}
          isSelected={building.id === selectedBuildingId}
        />
      ))}
    </group>
  );
}
