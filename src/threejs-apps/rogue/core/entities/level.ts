import {
    ENEMIES_COUNT_BASE, FieldSizeRooms, ITEMS_COUNT_BASE, LEVEL_ROOMS
} from '../../config/game.config';
import { getRandomPosition } from '../../utils/utils';
import { CorridorEntity } from './corridor';
import { EnemyEntity } from './enemy';
import { ItemEntity } from './item';
import { RoomEntity } from './room';

import type { ICharacterEntity, ICorridorEntity, IEnemyEntity, IGameSessionEntity, IItemEntity, ILevelEntity, IPosition, IRoomEntity } from '../../types/entities';

export class LevelEntity implements ILevelEntity {
  gameSession: IGameSessionEntity;
  level: number;
  rooms: IRoomEntity[];
  corridors: ICorridorEntity[];
  door: IItemEntity | null;
  character: ICharacterEntity;
  items: IItemEntity[];
  enemies: IEnemyEntity[];

  constructor(gameSession: IGameSessionEntity, character: ICharacterEntity) {
    this.gameSession = gameSession;
    this.level = 1;
    this.character = character;
    this.rooms = [];
    this.corridors = [];
    this.enemies = [];
    this.items = [];
    this.door = null;
  }

  create() {
    this.reset();
    this.createRooms();
    this.createCorridors();
    this.placeCharacter();
    this.createDoor();
    this.placeItems();
    this.placeEnemies();
  }

  reset() {
    this.rooms = [];
    this.corridors = [];
    this.enemies = [];
    this.items = [];
  }

  createRooms() {
    for (let i = 0; i < LEVEL_ROOMS; ++i) {
      this.rooms.push(new RoomEntity(this, i));
    }
  }

  createCorridors() {
    for (let row = 0; row < FieldSizeRooms.y; ++row) {
      for (let col = 0; col < FieldSizeRooms.x; ++col) {
        if (row - 1 >= 0)
          this.corridors.push(new CorridorEntity(this.rooms[row * FieldSizeRooms.y + col], this.rooms[(row - 1) * FieldSizeRooms.y + col]));
        if (row + 1 <= FieldSizeRooms.y - 1)
          this.corridors.push(new CorridorEntity(this.rooms[row * FieldSizeRooms.y + col], this.rooms[(row + 1) * FieldSizeRooms.y + col]));
        if (col - 1 >= 0)
          this.corridors.push(new CorridorEntity(this.rooms[row * FieldSizeRooms.y + col], this.rooms[row * FieldSizeRooms.y + col - 1]));
        if (col + 1 <= FieldSizeRooms.x - 1)
          this.corridors.push(new CorridorEntity(this.rooms[row * FieldSizeRooms.y + col], this.rooms[row * FieldSizeRooms.y + col + 1]));
      }
    }
  }

  placeCharacter() {
    this.character.position = getRandomPosition(this);
    const { room } = this.character.position;
    if (!room) return;
    room.isSeen = true;
  }

  createDoor() {
    const charPosition = this.character.position;
    const position = getRandomPosition(this);
    const door = new ItemEntity(position, true);

    if (position.room === charPosition.room && position.y === charPosition.y && position.x === charPosition.x) {
      this.createDoor();
    } else {
      this.door = door;
    }
  }

  placeItems() {
    const charPosition = this.character.position;
    const doorPosition = this.door!.position;
    let position: IPosition;
    let isFreeCell: boolean;

    for (let i = 0; i < ITEMS_COUNT_BASE - this.level; ++i) {
      isFreeCell = true;

      do {
        position = getRandomPosition(this);
        isFreeCell = position.room !== charPosition.room && position.y !== charPosition.y && position.x !== charPosition.x;
        isFreeCell = isFreeCell && !(position.room === doorPosition.room && position.y === doorPosition.y && position.x === doorPosition.x);
      } while (!isFreeCell);

      this.items.push(new ItemEntity(position));
    }
  }

  placeEnemies(): void {
    const charPosition = this.character.position;
    let position: IPosition;
    let isFreeCell: boolean;

    for (let i = 0; i < this.level + ENEMIES_COUNT_BASE; ++i) {
      isFreeCell = true;

      do {
        position = getRandomPosition(this);
        isFreeCell = position.room !== charPosition.room;
        isFreeCell = isFreeCell && !this.enemies.some((enemy) => enemy.position.y === position.y && enemy.position.x === position.x && enemy.position.room === position.room);
      } while (!isFreeCell);

      this.enemies.push(new EnemyEntity(position));
    }
  }
}
