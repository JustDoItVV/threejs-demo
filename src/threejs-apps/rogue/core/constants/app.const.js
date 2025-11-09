export const PIXEL_X_SIZE = 2;

export const MAX_LEVEL = 21;

export const FieldSizeRooms = {
  y: 3,
  x: 3,
};
export const LEVEL_ROOMS = FieldSizeRooms.y * FieldSizeRooms.x;

export const RoomSize = {
  Min: 3,
  Max: 8,
};
export const FieldRoomSpace = {
  Size: 13,
  Gap: 3,
};

export const CharacterStats = {
  StartHP: 20,
  MaxHP: 20,
  Dex: 2,
  Str: 2,
  Move: 1,
};
export const BACKPACK_SIZE = 9;

export const ENEMIES_COUNT_BASE = 4;
export const Enemies = {
  zombie: {
    ch: 'z',
    color: 'green',
    dex: 1,
    str: 2,
    hostility: 2,
    hp: 15,
    movement: {
      type: 'normal',
      distance: 1,
    },
  },
  vampire: {
    ch: 'v',
    color: 'red',
    dex: 3,
    str: 2,
    hostility: 3,
    hp: 15,
    movement: {
      type: 'normal',
      distance: 1,
    },
  },
  ghost: {
    ch: 'g',
    color: 'white',
    dex: 3,
    str: 1,
    hostility: 1,
    hp: 5,
    movement: {
      type: 'random',
      distance: null,
    },
  },
  ogr: {
    ch: 'O',
    color: 'yellow',
    dex: 1,
    str: 4,
    hostility: 2,
    hp: 20,
    movement: {
      type: 'normal',
      distance: 2,
    },
  },
  snake: {
    ch: 's',
    color: 'white',
    dex: 4,
    str: 1,
    hostility: 3,
    hp: 10,
    movement: {
      type: 'diagonal',
      distance: 1,
    },
  },
};

export const ITEMS_COUNT_BASE = 25;
export const Items = {
  treasure: {
    gold: {
      ch: '⛁',
      color: 'yellow',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: null,
      cost: 1,
    },
    ring: {
      ch: '⭗',
      color: 'yellow',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: null,
      cost: 1000,
    },
    necklace: {
      ch: '☋',
      color: 'yellow',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: null,
      cost: 2000,
    },
  },
  food: {
    cake: {
      ch: '◷',
      color: 'red',
      healthUp: 10,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: null,
      cost: 20,
    },
    apple: {
      ch: '⬤',
      color: 'red',
      healthUp: 5,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: null,
      cost: 10,
    },
  },
  elixir: {
    dex: {
      ch: '⬮',
      color: 'yellow',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: 10,
      strengthUp: null,
      cost: 100,
    },
    str: {
      ch: '⬮',
      color: 'red',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: 10,
      strengthUp: null,
      cost: 100,
    },
  },
  scroll: {
    dex: {
      ch: '⬔',
      color: 'yellow',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: 5,
      strengthUp: null,
      cost: 500,
    },
    str: {
      ch: '⬔',
      color: 'red',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: 5,
      cost: 500,
    },
    hp: {
      ch: '⬔',
      color: 'white',
      healthUp: null,
      maxHealthUp: 5,
      dexterityUp: null,
      strengthUp: null,
      cost: 500,
    },
  },
  weapon: {
    knife: {
      ch: '-',
      color: 'white',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: 2,
      cost: 100,
    },
    club: {
      ch: '!',
      color: 'white',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: 5,
      cost: 300,
    },
    sword: {
      ch: '⬀',
      color: 'white',
      healthUp: null,
      maxHealthUp: null,
      dexterityUp: null,
      strengthUp: 10,
      cost: 500,
    },
  },
};
