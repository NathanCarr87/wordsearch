import { describe, it, expect } from 'vitest';
import { generateWordSearch, getLineCells, getWordFromCells } from '../utils/wordSearchGenerator';

describe('Word Search Generator Algorithm', () => {
  const sampleWords = ['CAT', 'DOG', 'APPLE', 'BANANA', 'ELEPHANT'];

  it('should generate a grid of requested size', () => {
    const size = 10;
    const result = generateWordSearch(sampleWords, size, ['horizontal', 'vertical'], 5);
    expect(result.grid.length).toBe(size);
    expect(result.grid[0].length).toBe(size);
  });

  it('should place words into grid successfully', () => {
    const result = generateWordSearch(['REACT', 'VITE'], 8, ['horizontal', 'vertical'], 2);
    expect(result.placedWords.length).toBeGreaterThan(0);

    for (const placed of result.placedWords) {
      const wordFromGrid = getWordFromCells(result.grid, placed.cells);
      expect(wordFromGrid).toBe(placed.word);
    }
  });

  it('should handle malformed word lists gracefully without throwing trim errors', () => {
    const malformed = [{ word: 'APPLE' }, null, undefined, 123, 'HOUSE', 'GARDEN'];
    const result = generateWordSearch(malformed, 10, ['horizontal', 'vertical'], 3);
    expect(result.grid.length).toBe(10);
    expect(result.placedWords.some(pw => pw.word === 'HOUSE' || pw.word === 'GARDEN')).toBe(true);
  });

  it('should return straight line cell path for horizontal, vertical, and diagonal lines', () => {
    // Horizontal line
    const horiz = getLineCells({ row: 1, col: 1 }, { row: 1, col: 4 });
    expect(horiz).toHaveLength(4);
    expect(horiz).toEqual([
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 1, col: 4 },
    ]);

    // Diagonal line
    const diag = getLineCells({ row: 0, col: 0 }, { row: 3, col: 3 });
    expect(diag).toHaveLength(4);

    // Invalid non-straight path
    const invalid = getLineCells({ row: 0, col: 0 }, { row: 2, col: 5 });
    expect(invalid).toBeNull();
  });
});
