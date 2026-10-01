import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WordList from '../components/WordList';

describe('WordList component', () => {
  const mockPlacedWords = [{ word: 'CAT' }, { word: 'DOG' }];
  const mockFoundWords = ['CAT'];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders word list and controls correctly', () => {
    render(
      <WordList
        placedWords={mockPlacedWords}
        foundWords={mockFoundWords}
        showAnswers={false}
        onToggleAnswers={() => {}}
        onResetProgress={() => {}}
        elapsedTime={65}
      />
    );

    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByText('1:05')).toBeInTheDocument();
    expect(screen.getByText('CAT')).toBeInTheDocument();
    expect(screen.getByText('DOG')).toBeInTheDocument();
    expect(screen.getByTitle('Print Puzzle')).toBeInTheDocument();
  });

  it('triggers window.print when Print Puzzle button is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <WordList
        placedWords={mockPlacedWords}
        foundWords={mockFoundWords}
        showAnswers={false}
        onToggleAnswers={() => {}}
        onResetProgress={() => {}}
        elapsedTime={0}
      />
    );

    const printBtn = screen.getByTitle('Print Puzzle');
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
  });
});
