import { GameSession, HighScoreEntry, SavedGameSession } from '../../core/types/game-types';

/**
 * Repository interface for game persistence
 * Allows switching between LocalStorage, IndexedDB, or WASM SQLite
 */
export interface IGameRepository {
  // Session management
  saveSession(session: GameSession): Promise<void>;
  loadSession(): Promise<SavedGameSession | null>;
  clearSession(): Promise<void>;

  // High scores
  saveHighScore(entry: HighScoreEntry): Promise<void>;
  loadHighScores(limit?: number): Promise<HighScoreEntry[]>;
  clearHighScores(): Promise<void>;

  // Utility
  hasSession(): Promise<boolean>;
}
