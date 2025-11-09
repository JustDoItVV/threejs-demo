/**
 * Asset paths configuration for the Rogue game
 * Maps entity types to their sprite image paths
 */

// Base path for all rogue game assets
const ASSET_BASE = '/rogue/assets';

/**
 * Character sprites (player character)
 * Includes idle, walk, and attack animations with 3 directions each
 */
export const CHARACTER_ASSETS = {
  player: {
    idle: {
      down: `${ASSET_BASE}/1 Characters/1/D_Idle.png`,
      side: `${ASSET_BASE}/1 Characters/1/S_Idle.png`,
      up: `${ASSET_BASE}/1 Characters/1/U_Idle.png`,
    },
    walk: {
      down: `${ASSET_BASE}/1 Characters/1/D_Walk.png`,
      side: `${ASSET_BASE}/1 Characters/1/S_Walk.png`,
      up: `${ASSET_BASE}/1 Characters/1/U_Walk.png`,
    },
    attack: {
      down: `${ASSET_BASE}/1 Characters/1/D_Attack.png`,
      side: `${ASSET_BASE}/1 Characters/1/S_Attack.png`,
      up: `${ASSET_BASE}/1 Characters/1/U_Attack.png`,
    },
    shadow: `${ASSET_BASE}/1 Characters/Other/Shadow.png`,
  },
  // TODO: Add warrior2 (Character 2) and warrior3 (Character 3) for variety
  // warrior2: { idle: {...}, walk: {...}, attack: {...} },
  // warrior3: { idle: {...}, walk: {...}, attack: {...} },
};

/**
 * Enemy sprites (5 enemy types)
 * TODO: Complete enemy asset paths
 */
export const ENEMY_ASSETS = {
  zombie: {
    idle: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/1/D_Idle.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/1/S_Idle.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/1/U_Idle.png`,
    },
    walk: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/1/D_Walk.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/1/S_Walk.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/1/U_Walk.png`,
    },
    attack: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/1/D_Attack.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/1/S_Attack.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/1/U_Attack.png`,
    },
  },
  vampire: {
    idle: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/2/D_Idle.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/2/S_Idle.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/2/U_Idle.png`,
    },
    walk: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/2/D_Walk.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/2/S_Walk.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/2/U_Walk.png`,
    },
    attack: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/2/D_Attack.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/2/S_Attack.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/2/U_Attack.png`,
    },
  },
  ghost: {
    idle: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/3/D_Idle.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/3/S_Idle.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/3/U_Idle.png`,
    },
    walk: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/3/D_Walk.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/3/S_Walk.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/3/U_Walk.png`,
    },
    attack: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/3/D_Attack.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/3/S_Attack.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/3/U_Attack.png`,
    },
  },
  ogr: {
    idle: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/4/D_Idle.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/4/S_Idle.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/4/U_Idle.png`,
    },
    walk: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/4/D_Walk.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/4/S_Walk.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/4/U_Walk.png`,
    },
    attack: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/4/D_Attack.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/4/S_Attack.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/4/U_Attack.png`,
    },
  },
  // Snake mapped to zombie sprites (fallback - only 4 enemy types available)
  snake: {
    idle: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/1/D_Idle.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/1/S_Idle.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/1/U_Idle.png`,
    },
    walk: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/1/D_Walk.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/1/S_Walk.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/1/U_Walk.png`,
    },
    attack: {
      down: `${ASSET_BASE}/3 Dungeon Enemies/1/D_Attack.png`,
      side: `${ASSET_BASE}/3 Dungeon Enemies/1/S_Attack.png`,
      up: `${ASSET_BASE}/3 Dungeon Enemies/1/U_Attack.png`,
    },
  },
};

/**
 * Item sprites (treasure, food, elixir, scroll, weapon)
 * TODO: Complete item asset paths
 */
export const ITEM_ASSETS = {
  treasure: {
    chest1: `${ASSET_BASE}/2 Dungeon Tileset/3 Animated objects/Chest1_D.png`,
    chest2: `${ASSET_BASE}/2 Dungeon Tileset/3 Animated objects/Chest2_D.png`,
  },
  food: `${ASSET_BASE}/2 Dungeon Tileset/2 Objects/Boxes/1.png`,
  elixir: `${ASSET_BASE}/2 Dungeon Tileset/2 Objects/Other/1.png`,
  scroll: `${ASSET_BASE}/2 Dungeon Tileset/2 Objects/Other/2.png`,
  weapon: `${ASSET_BASE}/2 Dungeon Tileset/2 Objects/Other/3.png`,
};

