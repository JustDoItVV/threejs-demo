export enum ELaneType {
  Grass = 'grass',
  Road = 'road',
  Water = 'water',
}

export enum ELaneObjectType {
  Tree = 'tree',
  Log = 'log',
  Car = 'car',
}

export interface ILaneObject {
  xIndex: number;
  type: ELaneObjectType;
  velocity: number;
  direction: 1 | -1;
  speed: number;
  worldX: number;
  color?: number;
}

export interface ILane {
  id: number;
  type: ELaneType;
  yIndex: number;
  objects: ILaneObject[];
  poolIndex?: number;
}
