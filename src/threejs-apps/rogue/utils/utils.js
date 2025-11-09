import { LEVEL_ROOMS } from '../core/constants/app.const.js';

export const isSamePosition = (entity1, entity2) =>
  entity1.position.room === entity2.position.room &&
  entity1.position.y === entity2.position.y &&
  entity1.position.x === entity2.position.x;

export const getRandomPosition = (level) => {
  const room = level.rooms[Math.floor(Math.random() * LEVEL_ROOMS)];
  const y = Math.floor(Math.random() * (room.sizeY - 1));
  const x = Math.floor(Math.random() * (room.sizeX - 1));
  return { room, y, x };
}

export const getProbabilityResult = (n) => !!n && Math.random() <= n;
