import { Enemies } from '../../config/game.config';
import { IEnemyEntity, IEnemyMovement, ILevelEntity, IPosition } from '../../types/entities';
import { getProbabilityResult } from '../../utils/utils';
import { ItemEntity } from './item';

export class EnemyEntity implements IEnemyEntity {
  level: ILevelEntity | null = null;
  type: string;
  subtype: 'zombie' | 'vampire' | 'ghost' | 'ogr' | 'snake';
  hp: number;
  maxHp: number;
  dex: number;
  str: number;
  hostility: number;
  movement: IEnemyMovement;
  position: IPosition;
  sawCharacter: boolean = false;
  weapon: { name: string; damage: number; type: 'weapon' } = { name: 'fists', damage: 0, type: 'weapon' };
  isAttacking: boolean = false;
  attackDirection: 'up' | 'down' | 'left' | 'right' | null = null;

  constructor(position: IPosition) {
    this.position = position;

    const enemyTypes = Object.keys(Enemies);
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)] as 'zombie' | 'vampire' | 'ghost' | 'ogr' | 'snake';
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
    this.isAttacking = false;
    this.attackDirection = null;
  }

  makeTurn() {
    const { room } = this.position;
    if (!room) return;

    const charPosition = room.level.character.position;
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
    const { room } = this.position;
    if (!room) return;

    const charPosition = room.level.character.position;
    const dx = charPosition.x - this.position.x;
    const dy = charPosition.y - this.position.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.attackDirection = dx > 0 ? 'right' : 'left';
    } else {
      this.attackDirection = dy > 0 ? 'up' : 'down';
    }

    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
      this.attackDirection = null;
    }, 200);

    const isHit = getProbabilityResult(this.dex / 4);
    if (isHit) {
      const damage = this.str;
      room.level.character.hp -= damage;
      room.level.gameSession.logMessages.push(
        `${this.subtype[0].toUpperCase() + this.subtype.slice(1)} attacks Player for ${damage} hp`
      );
    } else {
      room.level.gameSession.logMessages.push(`${this.subtype} missed`);
    }
  }

  move() {
    const { room } = this.position;
    if (!room) return;

    if (this.sawCharacter) {
      const charPosition = room.level.character.position;
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
    const { room } = this.position;
    if (!room) return;

    const gold = new ItemEntity(this.position);
    gold.setBySubtype('treasure', 'gold');
    gold.cost = Math.floor(Math.random() * 100);
    room.level.items.push(gold);
  }
}
