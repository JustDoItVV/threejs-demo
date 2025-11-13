import {
    ENEMIES_COUNT_BASE, FieldSizeRooms, ITEMS_COUNT_BASE, LEVEL_ROOMS
} from '../../config/game.config';
import { getRandomPosition } from '../../utils/utils';
import { Corridor } from './corridor';
import { Enemy } from './enemy';
import { Item } from './item';
import { Room } from './room';

import type { Character } from './character';
import type { GameSession } from './game-session';
import type { Position } from '../../types/game-types';

export class Level {
  gameSession: GameSession;
  level: number;
  rooms: Room[];
  corridors: Corridor[];
  door: Item | null;
  character: Character;
  items: Item[];
  enemies: Enemy[];

  constructor(gameSession: GameSession, character: Character) {
    this.gameSession = gameSession;
    this.level = 1;
    this.character = character;
    this.rooms = [];
    this.corridors = [];
    this.enemies = [];
    this.items = [];
    this.door = null;
  }

  create(): void {
    this.reset();
    this.createRooms();
    this.createCorridors();
    this.placeCharacter();
    this.createDoor();
    this.placeItems();
    this.placeEnemies();
  }

  reset(): void {
    this.rooms = [];
    this.corridors = [];
    this.enemies = [];
    this.items = [];
  }

  createRooms(): void {
    for (let i = 0; i < LEVEL_ROOMS; ++i) {
      this.rooms.push(new Room(this, i));
    }
  }

  createCorridors(): void {
    for (let row = 0; row < FieldSizeRooms.y; ++row) {
      for (let col = 0; col < FieldSizeRooms.x; ++col) {
        if (row - 1 >= 0)
          this.corridors.push(new Corridor(this.rooms[row * FieldSizeRooms.y + col], this.rooms[(row - 1) * FieldSizeRooms.y + col]));
        if (row + 1 <= FieldSizeRooms.y - 1)
          this.corridors.push(new Corridor(this.rooms[row * FieldSizeRooms.y + col], this.rooms[(row + 1) * FieldSizeRooms.y + col]));
        if (col - 1 >= 0)
          this.corridors.push(new Corridor(this.rooms[row * FieldSizeRooms.y + col], this.rooms[row * FieldSizeRooms.y + col - 1]));
        if (col + 1 <= FieldSizeRooms.x - 1)
          this.corridors.push(new Corridor(this.rooms[row * FieldSizeRooms.y + col], this.rooms[row * FieldSizeRooms.y + col + 1]));
      }
    }
  }

  placeCharacter(): void {
    this.character.position = getRandomPosition(this);
    this.character.position.room.isSeen = true;
  }

  createDoor(): void {
    const charPosition = this.character.position;
    const position = getRandomPosition(this);
    const door = new Item(position, true);

    if (position.room === charPosition.room && position.y === charPosition.y && position.x === charPosition.x) {
      this.createDoor();
    } else {
      this.door = door;
    }
  }

  placeItems(): void {
    const charPosition = this.character.position;
    const doorPosition = this.door!.position;
    let position: Position;
    let isFreeCell: boolean;

    for (let i = 0; i < ITEMS_COUNT_BASE - this.level; ++i) {
      isFreeCell = true;

      do {
        position = getRandomPosition(this);
        isFreeCell = position.room !== charPosition.room && position.y !== charPosition.y && position.x !== charPosition.x;
        isFreeCell = isFreeCell && !(position.room === doorPosition.room && position.y === doorPosition.y && position.x === doorPosition.x);
      } while (!isFreeCell);

      this.items.push(new Item(position));
    }
  }

  placeEnemies(): void {
    const charPosition = this.character.position;
    let position: Position;
    let isFreeCell: boolean;

    for (let i = 0; i < this.level + ENEMIES_COUNT_BASE; ++i) {
      isFreeCell = true;

      do {
        position = getRandomPosition(this);
        isFreeCell = position.room !== charPosition.room;
        isFreeCell = isFreeCell && !this.enemies.some((enemy) => enemy.position.y === position.y && enemy.position.x === position.x && enemy.position.room === position.room);
      } while (!isFreeCell);

      this.enemies.push(new Enemy(position));
    }
  }
}
