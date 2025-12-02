import { GameSession, HighScoreEntry, SavedGameSession } from '../../types/game-types';

export interface IGameRepository {
  saveSession(session: GameSession): Promise<void>;
  loadSession(): Promise<SavedGameSession | null>;
  clearSession(): Promise<void>;

  saveHighScore(entry: HighScoreEntry): Promise<void>;
  loadHighScores(limit?: number): Promise<HighScoreEntry[]>;
  clearHighScores(): Promise<void>;

  hasSession(): Promise<boolean>;
}
