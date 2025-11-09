import { CharacterStats } from '../constants/app.const.js';
import { getProbabilityResult, isSamePosition } from '../../utils/utils.js';
import { Backpack } from './backpack.js';
import { Item } from './item.js';

export class Character {
  maxHp = null;
  hp = null;
  dex = null;
  str = null;

  position = null;
  backpack = null;
  weapon = null;
  gold = null;

  constructor() {
    this.position = {
      room: null,
      y: null,
      x: null,
    };
    this.backpack = new Backpack();
    this.reset();
  }

  reset() {
    this.maxHp = CharacterStats.MaxHP;
    this.hp = CharacterStats.StartHP;
    this.dex = CharacterStats.Dex;
    this.str = CharacterStats.Str;
    this.backpack.items = [];
    this.weapon = new Item(this.position);
    this.weapon.setBySubtype('weapon', 'knife');
    this.gold = 0;
  }

  move(direction) {
    const { room, y, x } = this.position;
    room.isSeen = true;

    if (direction === 'up') {
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y + 1 && enemy.position.x === x);
      if (enemy) {
        this.attack(enemy);
      } else if (room.corridor.up && y + 1 === room.corridor.up.start.y && x === room.corridor.up.start.x) {
        this.position = {
          room: room.corridor.up.end.room,
          y: room.corridor.up.end.y + 1,
          x: room.corridor.up.end.x,
        };
        this.position.room.level.gameSession.logMessages.push(`Move to the next room`);
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else if (y < room.sizeY - 1) {
        this.position.y++;
        this.position.room.level.gameSession.logMessages.push(`Move up`);
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else {
        this.position.room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'right') {
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x + 1);
      if (enemy) {
        this.attack(enemy);
      } else if (room.corridor.right && x + 1 === room.corridor.right.start.x && y === room.corridor.right.start.y) {
        this.position = {
          room: room.corridor.right.end.room,
          y: room.corridor.right.end.y,
          x: room.corridor.right.end.x + 1,
        };
        this.position.room.level.gameSession.logMessages.push(`Move to the next room`);
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else if (x < room.sizeX - 1) {
        this.position.x++;
        this.position.room.level.gameSession.logMessages.push(`Move right`);
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else {
        this.position.room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'down') {
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y - 1 && enemy.position.x === x);
      if (enemy) {
        this.attack(enemy);
      } else if (room.corridor.down && y - 1 === room.corridor.down.start.y && x === room.corridor.down.start.x) {
        this.position = {
          room: room.corridor.down.end.room,
          y: room.corridor.down.end.y - 1,
          x: room.corridor.down.end.x,
        };
        this.position.room.level.gameSession.logMessages.push(`Move to the next room`);
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else if (y > 0) {
        this.position.y--;
        this.position.room.level.gameSession.logMessages.push(`Move down`);
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else {
        this.position.room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'left') {
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x - 1);
      if (enemy) {
        this.attack(enemy);
      } else if (room.corridor.left && x - 1 === room.corridor.left.start.x && y === room.corridor.left.start.y) {
        this.position = {
          room: room.corridor.left.end.room,
          y: room.corridor.left.end.y,
          x: room.corridor.left.end.x - 1,
        };
        this.position.room.level.gameSession.logMessages.push(`Move to the next room`);
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else if (x > 0) {
        this.position.x--;
        this.position.room.level.gameSession.logMessages.push(`Move left`);
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else {
        this.position.room.level.gameSession.logMessages.push(`Can't move further`);
      }
    }
  }

  attack(enemy) {
    const isHit = getProbabilityResult(this.dex / 4);
    if (isHit) {
      const damage = this.str + this.weapon.strengthUp;
      enemy.hp -= damage;
      this.position.room.level.gameSession.logMessages.push(`Attack ${enemy.type} for ${damage} hp`);
    } else {
      this.position.room.level.gameSession.logMessages.push(`You missed`);
      this.position.room.level.gameSession.statistics.hitMissed++;
    }
  }

  pickItemIfAvailable() {
    const index = this.position.room.level.items.findIndex((item) => isSamePosition(item, this));
    if (index > -1) {
      const item = this.position.room.level.items[index];

      let isPut;
      if (item.subtype === 'gold') {
        this.gold += item.cost;
        isPut = true;
      } else {
        isPut = this.backpack.putItem(item);
      }

      if (isPut) {
        this.position.room.level.items.splice(index, 1);
        this.position.room.level.gameSession.logMessages.push(`Pick up ${item.type} ${item.subtype}${item.subtype === 'gold' ? ` ${item.cost}` : ''}`);
      } else {
        this.position.room.level.gameSession.logMessages.push(`Can't pick up ${item.type} ${item.subtype}. Backpack is full`);
      }
    }
  }

  useItem(item) {
    if (item.type === 'food') {
      this.hp = this.hp + item.healthUp > this.maxHp ? this.maxHp : this.hp + item.healthUp;
      this.position.room.level.gameSession.logMessages.push(`Eat ${item.subtype}, restored ${item.healthUp} HP`);
      this.position.room.level.gameSession.statistics.foodEaten++;
    } else if (item.type === 'weapon') {
      this.dropItem(this.weapon);
      this.weapon = item;
    } else if (item.type === 'treasure') {
      this.dropItem(item);
    } else if (item.type === 'elixir') {
      if (item.subtype === 'dex') {
        this.dex += item.dexterityUp;
        this.position.room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.dexterityUp}`);
        this.position.room.level.gameSession.statistics.elixirsDrunk++;
      }
      if (item.subtype === 'str') {
        this.str += item.strengthUp;
        this.position.room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.strengthUp}`);
        this.position.room.level.gameSession.statistics.elixirsDrunk++;
      }
      if (item.subtype === 'hp') {
        this.maxHp += item.maxHealthUp;
        this.position.room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.maxHealthUp}`);
        this.position.room.level.gameSession.statistics.elixirsDrunk++;
      }
    } else if (item.type === 'scroll') {
      if (item.subtype === 'dex') {
        this.dex += item.dexterityUp;
        this.position.room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.dexterityUp}`);
        this.position.room.level.gameSession.statistics.scrollsUsed++;
      }
      if (item.subtype === 'str') {
        this.str += item.strengthUp;
        this.position.room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.strengthUp}`);
        this.position.room.level.gameSession.statistics.scrollsUsed++;
      }
      if (item.subtype === 'hp') {
        this.maxHp += item.maxHealthUp;
        this.position.room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.healthUp}`);
        this.position.room.level.gameSession.statistics.scrollsUsed++;
      }
    }
  }

  dropItem(item) {
    const room = this.position.room;
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
