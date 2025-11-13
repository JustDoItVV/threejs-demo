import { Enemies } from '../../config/game.config';
import { getProbabilityResult } from '../../utils/utils';
import { Item } from './item';

import type { Position } from '../../types/game-types';
import type { Level } from './level';

interface EnemyMovement {
  type: 'normal' | 'random' | 'diagonal';
  distance: number | null;
}

export class Enemy {
  level: Level | null = null;
  type: string;
  subtype: string;
  hp: number;
  maxHp: number;
  dex: number;
  str: number;
  hostility: number;
  movement: EnemyMovement;
  position: Position;
  sawCharacter: boolean = false;
  weapon: { name: string; damage: number; type: 'weapon' } = { name: 'fists', damage: 0, type: 'weapon' };

  constructor(position: Position) {
    this.position = position;

    const enemyTypes = Object.keys(Enemies);
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemy = Enemies[type];

    this.type = 'enemy';
    this.subtype = type;
    this.hp = enemy.hp;
    this.maxHp = enemy.hp;
    this.dex = enemy.dex;
    this.str = enemy.str;
    this.hostility = enemy.hostility;
    this.movement = enemy.movement;
    this.sawCharacter = false;
  }

  makeTurn(): void {
  // @ts-expect-error -- tmp
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

  attack(): void {
    const isHit = getProbabilityResult(this.dex / 4);
    if (isHit) {
      const damage = this.str;
  // @ts-expect-error -- tmp
      this.position.room.level.character.hp -= damage;
  // @ts-expect-error -- tmp
      this.position.room.level.gameSession.logMessages.push(
        `${this.subtype[0].toUpperCase() + this.subtype.slice(1)} attacks Player for ${damage} hp`
      );
    } else {
  // @ts-expect-error -- tmp
      this.position.room.level.gameSession.logMessages.push(`${this.subtype} missed`);
    }
  }

  move(): void {
    if (this.sawCharacter) {
  // @ts-expect-error -- tmp
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

  dropGold(): void {
    const gold = new Item(this.position);
    gold.setBySubtype('treasure', 'gold');
    gold.cost = Math.floor(Math.random() * 100);
  // @ts-expect-error -- tmp
    this.position.room.level.items.push(gold);
  }
}
