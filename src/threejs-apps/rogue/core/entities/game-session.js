import { MAX_LEVEL } from '../constants/app.const.js';
import { Character } from './character.js';
import { Level } from './level.js';

export class GameSession {
  datalayer = null;
  state = null;
  level = null;
  character = null;
  win = null;
  logMessages = null;
  backpackItems = null;
  statistics = null;

  constructor(datalayer) {
    this.datalayer = datalayer;
    this.init();
  }

  init() {
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

  reset() {
    this.win = null;
    this.level.level = 1;
    this.character.reset();
    this.logMessages = [];
  }

  startGame() {
    this.reset();
    this.level.create();
    this.state = 'game';
    this.logMessages = ['Game started'];
  }

  start() {
    this.startGame();
  }

  restart() {
    this.state = 'start';
    this.win = null;
    this.logMessages = [];
  }

  makeTurn(input) {
    this.logMessages = [];

    const charPosition = this.character?.position;
    const doorPosition = this.level.door?.position;

    if (this.character.hp <= 0) {
      this.endGame(false, 'Gameover! You lose!');
      return;
    }

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

  endGame(win, message) {
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

  useBackpack(input) {
    if (this.state === 'game') {
      let type;
      if (input === 'h') type = 'weapon';
      if (input === 'j') type = 'food';
      if (input === 'k') type = 'elixir';
      if (input === 'e') type = 'scroll';
      if (input === 'b') type = 'any';

      const backpackItems = this.character.backpack.showItems(type);

      if (backpackItems.length > 0) {
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
        this.character.useItem(item);
        this.state = 'game';
      } else {
        this.logMessages = [`Wrong input`];
      }
    }
  }

  useUserInput(input) {
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
      }

    } else if (this.state === 'end') {
      if (input === 'enter')
        this.startGame()
    }
  }

  applyData(json) {
    Object.assign(this, json);
  }
}
