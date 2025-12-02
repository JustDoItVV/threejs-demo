export const enum EGameState {
  Start = 'start',
  Game = 'game',
  Backpack = 'backpack',
  End = 'end',
}

export interface Position {
  x: number;
  y: number;
  z: number;
  room: Room;
}

export interface Room {
  id: number;
  fieldX: number;
  fieldY: number;
  sizeX: number;
  sizeY: number;
  isSeen: boolean;
  isVisited: boolean;
}

export interface CorridorSegment {
  orientation: 'horizontal' | 'vertical';
  fieldX: number;
  fieldY: number;
  width: number;
  height: number;
}

export interface CorridorEndpoint {
  room: Room;
  x: number;
  y: number;
}

export interface Corridor {
  start: CorridorEndpoint;
  end: CorridorEndpoint;
  segments: CorridorSegment[];
}

export interface Weapon {
  name: string;
  damage: number;
  type: 'weapon';
}

export interface Item {
  subtype: string;
  strengthUp: number;
  dexterityUp: number;
  healthUp: number;
  maxHealthUp: number;
  cost: number;
  type: 'treasure' | 'food' | 'elixir' | 'scroll' | 'weapon';
  name: string;
  position: Position;
  isDoor?: boolean;
}

export interface Character {
  hp: number;
  maxHp: number;
  dex: number;
  str: number;
  position: Position;
  weapon: Weapon;
  gold: number;
  backpack: {
    filter: unknown;
    items: Item[];
    size: number;
  };
}

export interface Enemy {
  subtype: 'zombie' | 'vampire' | 'ghost' | 'ogr' | 'snake';
  hp: number;
  maxHp: number;
  dex: number;
  str: number;
  position: Position;
  weapon: Weapon;
}

export interface Level {
  number: number;
  rooms: Room[];
  corridors: Corridor[];
  door: Item | null;
  items: Item[];
  enemies: Enemy[];
}

export interface GameStatistics {
  enemiesKilled: number;
  itemsCollected: number;
  roomsVisited: number;
  turnsPlayed: number;
}

export interface GameSession {
  state: EGameState;
  level: Level;
  character: Character;
  logMessages: string[];
  backpackItems: Item[] | null;
  statistics: GameStatistics;
  win: boolean | null;
}

// Direction types for movement
export type Direction = 'up' | 'down' | 'left' | 'right';

// Backpack action types
export type BackpackAction = 'use' | 'drop' | 'cancel';

// Repository types
export interface SavedGameSession {
  timestamp: number;
  session: GameSession;
}

export interface HighScoreEntry {
  score: number;
  level: number;
  timestamp: number;
  enemiesKilled: number;
}
