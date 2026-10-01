import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { getLineCells, getWordFromCells } from '../utils/wordSearchGenerator';
import { DEFAULT_ANIMATION_PROFILE } from '../utils/animationProfiles';

// Distinct colors assigned to found words for easy visual identification
const FOUND_COLORS = [
  'bg-emerald-200 text-emerald-950 border-emerald-400',
  'bg-sky-200 text-sky-950 border-sky-400',
  'bg-amber-200 text-amber-950 border-amber-400',
  'bg-purple-200 text-purple-950 border-purple-400',
  'bg-rose-200 text-rose-950 border-rose-400',
  'bg-indigo-200 text-indigo-950 border-indigo-400',
  'bg-teal-200 text-teal-950 border-teal-400',
  'bg-orange-200 text-orange-950 border-orange-400',
];

export default function WordSearchBoard({
  grid,
  size,
  placedWords,
  foundWords,
  onWordFound,
  showAnswers,
  animationProfile = DEFAULT_ANIMATION_PROFILE
}) {
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [wrongCells, setWrongCells] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [recentFoundCells, setRecentFoundCells] = useState([]);

  const boardRef = useRef(null);
  const selectionStartRef = useRef(selectionStart);
  const selectionEndRef = useRef(selectionEnd);
  const isSelectingRef = useRef(isSelecting);

  useEffect(() => {
    selectionStartRef.current = selectionStart;
    selectionEndRef.current = selectionEnd;
    isSelectingRef.current = isSelecting;
  }, [selectionStart, selectionEnd, isSelecting]);

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

  const handlePointerDown = (e, r, c) => {
    if (e.button !== undefined && e.button !== 0) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    // Clear previous wrong error states immediately on new interaction
    if (wrongCells.length > 0) setWrongCells([]);
    if (isShaking) setIsShaking(false);

    setIsSelecting(true);
    setSelectionStart({ row: r, col: c });
    setSelectionEnd({ row: r, col: c });
  };

  const triggerParticleBurst = useCallback((cells) => {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    let centerX = boardRect.left + boardRect.width / 2;
    let centerY = boardRect.top + boardRect.height / 2;

    if (cells && cells.length > 0) {
      // Calculate center of target word cells relative to board
      const minRow = Math.min(...cells.map(c => c.row));
      const maxRow = Math.max(...cells.map(c => c.row));
      const minCol = Math.min(...cells.map(c => c.col));
      const maxCol = Math.max(...cells.map(c => c.col));

      const cellWidth = boardRect.width / size;
      const cellHeight = boardRect.height / size;

      centerX = boardRect.left + ((minCol + maxCol + 1) / 2) * cellWidth;
      centerY = boardRect.top + ((minRow + maxRow + 1) / 2) * cellHeight;
    }

    const originX = Math.max(0.05, Math.min(0.95, centerX / window.innerWidth));
    const originY = Math.max(0.05, Math.min(0.95, centerY / window.innerHeight));

    confetti({
      particleCount: animationProfile.particleAmount || 20,
      spread: 50,
      startVelocity: 18,
      origin: { x: originX, y: originY },
      colors: animationProfile.colors || ['#6366f1', '#10b981', '#f59e0b'],
      ticks: 80,
      gravity: 0.9,
      scalar: animationProfile.intensity === 'playful' ? 0.75 : 0.55,
      disableForReducedMotion: true
    });
  }, [animationProfile, size]);

  const handleSelectionEnd = useCallback(() => {
    const start = selectionStartRef.current;
    const end = selectionEndRef.current;
    const selecting = isSelectingRef.current;

    if (selecting && start && end) {
      const selectedLine = getLineCells(start, end);
      if (selectedLine && selectedLine.length > 0) {
        const selectedWord = getWordFromCells(grid, selectedLine);
        const reversedWord = selectedWord.split('').reverse().join('');

        const match = placedWords.find(
          pw => (pw.word === selectedWord || pw.word === reversedWord) && !foundWords.includes(pw.word)
        );

        if (match) {
          // Correct Word Feedback
          setRecentFoundCells(match.cells);
          triggerParticleBurst(match.cells);
          onWordFound(match.word);

          setTimeout(() => {
            setRecentFoundCells([]);
          }, 400);
        } else if (selectedLine.length >= 2) {
          // Wrong Word Feedback (non-punitive, brief shake & red/orange highlight)
          setWrongCells(selectedLine);
          setIsShaking(true);

          const shakeDuration = animationProfile.shakeDuration || 200;
          setTimeout(() => {
            setWrongCells([]);
            setIsShaking(false);
          }, shakeDuration);
        }
      }
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [grid, placedWords, foundWords, onWordFound, animationProfile, triggerParticleBurst]);

  useEffect(() => {
    if (!isSelecting) return;

    const handlePointerMove = (e) => {
      if (!isSelectingRef.current) return;
      if (e.cancelable) {
        e.preventDefault();
      }

      const element = document.elementFromPoint(e.clientX, e.clientY);
      const cellElement = element?.closest('[data-row]');
      if (cellElement && cellElement.dataset) {
        const r = parseInt(cellElement.dataset.row, 10);
        const c = parseInt(cellElement.dataset.col, 10);
        if (!isNaN(r) && !isNaN(c)) {
          setSelectionEnd(prev => (prev?.row === r && prev?.col === c) ? prev : { row: r, col: c });
        }
      }
    };

    const handlePointerUp = () => {
      handleSelectionEnd();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isSelecting, handleSelectionEnd]);

  // Calculate dynamic font size based on grid size
  const getCellFontSize = () => {
    if (size <= 8) return 'text-xl sm:text-2xl md:text-3xl font-black';
    if (size <= 10) return 'text-lg sm:text-xl md:text-2xl font-bold';
    if (size <= 12) return 'text-base sm:text-lg md:text-xl font-bold';
    return 'text-sm sm:text-base md:text-lg font-bold';
  };

  return (
    <div className="bg-white rounded-2xl p-1.5 sm:p-3 shadow-xs border border-slate-200/80 flex flex-col items-center justify-center w-full select-none touch-none max-h-full">
      <div
        ref={boardRef}
        className={`grid gap-1 select-none touch-none bg-slate-100 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-inner w-full aspect-square max-w-[min(100%,calc(100dvh-170px),580px)] lg:max-w-[min(100%,calc(100dvh-180px),620px)] ${
          isShaking ? 'animate-board-shake' : ''
        }`}
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          '--shake-intensity': `${animationProfile.shakeIntensity || 4}px`,
          '--shake-duration': `${animationProfile.shakeDuration || 200}ms`,
          '--pop-scale': `${animationProfile.popScale || 1.15}`
        }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const key = getCellKey(r, c);
            const isSelected = currentSelectionCells.some(cell => cell.row === r && cell.col === c);
            const isWrong = wrongCells.some(cell => cell.row === r && cell.col === c);
            const isRecentFound = recentFoundCells.some(cell => cell.row === r && cell.col === c);
            const foundColorIndex = cellFoundMap.get(key);
            const isFound = foundColorIndex !== undefined;
            const isAnswer = showAnswers && answerCellMap.has(key);

            let styleClass = "bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50";

            if (isWrong) {
              styleClass = "cell-wrong-error bg-rose-500 text-white border-rose-600 font-extrabold z-10 shadow-sm";
            } else if (isSelected) {
              styleClass = "bg-indigo-600 text-white font-extrabold shadow-md scale-105 border-indigo-700 z-10";
            } else if (isFound) {
              styleClass = `${FOUND_COLORS[foundColorIndex % FOUND_COLORS.length]} font-bold shadow-2xs`;
            } else if (isAnswer) {
              styleClass = "bg-amber-100 text-amber-900 border-amber-300 font-bold animate-pulse";
            }

            const animClass = isRecentFound ? 'animate-cell-pop animate-cell-glow z-20' : '';

            return (
              <div
                key={key}
                data-row={r}
                data-col={c}
                onPointerDown={(e) => handlePointerDown(e, r, c)}
                className={`w-full h-full aspect-square flex items-center justify-center rounded-md sm:rounded-xl font-mono cursor-pointer transition-all border select-none touch-none ${getCellFontSize()} ${styleClass} ${animClass}`}
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
