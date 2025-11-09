import { Items } from '../constants/app.const.js';

export class Item {
  type = null;
  subtype = null;
  healthUp = null;
  maxHealthUp = null;
  dexterityUp = null;
  strengthUp = null;
  cost = null;

  position = null;

  constructor(position, isDoor = false) {
    if (isDoor) {
      this.type = 'door';
    } else {
      const itemType = Object.keys(Items)[Math.floor(Math.random() * Object.keys(Items).length)];
      const itemSubtype = Object.keys(Items[itemType])[Math.floor(Math.random() * Object.keys(Items[itemType]).length)];
      const item = Items[itemType][itemSubtype];
      this.type = itemType;
      this.subtype = itemSubtype;
      this.healthUp = item.healthUp;
      this.maxHealthUp = item.maxHealthUp;
      this.dexterityUp = item.dexterityUp;
      this.strengthUp = item.strengthUp;
      this.cost = item.cost;
      if (this.subtype === 'gold')
        this.cost *= Math.floor(Math.random() * 100);
    }
    this.position = position;
  }

  setBySubtype(type, subtype) {
    const item = Items[type][subtype];
    this.type = type;
    this.subtype = subtype;
    this.healthUp = item.healthUp;
    this.maxHealthUp = item.maxHealthUp;
    this.dexterityUp = item.dexterityUp;
    this.strengthUp = item.strengthUp;
    this.cost = item.cost;
}
}
