import { FieldRoomSpace, FieldSizeRooms, RoomSize } from '../constants/app.const.js';

export class Room {
  level = null;
  number = null;
  sizeY = null;
  sizeX = null;
  posY = null;
  posX = null;
  fieldY = null;
  fieldX = null;
  corridor = null;
  isSeen = null;

  constructor(level, number) {
    this.level = level;
    this.number = number;
    this.corridor = {
      up: null,
      right: null,
      down: null,
      left: null,
    };
    this.create();
  }

  create() {
    this.sizeY = Math.round(Math.random() * (RoomSize.Max - RoomSize.Min)) + RoomSize.Min;
    this.sizeX = Math.round(Math.random() * (RoomSize.Max - RoomSize.Min)) + RoomSize.Min;
    this.posY = Math.round(Math.random() * (FieldRoomSpace.Size - this.sizeY - FieldRoomSpace.Gap));
    this.posX = Math.round(Math.random() * (FieldRoomSpace.Size - this.sizeX - FieldRoomSpace.Gap));
    this.fieldY = Math.floor(this.number / FieldSizeRooms.y) * FieldRoomSpace.Size + this.posY;
    this.fieldX = this.number % FieldSizeRooms.x * FieldRoomSpace.Size + this.posX;
    this.isSeen = false;
  }
}
