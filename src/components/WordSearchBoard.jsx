import React, { useState, useEffect, useRef } from 'react';
import { getLineCells, getWordFromCells } from '../utils/wordSearchGenerator';

// Distinct colors assigned to found words for easy visual identification
const FOUND_COLORS = [
  'bg-emerald-200 text-emerald-900 border-emerald-400',
  'bg-sky-200 text-sky-900 border-sky-400',
  'bg-amber-200 text-amber-900 border-amber-400',
  'bg-purple-200 text-purple-900 border-purple-400',
  'bg-rose-200 text-rose-900 border-rose-400',
  'bg-indigo-200 text-indigo-900 border-indigo-400',
  'bg-teal-200 text-teal-900 border-teal-400',
  'bg-orange-200 text-orange-900 border-orange-400',
];

export default function WordSearchBoard({
  grid,
  size,
  placedWords,
  foundWords,
  onWordFound,
  showAnswers
}) {
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const boardRef = useRef(null);

  // Map cell coordinates to found word indexes for highlighting
  const cellFoundMap = useFoundCellMap(placedWords, foundWords);
  const answerCellMap = useAnswerCellMap(placedWords);

  // Helper to construct key for cell
  const getCellKey = (r, c) => `${r}-${c}`;

  // Current selection line cells
  const currentSelectionCells = isSelecting && selectionStart && selectionEnd
    ? getLineCells(selectionStart, selectionEnd) || [selectionStart]
    : selectionStart
    ? [selectionStart]
    : [];

  const handleTouchStart = (r, c) => {
    setIsSelecting(true);
    setSelectionStart({ row: r, col: c });
    setSelectionEnd({ row: r, col: c });
  };

  const handleTouchMove = (e) => {
    if (!isSelecting) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset && element.dataset.row !== undefined) {
      const r = parseInt(element.dataset.row, 10);
      const c = parseInt(element.dataset.col, 10);
      setSelectionEnd({ row: r, col: c });
    }
  };

  const handleSelectionEnd = () => {
    if (!isSelecting || !selectionStart || !selectionEnd) {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    const selectedLine = getLineCells(selectionStart, selectionEnd);
    if (selectedLine) {
      const selectedWord = getWordFromCells(grid, selectedLine);
      const reversedWord = selectedWord.split('').reverse().join('');

      // Check if matches any placed word
      const match = placedWords.find(
        pw => (pw.word === selectedWord || pw.word === reversedWord) && !foundWords.includes(pw.word)
      );

      if (match) {
        onWordFound(match.word);
      }
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isSelecting) handleSelectionEnd();
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isSelecting, selectionStart, selectionEnd, grid, placedWords, foundWords]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col items-center justify-center">
      <div
        ref={boardRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleSelectionEnd}
        className="grid gap-1 select-none touch-none bg-slate-100 p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-inner max-w-full overflow-auto"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
        }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const key = getCellKey(r, c);
            const isSelected = currentSelectionCells.some(cell => cell.row === r && cell.col === c);
            const foundColorIndex = cellFoundMap.get(key);
            const isFound = foundColorIndex !== undefined;
            const isAnswer = showAnswers && answerCellMap.has(key);

            let styleClass = "bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50";

            if (isSelected) {
              styleClass = "bg-indigo-600 text-white font-extrabold shadow-md scale-105 border-indigo-700 z-10";
            } else if (isFound) {
              styleClass = `${FOUND_COLORS[foundColorIndex % FOUND_COLORS.length]} font-bold shadow-sm`;
            } else if (isAnswer) {
              styleClass = "bg-amber-100 text-amber-900 border-amber-300 font-bold animate-pulse";
            }

            return (
              <div
                key={key}
                data-row={r}
                data-col={c}
                onMouseDown={() => handleTouchStart(r, c)}
                onMouseEnter={() => isSelecting && setSelectionEnd({ row: r, col: c })}
                onTouchStart={() => handleTouchStart(r, c)}
                className={`w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-base font-mono cursor-pointer transition-all border ${styleClass}`}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Custom hook to index cells of found words
function useFoundCellMap(placedWords, foundWords) {
  const map = new Map();
  placedWords.forEach((pw, idx) => {
    if (foundWords.includes(pw.word)) {
      pw.cells.forEach(cell => {
        map.set(`${cell.row}-${cell.col}`, idx);
      });
    }
  });
  return map;
}

// Custom hook to index cells of all placed words for Answer Key
function useAnswerCellMap(placedWords) {
  const set = new Set();
  placedWords.forEach(pw => {
    pw.cells.forEach(cell => {
      set.add(`${cell.row}-${cell.col}`);
    });
  });
  return set;
}
