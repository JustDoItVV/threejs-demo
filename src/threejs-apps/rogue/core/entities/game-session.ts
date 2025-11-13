/* eslint-disable @typescript-eslint/no-explicit-any */
import { MAX_LEVEL } from '../../config/game.config';
import { Character } from './character';
import { Level } from './level';

import type { GameState } from '../../types/game-types';
import type { Item } from './item';
import type Datalayer from '../../infrastructure/repositories/datalayer';

interface GameStatistics {
  enemiesKilled: number;
  foodEaten: number;
  elixirsDrunk: number;
  scrollsUsed: number;
  hitMissed: number;
  travelledDistance: number;
  itemsDropped?: number;
}

export class GameSession {
  datalayer: Datalayer;
  state: GameState;
  level: Level;
  character: Character;
  win: boolean | null;
  logMessages: string[];
  backpackItems: Item[] | null;
  statistics: GameStatistics;

  constructor(datalayer: Datalayer) {
    this.datalayer = datalayer;
    this.state = 'start';
    this.level = null as any;
    this.character = null as any;
    this.win = null;
    this.logMessages = [];
    this.backpackItems = null;
    this.statistics = {
      enemiesKilled: 0,
      foodEaten: 0,
      elixirsDrunk: 0,
      scrollsUsed: 0,
      hitMissed: 0,
      travelledDistance: 0,
    };
    this.init();
  }

  init(): void {
    this.character = new Character();
    this.level = new Level(this, this.character);
    this.state = 'start';
    this.logMessages = [];
    this.statistics = {
      enemiesKilled: 0,
      foodEaten: 0,
      elixirsDrunk: 0,
      scrollsUsed: 0,
      hitMissed: 0,
      travelledDistance: 0,
    };
  }

  reset(): void {
    this.win = null;
    this.level.level = 1;
    this.character.reset();
    this.logMessages = [];
  }

  startGame(): void {
    this.reset();
    this.level.create();
    this.state = 'game';
    this.logMessages = ['Game started'];
  }

  start(): void {
    this.startGame();
  }

  restart(): void {
    this.state = 'start';
    this.win = null;
    this.logMessages = [];
  }

  makeTurn(input: string): void {
    this.logMessages = [];

    const charPosition = this.character?.position;
    const doorPosition = this.level.door?.position;

    if (this.character.hp <= 0) {
      this.endGame(false, 'Gameover! You lose!');
      return;
    }

  // @ts-expect-error -- tmp
    this.character.move(input);
    this.level.enemies = this.level.enemies.filter((enemy) => {
      if (enemy.hp <= 0) {
        enemy.dropGold();
        this.statistics.enemiesKilled++;
      }
      return enemy.hp > 0;
    });
    this.level.enemies.forEach((enemy) => enemy.makeTurn());

    this.character.pickItemIfAvailable();

    if (charPosition?.room === doorPosition?.room && charPosition?.y === doorPosition?.y && charPosition?.x === doorPosition?.x) {
      if (this.level.level === MAX_LEVEL) {
        this.endGame(true, 'Congratulations! You win!');
        return;
      }

      this.level.level++;
      this.level.create();
      this.logMessages = [`Go to level ${this.level.level}`];
    }
  }

  endGame(win: boolean, message: string): void {
    this.win = win;
    this.state = 'end';
    this.logMessages = [message];
    this.datalayer.saveHighscore([
      this.character.gold,
      this.level.level,
      this.statistics.enemiesKilled,
      this.statistics.foodEaten,
      this.statistics.elixirsDrunk,
      this.statistics.scrollsUsed,
      this.statistics.hitMissed,
      this.statistics.travelledDistance,
      new Date(),
    ]);
  }

  useBackpack(input: string): void {
    if (this.state === 'game') {
      let type: string | undefined;
      if (input === 'h') type = 'weapon';
      if (input === 'j') type = 'food';
      if (input === 'k') type = 'elixir';
      if (input === 'e') type = 'scroll';
      if (input === 'b') type = 'any';

  // @ts-expect-error -- tmp
      const backpackItems = this.character.backpack.showItems(type);

      if (backpackItems.length > 0) {
  // @ts-expect-error -- tmp
        this.backpackItems = backpackItems;
        this.logMessages = ['Choose item:'];
        backpackItems.forEach((item, index) => { this.logMessages.push(`${index + 1} - ${item.type} ${item.subtype}`) });
        this.state = 'backpack';
      } else {
        this.logMessages = [`No such items of type ${type} in backpack`];
      }
    } else if (this.state === 'backpack') {
      const index = Number(input) - 1;
      const item = this.character.backpack.getItem(index);
      if (item) {
  // @ts-expect-error -- tmp
        this.character.useItem(item);
        this.state = 'game';
      } else {
        this.logMessages = [`Wrong input`];
      }
    }
  }

  dropBackpackItem(input: string): void {
    const index = Number(input) - 1;
    const item = this.character.backpack.removeItem(index);
    if (item) {
  // @ts-expect-error -- tmp
      this.character.dropItem(item);
      this.logMessages = [`Dropped ${item.type} ${item.subtype}`];
      this.statistics.itemsDropped = (this.statistics.itemsDropped || 0) + 1;
    } else {
      this.logMessages = [`Wrong input`];
    }
  }

  useUserInput(input: string): void {
    if (this.state === 'start') {
      if (input === 'enter')
        this.startGame()

    } else if (this.state === 'game') {
      if (['up', 'right', 'down', 'left'].includes(input)) {
        this.makeTurn(input);
      }
      if (['h', 'j', 'k', 'i', 'b'].includes(input)) {
        this.useBackpack(input);
      }

    } else if (this.state === 'backpack') {
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(input)) {
        this.useBackpack(input);
      } else if (input.startsWith('d') && /^d[1-9]$/.test(input)) {
        // Handle drop command: d1, d2, etc.
        this.dropBackpackItem(input.slice(1));
      }

    } else if (this.state === 'end') {
      if (input === 'enter')
        this.startGame()
    }
  }

  applyData(json: Partial<GameSession>): void {
    Object.assign(this, json);
  }
}
