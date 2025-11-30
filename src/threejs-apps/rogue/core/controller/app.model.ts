import Datalayer from '../../infrastructure/repositories/datalayer';
import { IDatalayer, IGameSessionEntity } from '../../types/entities';
import { GameSessionEntity } from '../entities/entities';

export default class AppModel {
  gameSession: IGameSessionEntity;

  constructor(datalayer: IDatalayer) {
    this.gameSession = new GameSessionEntity(datalayer);
  }

  useUserInput(input: string) {
    this.gameSession.useUserInput(input);
  }

  static from(json: string) {
    return Object.assign(new GameSessionEntity(new Datalayer()), json);
  }
}
