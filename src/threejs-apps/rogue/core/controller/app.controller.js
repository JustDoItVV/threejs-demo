import AppModel from './app.model.js';
import Datalayer from '../../infrastructure/repositories/datalayer.js';

export default class AppController {
  model = null;
  datalayer = null;

  constructor() {
    this.datalayer = new Datalayer();
    this.model = new AppModel(this.datalayer);
  }

  useUserInput(input) {
    this.model.useUserInput(input);
  }

  getEntitiesToRender() {
    return {
      rooms: this.model.gameSession.level.rooms,
      corridors: this.model.gameSession.level.corridors,
      character: this.model.gameSession.character,
      door: this.model.gameSession.level.door,
      enemies: this.model.gameSession.level.enemies,
      items: this.model.gameSession.level.items,
    };
  }

  getStatuses() {
    return {
      state: this.model.gameSession.state,
      win: this.model.gameSession.win,
      level: this.model.gameSession.level.level,
      door: this.model.gameSession.level.door,
      gameState: this.model.gameSession.state,
      character: {
        hp: this.model.gameSession.character.hp,
        maxHp: this.model.gameSession.character.maxHp,
        dex: this.model.gameSession.character.dex,
        str: this.model.gameSession.character.str,
        position: this.model.gameSession.character.position,
        weapon: this.model.gameSession.character.weapon.subtype,
        gold: this.model.gameSession.character.gold,
      },
      logMessages: this.model.gameSession.logMessages,
    }
  }

  saveGame() {
    this.datalayer.saveSession(this.model.gameSession);
  }

  loadGame() {
    const data = this.datalayer.loadSession();
    if (data) this.model.gameSession.applyData(data);
    return data;
  }
}
