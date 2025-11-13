import { getAssetPath } from '@/libs/ui/utils';

const ASSET_BASE = getAssetPath('/rogue/assets');

export const CHARACTER_ASSETS = {
  player: {
    idle: {
      down: `${ASSET_BASE}/1-Characters/1/D_Idle.png`,
      side: `${ASSET_BASE}/1-Characters/1/S_Idle.png`,
      up: `${ASSET_BASE}/1-Characters/1/U_Idle.png`,
    },
    walk: {
      down: `${ASSET_BASE}/1-Characters/1/D_Walk.png`,
      side: `${ASSET_BASE}/1-Characters/1/S_Walk.png`,
      up: `${ASSET_BASE}/1-Characters/1/U_Walk.png`,
    },
    attack: {
      down: `${ASSET_BASE}/1-Characters/1/D_Attack.png`,
      side: `${ASSET_BASE}/1-Characters/1/S_Attack.png`,
      up: `${ASSET_BASE}/1-Characters/1/U_Attack.png`,
    },
    shadow: `${ASSET_BASE}/1-Characters/Other/Shadow.png`,
  },
};

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

export const ITEM_ASSETS = {
  treasure: [
    `${ASSET_BASE}/2-Dungeon-Tileset/3-Animated-objects/Chest1_D.png`,
    `${ASSET_BASE}/2-Dungeon-Tileset/3-Animated-objects/Chest2_D.png`,
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/40.png`, // gold coins
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/41.png`, // gems
  ],
  food: [
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Boxes/1.png`,
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Boxes/2.png`,
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Boxes/3.png`,
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/18.png`, // food/meat
  ],
  elixir: [
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/1.png`, // potion
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/2.png`, // potion
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/3.png`, // potion
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/4.png`, // potion
  ],
  scroll: [
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/5.png`, // scroll
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/6.png`, // book
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/7.png`, // book
  ],
  weapon: [
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/10.png`, // sword
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/11.png`, // axe
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/12.png`, // spear
    `${ASSET_BASE}/2-Dungeon-Tileset/2-Objects/Other/13.png`, // bow
  ],
};

export const DOOR_ASSETS = {
  door: {
    down: `${ASSET_BASE}/2-Dungeon-Tileset/3-Animated-objects/Door_D.png`,
    side: `${ASSET_BASE}/2-Dungeon-Tileset/3-Animated-objects/Door_S.png`,
    up: `${ASSET_BASE}/2-Dungeon-Tileset/3-Animated-objects/Door_U.png`,
  },
  bigDoor: {
    down: `${ASSET_BASE}/2-Dungeon-Tileset/3-Animated-objects/BigDoor_D.png`,
    side: `${ASSET_BASE}/2-Dungeon-Tileset/3-Animated-objects/BigDoor_S.png`,
    up: `${ASSET_BASE}/2-Dungeon-Tileset/3-Animated-objects/BigDoor_U.png`,
  },
};

export const TILE_ASSETS = {
  floor: [
    `${ASSET_BASE}/2-Dungeon-Tileset/1-Tiles/Tile_03.png`,
    `${ASSET_BASE}/2-Dungeon-Tileset/1-Tiles/Tile_04.png`,
    `${ASSET_BASE}/2-Dungeon-Tileset/1-Tiles/Tile_05.png`,
  ],
  wall: [
    `${ASSET_BASE}/2-Dungeon-Tileset/1-Tiles/Tile_20.png`,
    `${ASSET_BASE}/2-Dungeon-Tileset/1-Tiles/Tile_21.png`,
  ],
};

// Helper Functions

export function getCharacterSprite(
  animation: 'idle' | 'walk' | 'attack' = 'idle',
  direction: 'down' | 'side' | 'up' = 'down'
): string {
  return CHARACTER_ASSETS.player[animation][direction];
}

export function getEnemySprite(
  subtype: 'zombie' | 'vampire' | 'ghost' | 'ogr' | 'snake',
  animation: 'idle' | 'walk' | 'attack' = 'idle',
  direction: 'down' | 'side' | 'up' = 'down'
): string {
  const enemy = ENEMY_ASSETS[subtype] || ENEMY_ASSETS.zombie;
  return enemy[animation][direction];
}

export function getItemSprite(
  type: 'treasure' | 'food' | 'elixir' | 'scroll' | 'weapon',
  variant: number = 0
): string {
  const sprites = ITEM_ASSETS[type];
  if (Array.isArray(sprites)) {
    return sprites[variant % sprites.length];
  }
  return ITEM_ASSETS.treasure[0];
}

export function getDoorSprite(
  direction: 'down' | 'side' | 'up' = 'down',
  big: boolean = false
): string {
  const doorType = big ? DOOR_ASSETS.bigDoor : DOOR_ASSETS.door;
  return doorType[direction];
}

export function getTileSprite(type: 'floor' | 'wall', index: number = 0): string {
  const tiles = TILE_ASSETS[type];
  return tiles[index % tiles.length];
}
