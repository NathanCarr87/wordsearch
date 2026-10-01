import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getDoc: vi.fn(),
    doc: vi.fn((db, collection, id) => ({ path: `${collection}/${id}` })),
    getFirestore: vi.fn(() => ({})),
  };
});

import { getDoc } from 'firebase/firestore';
import { getGradeCorpus, getAvailableGrades, clearCorpusCache } from '../firebase';

describe('Firebase Service & Corpus Data', () => {
  beforeEach(() => {
    clearCorpusCache();
    vi.clearAllMocks();
  });

  it('should list all available grades', () => {
    const grades = getAvailableGrades();
    expect(grades.length).toBe(7);
    expect(grades.some(g => g.key === 'kindergarten')).toBe(true);
    expect(grades.some(g => g.key === 'grade6')).toBe(true);
  });

  it('should retrieve grade corpus and filter out disabled words', async () => {
    const mockDocData = {
      label: 'Grade 1 Test',
      description: 'Test grade description',
      gridSize: 10,
      maxWords: 8,
      allowedDirections: ['horizontal', 'vertical'],
      words: [
        { word: 'APPLE', difficulty: 1, enabled: true },
        { word: 'BANANA', difficulty: 2, enabled: false },
        { word: 'CHERRY', difficulty: 1, enabled: true }
      ]
    };

    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockDocData
    });

    const result = await getGradeCorpus('grade1');
    expect(result.label).toBe('Grade 1 Test');
    expect(result.words).toEqual(['APPLE', 'CHERRY']);
    expect(result.words).not.toContain('BANANA');
    expect(result.gridSize).toBe(10);
    expect(result.maxWords).toBe(8);
    expect(result.source).toBe('firebase');
  });

  it('should cache retrieved corpus in memory', async () => {
    const mockDocData = {
      label: 'Kindergarten Test',
      description: 'Kindergarten desc',
      gridSize: 8,
      maxWords: 6,
      allowedDirections: ['horizontal'],
      words: [{ word: 'CAT', difficulty: 1, enabled: true }]
    };

    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => mockDocData
    });

    const firstCall = await getGradeCorpus('kindergarten');
    expect(firstCall.words).toEqual(['CAT']);
    expect(getDoc).toHaveBeenCalledTimes(1);

    // Second call should return cached result without hitting getDoc again
    const secondCall = await getGradeCorpus('kindergarten');
    expect(secondCall).toBe(firstCall);
    expect(getDoc).toHaveBeenCalledTimes(1);
  });

  it('should fall back to local corpus data when Firestore fails (offline / network error)', async () => {
    vi.mocked(getDoc).mockRejectedValueOnce(new Error('Failed to get document because the client is offline.'));

    const result = await getGradeCorpus('grade2');
    expect(result.grade).toBe('grade2');
    expect(result.source).toBe('local');
    expect(Array.isArray(result.words)).toBe(true);
    expect(result.words.length).toBeGreaterThan(0);
    expect(result.words).toContain('ANIMAL');
  });

  it('should fall back to local corpus data when Firestore document does not exist', async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => false,
      data: () => null
    });

    const result = await getGradeCorpus('grade3');
    expect(result.grade).toBe('grade3');
    expect(result.source).toBe('local');
    expect(result.words).toContain('BUTTERFLY');
  });
});
