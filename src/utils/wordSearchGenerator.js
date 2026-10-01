// Word Search Generator and Logic Utilities

export const DIRECTIONS_MAP = {
  'horizontal': { dr: 0, dc: 1, name: 'Horizontal' },
  'vertical': { dr: 1, dc: 0, name: 'Vertical' },
  'diagonal-down': { dr: 1, dc: 1, name: 'Diagonal Down' },
  'diagonal-up': { dr: -1, dc: 1, name: 'Diagonal Up' },
  'reverse-horizontal': { dr: 0, dc: -1, name: 'Reverse Horizontal' },
  'reverse-vertical': { dr: -1, dc: 0, name: 'Reverse Vertical' },
  'reverse-diagonal-down': { dr: -1, dc: -1, name: 'Reverse Diagonal Down' },
  'reverse-diagonal-up': { dr: 1, dc: -1, name: 'Reverse Diagonal Up' },
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Shuffles an array in place (Fisher-Yates)
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a word search puzzle grid.
 *
 * @param {Array<string>} wordList - List of words to place.
 * @param {number} size - Grid dimension (size x size).
 * @param {Array<string>} allowedDirections - List of direction keys allowed.
 * @param {number} maxWords - Maximum number of words to select and place.
 */
export function generateWordSearch(wordList, size = 10, allowedDirections = ['horizontal', 'vertical', 'diagonal-down'], maxWords = 8) {
  // Normalize and filter words safely
  const cleanWords = (Array.isArray(wordList) ? wordList : [])
    .filter(w => typeof w === 'string')
    .map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
    .filter(w => w.length > 1 && w.length <= size);

  // Pick candidate words
  const shuffledCandidates = shuffle(cleanWords);
  const selectedWords = shuffledCandidates.slice(0, Math.min(maxWords, shuffledCandidates.length));

  // Initialize empty grid
  let grid = Array.from({ length: size }, () => Array(size).fill(''));
  const placedWords = [];

  const directionsToUse = allowedDirections
    .map(dir => DIRECTIONS_MAP[dir])
    .filter(Boolean);

  if (directionsToUse.length === 0) {
    directionsToUse.push(DIRECTIONS_MAP['horizontal'], DIRECTIONS_MAP['vertical']);
  }

  // Try placing each word
  for (const word of selectedWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 150;

    while (!placed && attempts < maxAttempts) {
      attempts++;
      const dir = directionsToUse[Math.floor(Math.random() * directionsToUse.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);

      // Check boundary
      const endRow = startRow + dir.dr * (word.length - 1);
      const endCol = startCol + dir.dc * (word.length - 1);

      if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
        // Check collision
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = startRow + dir.dr * i;
          const c = startCol + dir.dc * i;
          if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          const cells = [];
          for (let i = 0; i < word.length; i++) {
            const r = startRow + dir.dr * i;
            const c = startCol + dir.dc * i;
            grid[r][c] = word[i];
            cells.push({ row: r, col: c, char: word[i] });
          }

          placedWords.push({
            word,
            cells,
            start: { row: startRow, col: startCol },
            end: { row: endRow, col: endCol },
            direction: dir
          });
          placed = true;
        }
      }
    }
  }

  // Fill empty spots with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return {
    grid,
    size,
    placedWords,
    unplacedWords: selectedWords.filter(w => !placedWords.some(pw => pw.word === w))
  };
}

/**
 * Checks whether a sequence of cell coordinates forms a valid straight path in any 8-directional line.
 *
 * @param {{row: number, col: number}} start
 * @param {{row: number, col: number}} end
 * @returns {Array<{row: number, col: number}> | null} Array of intermediate cells or null if invalid.
 */
export function getLineCells(start, end) {
  if (!start || !end) return null;

  const dr = end.row - start.row;
  const dc = end.col - start.col;

  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  // Must be straight line: horizontal, vertical, or diagonal
  if (dr !== 0 && dc !== 0 && absDr !== absDc) {
    return null;
  }

  const stepR = dr === 0 ? 0 : dr / absDr;
  const stepC = dc === 0 ? 0 : dc / absDc;

  const length = Math.max(absDr, absDc) + 1;
  const cells = [];

  for (let i = 0; i < length; i++) {
    cells.push({
      row: start.row + stepR * i,
      col: start.col + stepC * i
    });
  }

  return cells;
}

/**
 * Extract word string formed by cell selection on grid
 */
export function getWordFromCells(grid, cells) {
  if (!grid || !cells || cells.length === 0) return '';
  return cells.map(c => grid[c.row]?.[c.col] || '').join('');
}
