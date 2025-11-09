import { Room } from './room.js';
import { ENEMIES_COUNT_BASE, FieldSizeRooms, ITEMS_COUNT_BASE, LEVEL_ROOMS } from '../constants/app.const.js';
import { Corridor } from './corridor.js';
import { Item } from './item.js';
import { Enemy } from './enemy.js';
import { getRandomPosition } from '../../utils/utils.js';

export class Level {
  gameSession = null;
  level = null;
  rooms = null;
  corridors = null;
  door = null;
  character = null;
  items = null;
  enemies = null;

  constructor(gameSession, character) {
    this.gameSession = gameSession;
    this.level = 1;
    this.character = character;
    // Initialize arrays immediately to avoid null reference errors
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
    this.placeItems()
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
      this.rooms.push(new Room(this, i));
    }
  }

  createCorridors() {
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

  placeCharacter() {
    this.character.position = getRandomPosition(this);
    this.character.position.room.isSeen = true;
  }

  createDoor() {
    const charPosition = this.character.position;
    const position = getRandomPosition(this);
    const door = new Item(position, true);

    if (position.room === charPosition.room && position.y === charPosition.y && position.x === charPosition.x) {
      this.createDoor();
    } else {
      this.door = door;
    }
  }

  placeItems() {
    const charPosition = this.character.position;
    const doorPosition = this.door.position;
    let position;
    let isFreeCell;

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

  placeEnemies() {
    const charPosition = this.character.position;
    let position;
    let isFreeCell;

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
