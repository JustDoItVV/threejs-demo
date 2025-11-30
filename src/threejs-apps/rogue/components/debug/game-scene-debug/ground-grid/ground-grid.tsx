import { TILE_SIZE } from '@/threejs-apps/rogue/config/game.config';
import { Grid, GridProps } from '@react-three/drei';

export function GroundGrid() {
  const gridConfig: GridProps = {
    cellSize: TILE_SIZE,
    cellThickness: 0.5,
    cellColor: '#6f6f6f',
    sectionSize: TILE_SIZE,
    sectionThickness: 1,
    sectionColor: '#9d4b4b',
    fadeDistance: 2000,
    fadeStrength: 0,
    followCamera: false,
    infiniteGrid: true,
  };

  return (
    <Grid
      rotation={[Math.PI / 2, 0, 0]}
      position={[-TILE_SIZE / 2, -TILE_SIZE / 2, 0.01]}
      args={[10.5, 10.5]}
      {...gridConfig}
    />
  );
}
