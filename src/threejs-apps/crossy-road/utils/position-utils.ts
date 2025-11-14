import type { Direction, Position, RowData } from '../types';
import { MIN_TILE_INDEX, MAX_TILE_INDEX, MAP_METADATA } from './constants';

/**
 * Calculate final position after applying a series of moves
 */
export function calculateFinalPosition(currentPosition: Position, moves: Direction[]): Position {
  return moves.reduce((position, direction) => {
    if (direction === 'forward') {
      return {
        rowIndex: position.currentRow + 1,
        tileIndex: position.currentTile,
      };
    }
    if (direction === 'backward') {
      return {
        rowIndex: position.currentRow - 1,
        tileIndex: position.currentTile,
      };
    }
    if (direction === 'left') {
      return {
        rowIndex: position.currentRow,
        tileIndex: position.currentTile - 1,
      };
    }
    if (direction === 'right') {
      return {
        rowIndex: position.currentRow,
        tileIndex: position.currentTile + 1,
      };
    }
    return position;
  }, currentPosition);
}

/**
 * Check if a position is valid (not out of bounds or colliding with trees)
 */
export function isValidPosition(
  currentPosition: Position,
  moves: Direction[],
  rows: RowData[]
): boolean {
  const finalPosition = calculateFinalPosition(currentPosition, moves);

  // Check if moving out of bounds
  if (
    finalPosition.currentRow === -1 ||
    finalPosition.currentTile === MIN_TILE_INDEX - 1 ||
    finalPosition.currentTile === MAX_TILE_INDEX + 1
  ) {
    return false;
  }

  // Check if colliding with trees
  const finalRow = rows[finalPosition.currentRow - 1];
  if (
    finalRow &&
    finalRow.type === 'forest' &&
    finalRow.trees.some((tree) => tree.tileIndex === finalPosition.currentTile)
  ) {
    return false;
  }

  return true;
}
