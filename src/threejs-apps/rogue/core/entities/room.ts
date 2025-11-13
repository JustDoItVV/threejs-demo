import { FieldRoomSpace, FieldSizeRooms, RoomSize } from '../../config/game.config';

import type { Corridor } from './corridor';
import type { Level } from './level';

export class Room {
  level: Level;
  id: number;
  number: number;
  sizeY: number = 0;
  sizeX: number = 0;
  posY: number = 0;
  posX: number = 0;
  fieldY: number = 0;
  fieldX: number = 0;
  corridor: {
    up: Corridor | null;
    right: Corridor | null;
    down: Corridor | null;
    left: Corridor | null;
  };
  isSeen: boolean = false;
  isVisited: boolean = false;

  constructor(level: Level, number: number) {
    this.level = level;
    this.number = number;
    this.id = number;
    this.corridor = {
      up: null,
      right: null,
      down: null,
      left: null,
    };
    this.create();
  }

  create(): void {
    this.sizeY = Math.round(Math.random() * (RoomSize.Max - RoomSize.Min)) + RoomSize.Min;
    this.sizeX = Math.round(Math.random() * (RoomSize.Max - RoomSize.Min)) + RoomSize.Min;
    this.posY = Math.round(Math.random() * (FieldRoomSpace.Size - this.sizeY - FieldRoomSpace.Gap));
    this.posX = Math.round(Math.random() * (FieldRoomSpace.Size - this.sizeX - FieldRoomSpace.Gap));
    this.fieldY = Math.floor(this.number / FieldSizeRooms.y) * FieldRoomSpace.Size + this.posY;
    this.fieldX = (this.number % FieldSizeRooms.x) * FieldRoomSpace.Size + this.posX;
    this.isSeen = false;
    this.isVisited = false;
  }
}
