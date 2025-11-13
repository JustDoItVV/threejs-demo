/* eslint-disable @typescript-eslint/no-explicit-any */
import { CharacterStats } from '../../config/game.config';
import { getProbabilityResult, isSamePosition } from '../../utils/utils';
import { Backpack } from './backpack';
import { Item } from './item';

import type { Position } from '../../types/game-types';
import type { Enemy } from './enemy';

export class Character {
  maxHp: number;
  hp: number;
  dex: number;
  str: number;

  position: Position;
  backpack: Backpack;
  weapon: Item;
  gold: number;

  constructor() {
    // Temporary position - will be set properly when level is created
    this.position = {
      room: null as any,
      y: 0,
      x: 0,
    };
    this.backpack = new Backpack();
    this.maxHp = 0;
    this.hp = 0;
    this.dex = 0;
    this.str = 0;
    this.weapon = null as any;
    this.gold = 0;
    this.reset();
  }

  reset(): void {
    this.maxHp = CharacterStats.MaxHP;
    this.hp = CharacterStats.StartHP;
    this.dex = CharacterStats.Dex;
    this.str = CharacterStats.Str;
    this.backpack.items = [];
    this.weapon = new Item(this.position);
    this.weapon.setBySubtype('weapon', 'knife');
    this.gold = 0;
  }

  move(direction: 'up' | 'down' | 'left' | 'right'): void {
    const { room, y, x } = this.position;
    room.isSeen = true;

    if (direction === 'up') {
  // @ts-expect-error -- tmp
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
  // @ts-expect-error -- tmp
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y + 1 && enemy.position.x === x);
      if (enemy) {
        this.attack(enemy);
  // @ts-expect-error -- tmp
      } else if (room.corridor.up && y + 1 === room.corridor.up.start.y && x === room.corridor.up.start.x) {
        this.position = {
  // @ts-expect-error -- tmp
          room: room.corridor.up.end.room,
  // @ts-expect-error -- tmp
          y: room.corridor.up.end.y + 1,
  // @ts-expect-error -- tmp
          x: room.corridor.up.end.x,
        };
        this.position.room.isSeen = true; // Reveal fog of war immediately upon entering
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Move to the next room`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else if (y < room.sizeY - 1) {
        this.position.y++;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Move up`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else {
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'right') {
  // @ts-expect-error -- tmp
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
  // @ts-expect-error -- tmp
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x + 1);
      if (enemy) {
        this.attack(enemy);
  // @ts-expect-error -- tmp
      } else if (room.corridor.right && x + 1 === room.corridor.right.start.x && y === room.corridor.right.start.y) {
        this.position = {
  // @ts-expect-error -- tmp
          room: room.corridor.right.end.room,
  // @ts-expect-error -- tmp
          y: room.corridor.right.end.y,
  // @ts-expect-error -- tmp
          x: room.corridor.right.end.x + 1,
        };
        this.position.room.isSeen = true; // Reveal fog of war immediately upon entering
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Move to the next room`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else if (x < room.sizeX - 1) {
        this.position.x++;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Move right`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else {
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'down') {
  // @ts-expect-error -- tmp
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
  // @ts-expect-error -- tmp
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y - 1 && enemy.position.x === x);
      if (enemy) {
        this.attack(enemy);
  // @ts-expect-error -- tmp
      } else if (room.corridor.down && y - 1 === room.corridor.down.start.y && x === room.corridor.down.start.x) {
        this.position = {
  // @ts-expect-error -- tmp
          room: room.corridor.down.end.room,
  // @ts-expect-error -- tmp
          y: room.corridor.down.end.y - 1,
  // @ts-expect-error -- tmp
          x: room.corridor.down.end.x,
        };
        this.position.room.isSeen = true; // Reveal fog of war immediately upon entering
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Move to the next room`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else if (y > 0) {
        this.position.y--;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Move down`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else {
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Can't move further`);
      }

    } else if (direction === 'left') {
  // @ts-expect-error -- tmp
      let enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x);
  // @ts-expect-error -- tmp
      if (!enemy) enemy = room.level.enemies.find((enemy) => enemy.position.room === room && enemy.position.y === y && enemy.position.x === x - 1);
      if (enemy) {
        this.attack(enemy);
  // @ts-expect-error -- tmp
      } else if (room.corridor.left && x - 1 === room.corridor.left.start.x && y === room.corridor.left.start.y) {
        this.position = {
  // @ts-expect-error -- tmp
          room: room.corridor.left.end.room,
  // @ts-expect-error -- tmp
          y: room.corridor.left.end.y,
  // @ts-expect-error -- tmp
          x: room.corridor.left.end.x - 1,
        };
        this.position.room.isSeen = true; // Reveal fog of war immediately upon entering
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Move to the next room`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else if (x > 0) {
        this.position.x--;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Move left`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.travelledDistance++;
      } else {
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Can't move further`);
      }
    }
  }

  attack(enemy: Enemy): void {
    const isHit = getProbabilityResult(this.dex / 4);
    if (isHit) {
      const damage = this.str + (this.weapon.strengthUp || 0);
      enemy.hp -= damage;
  // @ts-expect-error -- tmp
      this.position.room.level.gameSession.logMessages.push(`Attack ${enemy.type} for ${damage} hp`);
    } else {
  // @ts-expect-error -- tmp
      this.position.room.level.gameSession.logMessages.push(`You missed`);
  // @ts-expect-error -- tmp
      this.position.room.level.gameSession.statistics.hitMissed++;
    }
  }

  pickItemIfAvailable(): void {
    // Find all items at character's position
  // @ts-expect-error -- tmp
    const itemsAtPosition = this.position.room.level.items.filter((item) => isSamePosition(item, this));

    if (itemsAtPosition.length === 0) {
      return;
    }

    let backpackFullEncountered = false;
  // @ts-expect-error -- tmp
    const pickedItems = [];

    // Try to pick up each item
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
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(
          `Pick up ${item.type} ${item.subtype}${item.subtype === 'gold' ? ` ${item.cost}` : ''}`
        );
      } else {
        backpackFullEncountered = true;
      }
    }

