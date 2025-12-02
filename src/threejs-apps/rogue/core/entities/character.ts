import { CharacterStats } from '../../config/game.config';
import { IBackpackEntity, ICharacterEntity, IItemEntity, IPosition } from '../../types/entities';
import { getProbabilityResult, isSamePosition } from '../../utils/utils';
import { BackpackEntity } from './backpack';
import { ItemEntity } from './item';

import type { EnemyEntity } from './enemy';
export class CharacterEntity implements ICharacterEntity {
  maxHp: number;
  hp: number;
  dex: number;
  str: number;
  position: IPosition;
  backpack: IBackpackEntity;
  weapon: IItemEntity;
  gold: number;
  isAttacking: boolean;
  attackDirection: 'up' | 'down' | 'left' | 'right' | null;

  constructor() {
    this.position = {
      room: null,
      y: 0,
      x: 0,
      z: 0,
    };
    this.backpack = new BackpackEntity();
    this.maxHp = 0;
    this.hp = 0;
    this.dex = 0;
    this.str = 0;
    // Initialize weapon with temporary values, will be properly set in reset()
    const tempWeapon = new ItemEntity(this.position);
    tempWeapon.setBySubtype('weapon', 'knife');
    this.weapon = tempWeapon;
    this.gold = 0;
    this.isAttacking = false;
    this.attackDirection = null;
    this.reset();
  }

  reset(): void {
    this.maxHp = CharacterStats.MaxHP;
    this.hp = CharacterStats.StartHP;
    this.dex = CharacterStats.Dex;
    this.str = CharacterStats.Str;
    this.backpack.items = [];
    this.weapon = new ItemEntity(this.position);
    this.weapon.setBySubtype('weapon', 'knife');
    this.gold = 0;
  }

