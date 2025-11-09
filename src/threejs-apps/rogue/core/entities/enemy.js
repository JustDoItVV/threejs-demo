import { Enemies } from '../constants/app.const.js';
import { Item } from './item.js';
import { getProbabilityResult } from '../../utils/utils.js';

export class Enemy {
  level = null;
  type = null;
  hp = null;
  dex = null;
  str = null;
  hostility = null;
  movement = null;
  position = null;
  sawCharacter = null;

  constructor(position) {
    const type = Object.keys(Enemies)[Math.floor(Math.random() * Object.keys(Enemies).length)];
    const enemy = Enemies[type];
    this.type = type;
    this.hp = enemy.hp;
    this.dex = enemy.dex;
    this.str = enemy.str;
    this.hostility = enemy.hostility;
    this.movement = enemy.movement;
    this.position = position;
    this.sawCharacter = false;
  }

  makeTurn() {
    const charPosition = this.position.room.level.character.position;
    if (this.position.room === charPosition.room) {
      const dy = Math.abs(charPosition.y - this.position.y);
      const dx = Math.abs(charPosition.x - this.position.x);

      if (Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2)) <= this.hostility + 1) {
        this.sawCharacter = true;
      }

      if (dy * dx === 0 && dx + dy <= 1) {
        this.attack();
      } else {
        this.move();
      }
    }
  }

  attack() {
    const isHit = getProbabilityResult(this.dex / 4);
    if (isHit) {
      const damage = this.str;
      this.position.room.level.character.hp -= damage;
      this.position.room.level.gameSession.logMessages.push(`${this.type[0].toUpperCase() + this.type.slice(1)} attacks Player for ${damage} hp`);
    } else {
      this.position.room.level.gameSession.logMessages.push(`${this.type} missed`);
    }
  }

  move() {
    if (this.sawCharacter) {
      const charPosition = this.position.room.level.character.position;
      const dy = Math.sign(charPosition.y - this.position.y);
      const dx = Math.sign(charPosition.x - this.position.x);
      if (Math.abs(dy) > Math.abs(dx)) {
        this.position.y += dy;
      } else {
        this.position.x += dx;
      }
    }
  }

  dropGold() {
    const gold = new Item(this.position);
    gold.setBySubtype('treasure', 'gold');
    gold.cost = Math.floor(Math.random() * 100);
    this.position.room.level.items.push(gold);
  }
}
