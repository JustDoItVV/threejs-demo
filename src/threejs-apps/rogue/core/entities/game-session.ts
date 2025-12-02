import { MAX_LEVEL } from '../../config/game.config';
import { IDatalayer, IGameSessionEntity, IGameStatisticsEntity } from '../../types/entities';
import { EGameState } from '../../types/game-types';
import { CharacterEntity } from './character';
import { LevelEntity } from './level';

import type { ItemEntity } from './item';

export class GameSessionEntity implements IGameSessionEntity {
  datalayer: IDatalayer;
  state: EGameState;
  level: LevelEntity;
  character: CharacterEntity;
  win: boolean | null;
  logMessages: string[];
  backpackItems: ItemEntity[] | null;
  statistics: IGameStatisticsEntity;

  constructor(datalayer: IDatalayer) {
    this.datalayer = datalayer;
    this.win = null;
    this.backpackItems = null;

    // Initialize all properties - character and level will be set in init()
    this.character = {} as CharacterEntity;
    this.level = {} as LevelEntity;
    this.state = EGameState.Start;
    this.logMessages = [];
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

  init() {
    this.character = new CharacterEntity();
    this.level = new LevelEntity(this, this.character);
    this.state = EGameState.Start;
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

  reset() {
    this.win = null;
    this.level.level = 1;
    this.character.reset();
    this.logMessages = [];
  }

  startGame() {
    this.reset();
    this.level.create();
    this.state = EGameState.Game;
    this.logMessages = ['Game started'];
  }

  start() {
    this.startGame();
  }

  restart() {
    this.state = EGameState.Start;
    this.win = null;
    this.logMessages = [];
  }

  makeTurn(input: string): void {
    this.logMessages = [];

    if (this.character.hp <= 0) {
      this.endGame(false, 'Gameover! You lose!');
      return;
    }

    // Only move if input is a valid direction
    if (input === 'up' || input === 'down' || input === 'left' || input === 'right') {
      this.character.move(input);
    }
    this.level.enemies = this.level.enemies.filter((enemy) => {
      if (enemy.hp <= 0) {
        enemy.dropGold();
        this.statistics.enemiesKilled++;
      }
      return enemy.hp > 0;
    });
    this.level.enemies.forEach((enemy) => enemy.makeTurn());

    this.character.pickItemIfAvailable();

    // Check door position AFTER character moves
    const charPosition = this.character?.position;
    const doorPosition = this.level.door?.position;

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

  getTotalScore(): number {
    return (
      this.character.gold +
      this.level.level * 10 +
      this.statistics.enemiesKilled * 5 +
      this.statistics.foodEaten +
      this.statistics.elixirsDrunk * 3 +
      this.statistics.scrollsUsed * 3 +
      this.statistics.travelledDistance
    );
  }

  endGame(win: boolean, message: string) {
    this.win = win;
    this.state = EGameState.End;
    this.logMessages = [message];
    const playerName = this.datalayer.loadPlayerName();
    this.datalayer.saveHighscore({
      score: this.getTotalScore(),
      date: new Date(),
      playerName: playerName || 'Player',
    });
  }

  useBackpack(input: string) {
    if (this.state === EGameState.Game) {
      let type: string | undefined;
      if (input === 'h') type = 'weapon';
      if (input === 'j') type = 'food';
      if (input === 'k') type = 'elixir';
      if (input === 'e') type = 'scroll';
      if (input === 'b') type = 'any';

      const backpackItems = this.character.backpack.showItems(type ?? '');

      if (backpackItems.length > 0) {
        this.backpackItems = backpackItems;
        this.logMessages = ['Choose item:'];
        backpackItems.forEach((item, index) => { this.logMessages.push(`${index + 1} - ${item.type} ${item.subtype}`) });
        this.state = EGameState.Backpack;
      } else {
        this.logMessages = [`No such items of type ${type} in backpack`];
      }
    } else if (this.state === 'backpack') {
      const index = Number(input) - 1;
      const item = this.character.backpack.getItem(index);
      if (item) {
        this.character.useItem(item);
        this.logMessages.push('Item used');
      } else {
        this.logMessages = [`Wrong input`];
      }
    }
  }

  dropBackpackItem(input: string) {
    if (this.state !== EGameState.Backpack) return;

    const index = Number(input) - 1;
    const item = this.character.backpack.getItem(index);
    if (item) {
      this.character.dropItem(item);
      this.logMessages = [`Dropped ${item.type} ${item.subtype}`];
      this.statistics.itemsDropped = (this.statistics.itemsDropped || 0) + 1;
    } else {
      this.logMessages = [`Wrong input`];
    }
  }

  useUserInput(input: string) {
    if (this.state === EGameState.Start) {
      if (input === 'enter')
        this.startGame()

    } else if (this.state === EGameState.Game) {
      if (['up', 'right', 'down', 'left'].includes(input)) {
        this.makeTurn(input);
      }
      if (['h', 'j', 'k', 'i', 'b'].includes(input)) {
        this.useBackpack(input);
      }

    } else if (this.state === EGameState.Backpack) {
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(input)) {
        this.useBackpack(input);
      } else if (input.startsWith('d') && /^d[1-9]$/.test(input)) {
        // Handle drop command: d1, d2, etc.
        this.dropBackpackItem(input.slice(1));
      }

    } else if (this.state === EGameState.End) {
      if (input === 'enter')
        this.startGame()
    }
  }

  applyData(json: Partial<GameSessionEntity>) {
    Object.assign(this, json);
  }
}
