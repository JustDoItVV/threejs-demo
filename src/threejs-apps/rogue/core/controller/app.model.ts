/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameSession } from '../entities/entities';

export default class AppModel {
  gameSession: any = null;

  constructor(datalayer: any) {
    this.gameSession = new GameSession(datalayer);
  }

  useUserInput(input: any) {
    this.gameSession.useUserInput(input);
  }

  static from(json: any) {
    // @ts-expect-error -- tmp
    return Object.assign(new GameSession(), json);
  }
}
