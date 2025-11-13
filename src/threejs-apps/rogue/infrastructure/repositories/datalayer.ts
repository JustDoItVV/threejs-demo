export default class Datalayer {
  STORAGE_PREFIX = 'rogue_game_';
  SESSION_KEY = 'session';
  HIGHSCORE_KEY = 'highscores';

  constructor() {
    // Browser-based storage initialization
  }

  // @ts-expect-error -- tmp
  saveSession(gameSession) {
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

  // @ts-expect-error -- tmp
  saveHighscore(data) {
    const highscores = this.loadHighscore();

    try {
      highscores.push(data);
  // @ts-expect-error -- tmp
      highscores.sort((a, b) => b[0] - a[0]);

      localStorage.setItem(
        this.STORAGE_PREFIX + this.HIGHSCORE_KEY,
        JSON.stringify(highscores)
      );
    } catch (err) {
      console.error('Failed to save highscore:', err);
    }
  }

  loadHighscore() {
    let data;

    try {
      const highscoreData = localStorage.getItem(this.STORAGE_PREFIX + this.HIGHSCORE_KEY);
      if (highscoreData) {
        data = JSON.parse(highscoreData);
  // @ts-expect-error -- tmp
        data.sort((a, b) => b[0] - a[0]);
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
