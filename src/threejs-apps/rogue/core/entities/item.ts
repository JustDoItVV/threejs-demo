import { Items } from '../../config/game.config';
import { IItemEntity, IPosition } from '../../types/entities';

export class ItemEntity implements IItemEntity {
  type: string;
  subtype: string | null = null;
  healthUp: number | null = null;
  maxHealthUp: number | null = null;
  dexterityUp: number | null = null;
  strengthUp: number | null = null;
  cost: number = 0;
  position: IPosition;
  isDoor?: boolean;
  name: string = '';

  constructor(position: IPosition, isDoor: boolean = false) {
    this.position = position;

    if (isDoor) {
      this.type = 'door';
      this.isDoor = true;
    } else {
      const itemTypes = Object.keys(Items);
      const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      const itemSubtypes = Object.keys(Items[itemType]);
      const itemSubtype = itemSubtypes[Math.floor(Math.random() * itemSubtypes.length)];
      const item = Items[itemType][itemSubtype];

      this.type = itemType;
      this.subtype = itemSubtype;
      this.healthUp = item.healthUp;
      this.maxHealthUp = item.maxHealthUp;
      this.dexterityUp = item.dexterityUp;
      this.strengthUp = item.strengthUp;
      this.cost = item.cost;
      this.name = `${itemType} ${itemSubtype}`;

      if (this.subtype === 'gold') {
        this.cost *= Math.floor(Math.random() * 100);
      }
    }
  }

  setBySubtype(type: string, subtype: string): void {
    const item = Items[type][subtype];
    this.type = type;
    this.subtype = subtype;
    this.healthUp = item.healthUp;
    this.maxHealthUp = item.maxHealthUp;
    this.dexterityUp = item.dexterityUp;
    this.strengthUp = item.strengthUp;
    this.cost = item.cost;
    this.name = `${type} ${subtype}`;
  }
}
