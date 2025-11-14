import type { RowData } from '../types';

// Game constants from the original tutorial
export const MIN_TILE_INDEX = -8;
export const MAX_TILE_INDEX = 8;
export const TILES_PER_ROW = MAX_TILE_INDEX - MIN_TILE_INDEX + 1;
export const TILE_SIZE = 42;

// Player animation constants
export const STEP_TIME = 0.2; // Time for one step in seconds
export const JUMP_HEIGHT = 8; // Max height of jump animation

// Map metadata - defines the game level layout
export const MAP_METADATA: RowData[] = [
  {
    type: 'car',
    direction: false,
    speed: 188,
    vehicles: [
      { initialTileIndex: -4, color: 0xbdb638 },
      { initialTileIndex: -1, color: 0x78b14b },
      { initialTileIndex: 4, color: 0xa52523 },
    ],
  },
  {
    type: 'forest',
    trees: [
      { tileIndex: -5, height: 50 },
      { tileIndex: 0, height: 30 },
      { tileIndex: 3, height: 50 },
    ],
  },
  {
    type: 'car',
    direction: true,
    speed: 125,
    vehicles: [
      { initialTileIndex: -4, color: 0x78b14b },
      { initialTileIndex: 0, color: 0xbdb638 },
      { initialTileIndex: 5, color: 0xbdb638 },
    ],
  },
  {
    type: 'forest',
    trees: [
      { tileIndex: -8, height: 30 },
      { tileIndex: -3, height: 50 },
      { tileIndex: 2, height: 30 },
    ],
  },
];
