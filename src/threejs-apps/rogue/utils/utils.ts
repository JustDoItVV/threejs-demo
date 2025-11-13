import { getItemSprite } from '../config/assets';
import { LEVEL_ROOMS } from '../config/game.config';
import { Item } from '../types/game-types';

  // @ts-expect-error -- tmp
export const isSamePosition = (entity1, entity2) =>
  entity1.position.room === entity2.position.room &&
  entity1.position.y === entity2.position.y &&
  entity1.position.x === entity2.position.x;

  // @ts-expect-error -- tmp
export const getRandomPosition = (level) => {
  const room = level.rooms[Math.floor(Math.random() * LEVEL_ROOMS)];
  const y = Math.floor(Math.random() * (room.sizeY - 1));
  const x = Math.floor(Math.random() * (room.sizeX - 1));
  return { room, y, x };
}

export const getProbabilityResult = (n: number) => !!n && Math.random() <= n;

// Helper function to get item sprite path based on item name hash
export const getItemSpritePath = (item: Item): string | null => {
  if (!item?.name) return null;
  let hash = 0;
  for (let i = 0; i < item.name.length; i++) {
    hash = (hash << 5) - hash + item.name.charCodeAt(i);
    hash = hash & hash;
  }
  const variant = Math.abs(hash);
  return getItemSprite(
    item.type as 'treasure' | 'food' | 'elixir' | 'scroll' | 'weapon',
    variant
  );
}
