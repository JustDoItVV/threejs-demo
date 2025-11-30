import { FieldRoomSpace, FieldSizeRooms, RoomSize } from '../../config/game.config';

import type { ICorridorEntity, ILevelEntity, IRoomEntity } from '../../types/entities';

export class RoomEntity implements IRoomEntity {
  level: ILevelEntity;
  id: number;
  number: number;
  sizeY: number = 0;
  sizeX: number = 0;
  posY: number = 0;
  posX: number = 0;
  fieldY: number = 0;
  fieldX: number = 0;
  corridor: {
    up: ICorridorEntity | null;
    right: ICorridorEntity | null;
    down: ICorridorEntity | null;
    left: ICorridorEntity | null;
  };
  isSeen: boolean = false;
  isVisited: boolean = false;

  constructor(level: ILevelEntity, number: number) {
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

  create() {
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
