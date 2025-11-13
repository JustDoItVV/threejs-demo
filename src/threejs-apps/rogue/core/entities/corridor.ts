import type { CorridorEndpoint, CorridorSegment } from '../../types/game-types';
import type { Room } from './room';

export class Corridor {
  start: CorridorEndpoint;
  end: CorridorEndpoint;
  segments: CorridorSegment[] = [];

  constructor(roomStart: Room, roomEnd: Room) {
    this.start = { room: roomStart, x: 0, y: 0 };
    this.end = { room: roomEnd, x: 0, y: 0 };
    this.setDoors();
  }

  setDoors(): void {
  // @ts-expect-error -- tmp
    const delta = this.end.room.number - this.start.room.number;

    if (delta === 1) {
      this.start.y = Math.floor((this.start.room.sizeY - 1) / 2);
      this.start.x = this.start.room.sizeX;
  // @ts-expect-error -- tmp
      this.start.room.corridor.right = this;
      this.end.y = Math.floor((this.end.room.sizeY - 1) / 2);
      this.end.x = -1;
      this.setSegments('horizontal');
    } else if (delta === -1) {
      this.start.y = Math.floor((this.start.room.sizeY - 1) / 2);
      this.start.x = -1;
  // @ts-expect-error -- tmp
      this.start.room.corridor.left = this;
      this.end.y = Math.floor((this.end.room.sizeY - 1) / 2);
      this.end.x = this.end.room.sizeX;
      this.setSegments('horizontal');
    } else if (delta > 1) {
      this.start.y = this.start.room.sizeY;
      this.start.x = Math.floor((this.start.room.sizeX - 1) / 2);
  // @ts-expect-error -- tmp
      this.start.room.corridor.up = this;
      this.end.y = -1;
      this.end.x = Math.floor((this.end.room.sizeX - 1) / 2);
      this.setSegments('vertical');
    } else if (delta < 1) {
      this.start.y = -1;
      this.start.x = Math.floor((this.start.room.sizeX - 1) / 2);
  // @ts-expect-error -- tmp
      this.start.room.corridor.down = this;
      this.end.y = this.end.room.sizeY;
      this.end.x = Math.floor((this.end.room.sizeX - 1) / 2);
      this.setSegments('vertical');
    }
  }

  setSegments(orientation: 'horizontal' | 'vertical'): void {
    this.segments = [
      { orientation: 'horizontal', fieldY: 0, fieldX: 0, height: 0, width: 0 },
      { orientation: 'vertical', fieldY: 0, fieldX: 0, height: 0, width: 0 },
    ];

    if (orientation === 'horizontal') {
      this.segments[0].orientation = 'horizontal';
      this.segments[0].fieldY = this.start.room.fieldY + this.start.y;
      this.segments[0].fieldX = this.start.room.fieldX + (this.start.x < 0 ? 0 : this.start.x);
      this.segments[0].height = 1;
      this.segments[0].width = (this.end.room.fieldX + this.end.x - this.segments[0].fieldX) / 2;
      if (this.segments[0].width < 0) {
        this.segments[0].width = Math.round(Math.abs(this.segments[0].width));
        this.segments[0].fieldX -= this.segments[0].width;
      }
      this.segments[0].width = Math.round(this.segments[0].width);

      this.segments[1].orientation = 'vertical';
      this.segments[1].fieldY = this.segments[0].fieldY;
      this.segments[1].fieldX =
        (this.end.room.fieldX + this.end.x - this.segments[0].fieldX) / 2 < 0
          ? this.segments[0].fieldX
          : this.segments[0].fieldX + this.segments[0].width;
      this.segments[1].height = this.end.room.fieldY + this.end.y - this.segments[1].fieldY;
      this.segments[1].width = 1;
      if (this.segments[1].height < 1) this.segments[1].height = 1;
    } else {
      this.segments[0].orientation = 'vertical';
      this.segments[0].fieldY = this.start.room.fieldY + (this.start.y < 0 ? 0 : this.start.y);
      this.segments[0].fieldX = this.start.room.fieldX + this.start.x;
      this.segments[0].height = (this.end.room.fieldY + this.end.y - this.segments[0].fieldY) / 2;
      this.segments[0].width = 1;
      if (this.segments[0].height < 0) {
        this.segments[0].height = Math.round(Math.abs(this.segments[0].height));
        this.segments[0].fieldY -= this.segments[0].height;
      }
      this.segments[0].height = Math.round(this.segments[0].height);

      this.segments[1].orientation = 'horizontal';
      this.segments[1].fieldY =
        (this.end.room.fieldY + this.end.y - this.segments[0].fieldY) / 2 < 0
          ? this.segments[0].fieldY
          : this.segments[0].fieldY + this.segments[0].height;
      this.segments[1].fieldX = this.segments[0].fieldX;
      this.segments[1].height = 1;
      this.segments[1].width = this.end.room.fieldX + this.end.x - this.segments[1].fieldX;
      if (this.segments[1].width < 1) this.segments[1].width = 1;
    }
  }
}