    // Remove picked items from level.items
  // @ts-expect-error -- tmp
    this.position.room.level.items = this.position.room.level.items.filter(
  // @ts-expect-error -- tmp
      (item) => !pickedItems.includes(item)
    );

    // Show backpack full message once if any item couldn't be picked
    if (backpackFullEncountered) {
  // @ts-expect-error -- tmp
      this.position.room.level.gameSession.logMessages.push(`Backpack is full. Some items left behind.`);
    }
  }

  useItem(item: Item): void {
    if (item.type === 'food') {
      this.hp = this.hp + (item.healthUp || 0) > this.maxHp ? this.maxHp : this.hp + (item.healthUp || 0);
  // @ts-expect-error -- tmp
      this.position.room.level.gameSession.logMessages.push(`Eat ${item.subtype}, restored ${item.healthUp} HP`);
  // @ts-expect-error -- tmp
      this.position.room.level.gameSession.statistics.foodEaten++;
    } else if (item.type === 'weapon') {
      this.dropItem(this.weapon);
      this.weapon = item;
    } else if (item.type === 'treasure') {
      this.dropItem(item);
    } else if (item.type === 'elixir') {
      if (item.subtype === 'dex' && item.dexterityUp) {
        this.dex += item.dexterityUp;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.dexterityUp}`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.elixirsDrunk++;
      }
      if (item.subtype === 'str' && item.strengthUp) {
        this.str += item.strengthUp;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.strengthUp}`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.elixirsDrunk++;
      }
      if (item.subtype === 'hp' && item.maxHealthUp) {
        this.maxHp += item.maxHealthUp;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Use elixir ${item.subtype}, temporarily stat up by ${item.maxHealthUp}`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.elixirsDrunk++;
      }
    } else if (item.type === 'scroll') {
      if (item.subtype === 'dex' && item.dexterityUp) {
        this.dex += item.dexterityUp;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.dexterityUp}`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.scrollsUsed++;
      }
      if (item.subtype === 'str' && item.strengthUp) {
        this.str += item.strengthUp;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.strengthUp}`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.scrollsUsed++;
      }
      if (item.subtype === 'hp' && item.maxHealthUp) {
        this.maxHp += item.maxHealthUp;
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.logMessages.push(`Use scroll ${item.subtype}, stat up by ${item.healthUp}`);
  // @ts-expect-error -- tmp
        this.position.room.level.gameSession.statistics.scrollsUsed++;
      }
    }
  }

  dropItem(item: Item): void {
    const room = this.position.room;
  // @ts-expect-error -- tmp
    const door = room.level.door;
    item.position = { ...this.position };

    item.position.y -= 1;
    if (!isSamePosition(door, item)) {
  // @ts-expect-error -- tmp
      room.level.items.push(item);
      return;
    }

    item.position.y += 2;
    if (!isSamePosition(door, item)) {
  // @ts-expect-error -- tmp
      room.level.items.push(item);
      return;
    }

    item.position.y -= 1;
    item.position.x -= 1;
    if (!isSamePosition(door, item)) {
  // @ts-expect-error -- tmp
      room.level.items.push(item);
      return;
    }

    item.position.x += 2;
    if (!isSamePosition(door, item)) {
  // @ts-expect-error -- tmp
      room.level.items.push(item);
      return;
    }
  }
}
