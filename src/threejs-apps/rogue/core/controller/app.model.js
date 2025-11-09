import { GameSession } from '../entities/entities.js';

export default class AppModel {
  gameSession = null;

  constructor(datalayer) {
    this.gameSession = new GameSession(datalayer);
  }

  useUserInput(input) {
    this.gameSession.useUserInput(input);
  }

  static from(json){
    return Object.assign(new GameSession(), json);
  }
}
