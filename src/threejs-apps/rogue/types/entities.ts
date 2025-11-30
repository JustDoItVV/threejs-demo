import type { EGameState } from './game-types';

export interface IPosition {
  x: number;
  y: number;
  z: number;
  room: IRoomEntity | null;
}

export interface IRoomEntity {
  level: ILevelEntity;
  id: number;
  number: number;
  sizeY: number;
  sizeX: number;
  posY: number;
  posX: number;
  fieldY: number;
  fieldX: number;
  corridor: {
    up: ICorridorEntity | null;
    right: ICorridorEntity | null;
    down: ICorridorEntity | null;
    left: ICorridorEntity | null;
  };
  isSeen: boolean;
  isVisited: boolean;

  create: () => void;
}

export interface ILevelEntity {
  gameSession: IGameSessionEntity;
  level: number;
  rooms: IRoomEntity[];
  corridors: ICorridorEntity[];
  door: IItemEntity | null;
  character: ICharacterEntity;
  items: IItemEntity[];
  enemies: IEnemyEntity[];

  create: () => void;
  reset: () => void;
  createRooms: () => void;
  createCorridors: () => void;
  placeCharacter: () => void;
  createDoor: () => void;
  placeItems: () => void;
  placeEnemies: () => void;
}

export interface IItemEntity {
  type: string;
  subtype: string | null;
  healthUp: number | null;
  maxHealthUp: number | null;
  dexterityUp: number | null;
  strengthUp: number | null;
  cost: number;
  position: IPosition;
  isDoor?: boolean;
  name: string;

  setBySubtype: (type: string, subtype: string) => void;
}

export interface IGameStatisticsEntity {
  enemiesKilled: number;
  foodEaten: number;
  elixirsDrunk: number;
  scrollsUsed: number;
  hitMissed: number;
  travelledDistance: number;
  itemsDropped?: number;
}


export interface IGameSessionEntity {
  datalayer: IDatalayer;
  state: EGameState;
  level: ILevelEntity;
  character: ICharacterEntity;
  win: boolean | null;
  logMessages: string[];
  backpackItems: IItemEntity[] | null;
  statistics: IGameStatisticsEntity;

  init: () => void;
  reset: () => void;
  startGame: () => void;
  start: () => void;
  restart: () => void;
  makeTurn: (input: string) => void;
  endGame: (win: boolean, message: string) => void;
  useBackpack: (input: string) => void;
  dropBackpackItem: (input: string) => void;
  useUserInput: (input: string) => void;
  applyData: (json: Partial<IGameSessionEntity>) => void;
}

export interface IHighscore {
  score: number;
  date: Date;
}

export interface IDatalayer {
  STORAGE_PREFIX: string;
  SESSION_KEY: string;
  HIGHSCORE_KEY: string;

  saveSession: (gameSession: IGameSessionEntity) => void;
  loadSession: () => IGameSessionEntity;
  saveHighscore: (data: IHighscore) => void;
  loadHighscore: () => IHighscore[];
  clearSession: () => void;
  clearHighscores: () => void;
}

export interface IEnemyMovement {
  type: 'normal' | 'random' | 'diagonal';
  distance: number | null;
}

export interface IEnemyEntity {
  level: ILevelEntity | null;
  type: string;
  subtype: string;
  hp: number;
  maxHp: number;
  dex: number;
  str: number;
  hostility: number;
  movement: IEnemyMovement;
  position: IPosition;
  sawCharacter: boolean;
  weapon: { name: string; damage: number; type: 'weapon' };

  makeTurn: () => void;
  attack: () => void;
  move: () => void;
  dropGold: () => void;
}

export interface ICorridorSegment {
  orientation: 'horizontal' | 'vertical';
  fieldX: number;
  fieldY: number;
  width: number;
  height: number;
}

export interface ICorridorEndpoint {
  room: IRoomEntity;
  x: number;
  y: number;
}

export interface ICorridorEntity {
  start: ICorridorEndpoint;
  end: ICorridorEndpoint;
  segments: ICorridorSegment[];

  setDoors: () => void;
  setSegments: (orientation: 'horizontal' | 'vertical') => void;
}

export interface ICharacterEntity {
  maxHp: number;
  hp: number;
  dex: number;
  str: number;
  position: IPosition;
  backpack: IBackpackEntity;
  weapon: IItemEntity;
  gold: number;

  reset: () => void;
  move: (direction: 'up' | 'down' | 'left' | 'right') => void;
  attack: (enemy: IEnemyEntity) => void;
  pickItemIfAvailable: () => void;
  useItem: (item: IItemEntity) => void;
  dropItem: (item: IItemEntity) => void;
}

export interface IBackpackEntity {
  items: IItemEntity[];
  size: number;
  filter: string | null;

  putItem: (item: IItemEntity) => boolean;
  showItems: (type: string) => IItemEntity[];
  getItem: (typeIndex: number) => IItemEntity | undefined;
  removeItem: (itemIndex: number) => IItemEntity | null;
}