/**
 * Door sprites
 * TODO: Complete door asset paths
 */
export const DOOR_ASSETS = {
  door: {
    down: `${ASSET_BASE}/2 Dungeon Tileset/3 Animated objects/Door_D.png`,
    side: `${ASSET_BASE}/2 Dungeon Tileset/3 Animated objects/Door_S.png`,
    up: `${ASSET_BASE}/2 Dungeon Tileset/3 Animated objects/Door_U.png`,
  },
  bigDoor: {
    down: `${ASSET_BASE}/2 Dungeon Tileset/3 Animated objects/BigDoor_D.png`,
    side: `${ASSET_BASE}/2 Dungeon Tileset/3 Animated objects/BigDoor_S.png`,
    up: `${ASSET_BASE}/2 Dungeon Tileset/3 Animated objects/BigDoor_U.png`,
  },
};

/**
 * Tile sprites for floor and walls
 * TODO: Complete tile asset paths
 */
export const TILE_ASSETS = {
  floor: [
    `${ASSET_BASE}/2 Dungeon Tileset/1 Tiles/Tile_03.png`,
    `${ASSET_BASE}/2 Dungeon Tileset/1 Tiles/Tile_04.png`,
    `${ASSET_BASE}/2 Dungeon Tileset/1 Tiles/Tile_05.png`,
  ],
  wall: [
    `${ASSET_BASE}/2 Dungeon Tileset/1 Tiles/Tile_20.png`,
    `${ASSET_BASE}/2 Dungeon Tileset/1 Tiles/Tile_21.png`,
  ],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get character sprite path based on animation state and direction
 * @param animation - Animation state: 'idle', 'walk', 'attack'
 * @param direction - Direction: 'down', 'side', 'up'
 * @returns Sprite image path
 */
export function getCharacterSprite(
  animation: 'idle' | 'walk' | 'attack' = 'idle',
  direction: 'down' | 'side' | 'up' = 'down'
): string {
  return CHARACTER_ASSETS.player[animation][direction];
}

/**
 * Get enemy sprite path based on enemy subtype, animation, and direction
 * @param subtype - Enemy subtype: 'zombie', 'vampire', 'ghost', 'ogr', 'snake'
 * @param animation - Animation state: 'idle', 'walk', 'attack'
 * @param direction - Direction: 'down', 'side', 'up'
 * @returns Sprite image path
 */
export function getEnemySprite(
  subtype: 'zombie' | 'vampire' | 'ghost' | 'ogr' | 'snake',
  animation: 'idle' | 'walk' | 'attack' = 'idle',
  direction: 'down' | 'side' | 'up' = 'down'
): string {
  const enemy = ENEMY_ASSETS[subtype] || ENEMY_ASSETS.zombie;
  return enemy[animation][direction];
}

/**
 * Get item sprite path based on item type
 * @param type - Item type: 'treasure', 'food', 'elixir', 'scroll', 'weapon'
 * @param variant - Optional variant (e.g., 'chest1' or 'chest2' for treasure)
 * @returns Sprite image path
 */
export function getItemSprite(
  type: 'treasure' | 'food' | 'elixir' | 'scroll' | 'weapon',
  variant?: string
): string {
  if (type === 'treasure' && variant) {
    return ITEM_ASSETS.treasure[variant as 'chest1' | 'chest2'] || ITEM_ASSETS.treasure.chest1;
  }
  return typeof ITEM_ASSETS[type] === 'string'
    ? (ITEM_ASSETS[type] as string)
    : ITEM_ASSETS.treasure.chest1;
}

/**
 * Get door sprite path based on direction
 * @param direction - Direction: 'down', 'side', 'up'
 * @param big - Use big door variant
 * @returns Sprite image path
 */
export function getDoorSprite(
  direction: 'down' | 'side' | 'up' = 'down',
  big: boolean = false
): string {
  const doorType = big ? DOOR_ASSETS.bigDoor : DOOR_ASSETS.door;
  return doorType[direction];
}

/**
 * Get tile sprite path
 * @param type - Tile type: 'floor' or 'wall'
 * @param index - Variant index
 * @returns Sprite image path
 */
export function getTileSprite(type: 'floor' | 'wall', index: number = 0): string {
  const tiles = TILE_ASSETS[type];
  return tiles[index % tiles.length];
}

// TODO: Future enhancements
// - Add sprite sheet parsing utilities
// - Add animation frame data (frame count, duration, etc.)
// - Add texture atlas support for better performance
// - Add preloading logic for commonly used assets
