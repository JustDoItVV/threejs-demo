import { MAP_CONFIG } from '../../config/map.config';

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[MAP_CONFIG.GROUND.size, MAP_CONFIG.GROUND.size]} />
      <meshStandardMaterial color={MAP_CONFIG.GROUND.color} />
    </mesh>
  );
}