  move(direction: 'up' | 'down' | 'left' | 'right') {
    const { room, y, x } = this.position;

    if (!room) return;

    room.isSeen = true;

    if (direction === 'up') {
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y + 1 && enemy.position.x === x);
      if (enemy) {
        this.attack(enemy);
      } else if (room.corridor.up && y + 1 === room.corridor.up.start.y && x === room.corridor.up.start.x) {
        const newRoom = room.corridor.up.end.room;
        this.position = {
          room: newRoom,
          y: room.corridor.up.end.y + 1,
          x: room.corridor.up.end.x,
          z: 0,
        };
        room.isSeen = true;
        newRoom.isSeen = true;
        room.level.gameSession.logMessages.push(`Move to the next room`);
        room.level.gameSession.statistics.travelledDistance++;
      } else if (y < room.sizeY - 1) {
        this.position.y++;
        room.level.gameSession.logMessages.push(`Move up`);
        room.level.gameSession.statistics.travelledDistance++;
      } else {
        room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'right') {
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x + 1);
      if (enemy) {
        this.attack(enemy);
      } else if (room.corridor.right && x + 1 === room.corridor.right.start.x && y === room.corridor.right.start.y) {
        const newRoom = room.corridor.right.end.room;
        this.position = {
          room: newRoom,
          y: room.corridor.right.end.y,
          x: room.corridor.right.end.x + 1,
          z: 0,
        };
        room.isSeen = true;
        newRoom.isSeen = true;
        room.level.gameSession.logMessages.push(`Move to the next room`);
        room.level.gameSession.statistics.travelledDistance++;
      } else if (x < room.sizeX - 1) {
        this.position.x++;
        room.level.gameSession.logMessages.push(`Move right`);
        room.level.gameSession.statistics.travelledDistance++;
      } else {
        room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'down') {
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y - 1 && enemy.position.x === x);
      if (enemy) {
        this.attack(enemy);
      } else if (room.corridor.down && y - 1 === room.corridor.down.start.y && x === room.corridor.down.start.x) {
        const newRoom = room.corridor.down.end.room;
        this.position = {
          room: newRoom,
          y: room.corridor.down.end.y - 1,
          x: room.corridor.down.end.x,
          z: 0,
        };
        room.isSeen = true;
        newRoom.isSeen = true;
        room.level.gameSession.logMessages.push(`Move to the next room`);
        room.level.gameSession.statistics.travelledDistance++;
      } else if (y > 0) {
        this.position.y--;
        room.level.gameSession.logMessages.push(`Move down`);
        room.level.gameSession.statistics.travelledDistance++;
      } else {
        room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'left') {
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x - 1);
      if (enemy) {
        this.attack(enemy);
      } else if (room.corridor.left && x - 1 === room.corridor.left.start.x && y === room.corridor.left.start.y) {
        const newRoom = room.corridor.left.end.room;
        this.position = {
          room: newRoom,
          y: room.corridor.left.end.y,
          x: room.corridor.left.end.x - 1,
          z: 0,
        };
        room.isSeen = true;
        newRoom.isSeen = true;
        room.level.gameSession.logMessages.push(`Move to the next room`);
        room.level.gameSession.statistics.travelledDistance++;
      } else if (x > 0) {
        this.position.x--;
        room.level.gameSession.logMessages.push(`Move left`);
        room.level.gameSession.statistics.travelledDistance++;
      } else {
        room.level.gameSession.logMessages.push(`Can't move further`);
      }
    }
  }

  attack(enemy: EnemyEntity) {
    const { room } = this.position;
    if (!room) return;

    const dx = enemy.position.x - this.position.x;
    const dy = enemy.position.y - this.position.y;

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
      const damage = this.str + (this.weapon.strengthUp || 0);
      enemy.hp -= damage;
      room.level.gameSession.logMessages.push(`Attack ${enemy.type} for ${damage} hp`);
    } else {
      room.level.gameSession.logMessages.push(`You missed`);
      room.level.gameSession.statistics.hitMissed++;
    }
  }

  pickItemIfAvailable(): void {
    const { room } = this.position;
    if (!room) return;

    const itemsAtPosition = room.level.items.filter((item) => isSamePosition(item, this));

    if (itemsAtPosition.length === 0) return;

    let backpackFullEncountered = false;
    const pickedItems: IItemEntity[] = [];

    for (const item of itemsAtPosition) {
      let isPut;
      if (item.subtype === 'gold') {
        this.gold += item.cost;
        isPut = true;
      } else {
        isPut = this.backpack.putItem(item);
      }

      if (isPut) {
        pickedItems.push(item);
        room.level.gameSession.logMessages.push(
          `Pick up ${item.type} ${item.subtype}${item.subtype === 'gold' ? ` ${item.cost}` : ''}`
        );
      } else {
        backpackFullEncountered = true;
      }
    }

    room.level.items = room.level.items.filter(
      (item) => !pickedItems.includes(item)
    );

    if (backpackFullEncountered) {
      room.level.gameSession.logMessages.push(`Backpack is full. Some items left behind.`);
    }
  }

  useItem(item: ItemEntity) {
    const { room } = this.position;
    if (!room) return;

    if (item.type === 'food') {
      this.hp = this.hp + (item.healthUp || 0) > this.maxHp ? this.maxHp : this.hp + (item.healthUp || 0);
      room.level.gameSession.logMessages.push(`Eat ${item.subtype}, restored ${item.healthUp} HP`);
      room.level.gameSession.statistics.foodEaten++;
    } else if (item.type === 'weapon') {
      this.dropItem(this.weapon);
      this.weapon = item;
    } else if (item.type === 'treasure') {
      this.dropItem(item);
    } else if (item.type === 'elixir') {
      if (item.subtype === 'dex' && item.dexterityUp) {
        this.dex += item.dexterityUp;
        room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.dexterityUp}`);
        room.level.gameSession.statistics.elixirsDrunk++;
      }
      if (item.subtype === 'str' && item.strengthUp) {
        this.str += item.strengthUp;
        room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.strengthUp}`);
        room.level.gameSession.statistics.elixirsDrunk++;
      }
      if (item.subtype === 'hp' && item.maxHealthUp) {
        this.maxHp += item.maxHealthUp;
        room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.maxHealthUp}`);
        room.level.gameSession.statistics.elixirsDrunk++;
      }
    } else if (item.type === 'scroll') {
      if (item.subtype === 'dex' && item.dexterityUp) {
        this.dex += item.dexterityUp;
        room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.dexterityUp}`);
        room.level.gameSession.statistics.scrollsUsed++;
      }
      if (item.subtype === 'str' && item.strengthUp) {
        this.str += item.strengthUp;
        room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.strengthUp}`);
        room.level.gameSession.statistics.scrollsUsed++;
      }
      if (item.subtype === 'hp' && item.maxHealthUp) {
        this.maxHp += item.maxHealthUp;
        room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.healthUp}`);
        room.level.gameSession.statistics.scrollsUsed++;
      }
    }
  }

  dropItem(item: ItemEntity) {
    const { room } = this.position;
    if (!room) return;

    const door = room.level.door;
    item.position = { ...this.position };

    item.position.y -= 1;
    if (!isSamePosition(door, item)) {
      room.level.items.push(item);
      return;
    }

    item.position.y += 2;
    if (!isSamePosition(door, item)) {
      room.level.items.push(item);
      return;
    }

    item.position.y -= 1;
    item.position.x -= 1;
    if (!isSamePosition(door, item)) {
      room.level.items.push(item);
      return;
    }

    item.position.x += 2;
    if (!isSamePosition(door, item)) {
      room.level.items.push(item);
      return;
    }
  }
}
