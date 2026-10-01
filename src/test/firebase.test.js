import { describe, it, expect } from 'vitest';
import { getGradeCorpus, getAvailableGrades } from '../firebase';
import { GRADE_CORPUS } from '../data/wordCorpus';

describe('Firebase Service & Corpus Data', () => {
  it('should list all available grades', () => {
    const grades = getAvailableGrades();
    expect(grades.length).toBeGreaterThan(0);
    expect(grades.some(g => g.key === 'kindergarten')).toBe(true);
    expect(grades.some(g => g.key === 'grade6')).toBe(true);
  });

  it('should retrieve grade corpus with words and properties', async () => {
    const kindergarten = await getGradeCorpus('kindergarten');
    expect(kindergarten.label).toBe('Kindergarten');
    expect(kindergarten.words.length).toBeGreaterThan(0);
    expect(kindergarten.gridSize).toBe(8);

    const grade3 = await getGradeCorpus('grade3');
    expect(grade3.label).toBe('Grade 3');
    expect(grade3.words.length).toBeGreaterThan(0);
  });

  it('should fallback gracefully for unknown grade', async () => {
    const fallback = await getGradeCorpus('nonexistent_grade');
    expect(fallback.grade).toBe('nonexistent_grade');
    expect(fallback.label).toBe('Grade 1');
  });
});
