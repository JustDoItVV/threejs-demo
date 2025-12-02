import {
  IDatalayer,
  IEnemyEntity,
  IGameSessionEntity,
  IHighscore,
  IItemEntity,
  IPosition,
  IRoomEntity,
} from '../../types/entities';

export default class Datalayer implements IDatalayer {
  STORAGE_PREFIX = 'rogue_game_';
  SESSION_KEY = 'session';
  HIGHSCORE_KEY = 'highscores';
  PLAYER_NAME_KEY = 'player_name';

  constructor() {}

  savePlayerName(name: string) {
    try {
      localStorage.setItem(this.STORAGE_PREFIX + this.PLAYER_NAME_KEY, name);
    } catch (err) {
      console.error('Failed to save player name:', err);
    }
  }

  loadPlayerName(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_PREFIX + this.PLAYER_NAME_KEY);
    } catch (err) {
      console.error('Failed to load player name:', err);
      return null;
    }
  }

  saveSession(gameSession: IGameSessionEntity) {
    try {
      const serializableData = this.serializeGameSession(gameSession);
      const sessionData = JSON.stringify(serializableData);
      localStorage.setItem(this.STORAGE_PREFIX + this.SESSION_KEY, sessionData);
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  }

  private serializeGameSession(gameSession: IGameSessionEntity) {
    const serializePosition = (pos: IPosition) => ({
      x: pos.x,
      y: pos.y,
      z: pos.z,
      roomId: pos.room?.id ?? null,
    });

    const serializeItem = (item: IItemEntity) => ({
      type: item.type,
      subtype: item.subtype,
      healthUp: item.healthUp,
      maxHealthUp: item.maxHealthUp,
      dexterityUp: item.dexterityUp,
      strengthUp: item.strengthUp,
      cost: item.cost,
      position: serializePosition(item.position),
      isDoor: item.isDoor,
      name: item.name,
    });

    const serializeEnemy = (enemy: IEnemyEntity) => ({
      type: enemy.type,
      subtype: enemy.subtype,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      dex: enemy.dex,
      str: enemy.str,
      hostility: enemy.hostility,
      movement: enemy.movement,
      position: serializePosition(enemy.position),
      sawCharacter: enemy.sawCharacter,
      weapon: enemy.weapon,
    });

    return {
      state: gameSession.state,
      win: gameSession.win,
      logMessages: gameSession.logMessages,
      backpackItems: gameSession.backpackItems?.map(serializeItem) ?? null,
      statistics: gameSession.statistics,
      character: {
        maxHp: gameSession.character.maxHp,
        hp: gameSession.character.hp,
        dex: gameSession.character.dex,
        str: gameSession.character.str,
        position: serializePosition(gameSession.character.position),
        weapon: serializeItem(gameSession.character.weapon),
        gold: gameSession.character.gold,
        backpack: {
          items: gameSession.character.backpack.items.map(serializeItem),
          size: gameSession.character.backpack.size,
          filter: gameSession.character.backpack.filter,
        },
      },
      level: {
        level: gameSession.level.level,
        rooms: gameSession.level.rooms.map((room: IRoomEntity) => ({
          id: room.id,
          number: room.number,
          sizeY: room.sizeY,
          sizeX: room.sizeX,
          posY: room.posY,
          posX: room.posX,
          fieldY: room.fieldY,
          fieldX: room.fieldX,
          isSeen: room.isSeen,
          isVisited: room.isVisited,
          corridor: {
            up: room.corridor.up?.start.room.id === room.id ? {
              startRoomId: room.corridor.up.start.room.id,
              endRoomId: room.corridor.up.end.room.id,
              start: { x: room.corridor.up.start.x, y: room.corridor.up.start.y },
              end: { x: room.corridor.up.end.x, y: room.corridor.up.end.y },
              segments: room.corridor.up.segments,
            } : null,
            down: room.corridor.down?.start.room.id === room.id ? {
              startRoomId: room.corridor.down.start.room.id,
              endRoomId: room.corridor.down.end.room.id,
              start: { x: room.corridor.down.start.x, y: room.corridor.down.start.y },
              end: { x: room.corridor.down.end.x, y: room.corridor.down.end.y },
              segments: room.corridor.down.segments,
            } : null,
            left: room.corridor.left?.start.room.id === room.id ? {
              startRoomId: room.corridor.left.start.room.id,
              endRoomId: room.corridor.left.end.room.id,
              start: { x: room.corridor.left.start.x, y: room.corridor.left.start.y },
              end: { x: room.corridor.left.end.x, y: room.corridor.left.end.y },
              segments: room.corridor.left.segments,
            } : null,
            right: room.corridor.right?.start.room.id === room.id ? {
              startRoomId: room.corridor.right.start.room.id,
              endRoomId: room.corridor.right.end.room.id,
              start: { x: room.corridor.right.start.x, y: room.corridor.right.start.y },
              end: { x: room.corridor.right.end.x, y: room.corridor.right.end.y },
              segments: room.corridor.right.segments,
            } : null,
          },
        })),
        door: gameSession.level.door ? serializeItem(gameSession.level.door) : null,
        items: gameSession.level.items.map(serializeItem),
        enemies: gameSession.level.enemies.map(serializeEnemy),
      },
    };
  }

  loadSession() {
    let data;

    try {
      const sessionData = localStorage.getItem(this.STORAGE_PREFIX + this.SESSION_KEY);
      if (sessionData) {
        data = JSON.parse(sessionData);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    }

    return data;
  }

  saveHighscore(data: IHighscore) {
    const highscores = this.loadHighscore();

    try {
      highscores.push(data);
      highscores.sort((a, b) => b.score - a.score);

      localStorage.setItem(
        this.STORAGE_PREFIX + this.HIGHSCORE_KEY,
        JSON.stringify(highscores)
      );
    } catch (err) {
      console.error('Failed to save highscore:', err);
    }
  }

  loadHighscore() {
    let data: IHighscore[];

    try {
      const highscoreData = localStorage.getItem(this.STORAGE_PREFIX + this.HIGHSCORE_KEY);
      if (highscoreData) {
        data = JSON.parse(highscoreData);
        data.sort((a, b) => b.score - a.score);
      } else {
        data = [];
      }
    } catch (err) {
      console.error('Failed to load highscore:', err);
      data = [];
    }

    return data;
  }

  clearSession() {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + this.SESSION_KEY);
    } catch (err) {
      console.error('Failed to clear session:', err);
    }
  }

  clearHighscores() {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + this.HIGHSCORE_KEY);
    } catch (err) {
      console.error('Failed to clear highscores:', err);
    }
  }
}
