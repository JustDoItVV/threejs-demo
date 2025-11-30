import { BACKPACK_SIZE } from '../../config/game.config';
import { IBackpackEntity, IItemEntity } from '../../types/entities';

export class BackpackEntity implements IBackpackEntity {
  items: IItemEntity[] = [];
  size = BACKPACK_SIZE;
  filter: string | null = null;

  constructor() {
    this.items = [];
    this.size = BACKPACK_SIZE;
  }

  putItem(item: IItemEntity) {
    if (this.items.length === BACKPACK_SIZE) return false;

    this.items.push(item);
    return true;
  }

  showItems(type: string) {
    this.filter = type;

    if (this.filter === 'any') return this.items;

    return this.items.filter((item) => item.type === type);
  }

  getItem(typeIndex: number) {
    const items = this.showItems(this.filter || 'any');
    if (typeIndex >= items.length) {
      return;
    }

    const item = items[typeIndex];
    const index = this.items.findIndex((el) => el === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return item;
  }

  removeItem(itemIndex: number) {
    if (itemIndex < 0 || itemIndex >= this.items.length) {
      return null;
    }
    const item = this.items[itemIndex];
    this.items.splice(itemIndex, 1);
    return item;
  }
}
