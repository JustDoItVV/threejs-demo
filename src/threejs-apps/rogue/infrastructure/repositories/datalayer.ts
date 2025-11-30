import { IDatalayer, IGameSessionEntity, IHighscore } from '../../types/entities';

export default class Datalayer implements IDatalayer {
  STORAGE_PREFIX = 'rogue_game_';
  SESSION_KEY = 'session';
  HIGHSCORE_KEY = 'highscores';

  constructor() {
    // Browser-based storage initialization
  }

  saveSession(gameSession: IGameSessionEntity) {
    try {
      // Convert gameSession to JSON (circular refs handled by custom serialization if needed)
      const sessionData = JSON.stringify(gameSession);
      localStorage.setItem(this.STORAGE_PREFIX + this.SESSION_KEY, sessionData);
    } catch (err) {
      console.error('Failed to save session:', err);
    }
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
