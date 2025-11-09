import { BACKPACK_SIZE } from '../constants/app.const.js';

export class Backpack {
  items = null;
  size = null;
  filter = null;

  constructor() {
    this.items = [];
    this.size = BACKPACK_SIZE;
  }

  putItem(item) {
    if (this.items.length === BACKPACK_SIZE) return false;

    this.items.push(item);
    return true;
  }

  showItems(type) {
    this.filter = type;

    if (this.filter === 'any') return this.items;

    return this.items.filter((item) => item.type === type);
  }

  getItem(typeIndex) {
    const items = this.showItems(this.filter);
    if (typeIndex >= items.length) {
      return;
    }

    const item = items[typeIndex];
    const index = this.items.find((el) => el === item);
    this.items.splice(index, 1);
    return item;
  }
}
