import { GameSession, HighScoreEntry, SavedGameSession } from '../../core/types/game-types';
import { IGameRepository } from './i-game-repository';

const STORAGE_PREFIX = 'rogue_game_';
const SESSION_KEY = `${STORAGE_PREFIX}session`;
const HIGH_SCORES_KEY = `${STORAGE_PREFIX}high_scores`;

export class LocalStorageRepository implements IGameRepository {
  async saveSession(session: GameSession): Promise<void> {
    if (typeof window === 'undefined') return;

    const savedSession: SavedGameSession = {
      timestamp: Date.now(),
      session,
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(savedSession));
    } catch (error) {
      console.error('[LocalStorageRepository] Failed to save session:', error);
      throw error;
    }
  }

  async loadSession(): Promise<SavedGameSession | null> {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;

      return JSON.parse(data) as SavedGameSession;
    } catch (error) {
      console.error('[LocalStorageRepository] Failed to load session:', error);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('[LocalStorageRepository] Failed to clear session:', error);
    }
  }

  async saveHighScore(entry: HighScoreEntry): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const existing = await this.loadHighScores();
      const updated = [...existing, entry].sort((a, b) => b.score - a.score).slice(0, 10);

      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[LocalStorageRepository] Failed to save high score:', error);
    }
  }

  async loadHighScores(limit: number = 10): Promise<HighScoreEntry[]> {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(HIGH_SCORES_KEY);
      if (!data) return [];

      const scores = JSON.parse(data) as HighScoreEntry[];
      return scores.slice(0, limit);
    } catch (error) {
      console.error('[LocalStorageRepository] Failed to load high scores:', error);
      return [];
    }
  }

  async clearHighScores(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(HIGH_SCORES_KEY);
    } catch (error) {
      console.error('[LocalStorageRepository] Failed to clear high scores:', error);
    }
  }

  async hasSession(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data !== null;
    } catch (error) {
      return false;
    }
  }
}
