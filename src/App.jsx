import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import GradeSelector from './components/GradeSelector';
import WordSearchBoard from './components/WordSearchBoard';
import WordList from './components/WordList';
import VictoryModal from './components/VictoryModal';
import { getGradeCorpus, getAvailableGrades } from './firebase';
import { generateWordSearch } from './utils/wordSearchGenerator';

export default function App() {
  const [gradesList, setGradesList] = useState([]);
  const [selectedGradeKey, setSelectedGradeKey] = useState('grade1');
  const [gradeCorpus, setGradeCorpus] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isVictory, setIsVictory] = useState(false);

  // Load list of available grades
  useEffect(() => {
    setGradesList(getAvailableGrades());
  }, []);

  // Timer interval
  useEffect(() => {
    let timer;
    if (puzzle && !isVictory) {
      timer = setInterval(() => setElapsedTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [puzzle, isVictory]);

  // Load grade corpus and generate new puzzle
  const loadPuzzle = useCallback(async (gradeKey) => {
    setIsLoading(true);
    setShowAnswers(false);
    setFoundWords([]);
    setIsVictory(false);
    setElapsedTime(0);

    const corpus = await getGradeCorpus(gradeKey);
    setGradeCorpus(corpus);

    const newPuzzle = generateWordSearch(
      corpus.words,
      corpus.gridSize,
      corpus.allowedDirections,
      corpus.maxWords
    );

    setPuzzle(newPuzzle);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPuzzle(selectedGradeKey);
  }, [selectedGradeKey, loadPuzzle]);

  const handleGradeChange = (key) => {
    if (key !== selectedGradeKey) {
      setSelectedGradeKey(key);
    }
  };

  const handleWordFound = (word) => {
    if (!foundWords.includes(word)) {
      const updated = [...foundWords, word];
      setFoundWords(updated);

      if (puzzle && updated.length === puzzle.placedWords.length) {
        setIsVictory(true);
      }
    }
  };

  const handleResetProgress = () => {
    setFoundWords([]);
    setShowAnswers(false);
    setIsVictory(false);
    setElapsedTime(0);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <Header
        currentGradeLabel={gradeCorpus?.label || ''}
        dataSource={gradeCorpus?.source || 'local'}
        onRefresh={() => loadPuzzle(selectedGradeKey)}
        isLoading={isLoading}
      />

      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex-grow flex flex-col">
        {/* Grade Selector */}
        <GradeSelector
          grades={gradesList}
          selectedGrade={selectedGradeKey}
          onSelectGrade={handleGradeChange}
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-bold text-sm">Generating Word Search Puzzle...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow">
            {/* Word Search Grid */}
            <div className="lg:col-span-8 flex flex-col items-center">
              {puzzle && (
                <WordSearchBoard
                  grid={puzzle.grid}
                  size={puzzle.size}
                  placedWords={puzzle.placedWords}
                  foundWords={foundWords}
                  onWordFound={handleWordFound}
                  showAnswers={showAnswers}
                />
              )}
            </div>

            {/* Word List Sidebar */}
            <div className="lg:col-span-4 h-full">
              {puzzle && (
                <WordList
                  placedWords={puzzle.placedWords}
                  foundWords={foundWords}
                  showAnswers={showAnswers}
                  onToggleAnswers={() => setShowAnswers(!showAnswers)}
                  onResetProgress={handleResetProgress}
                  elapsedTime={elapsedTime}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <VictoryModal
        isOpen={isVictory}
        gradeLabel={gradeCorpus?.label || ''}
        timeSpent={elapsedTime}
        onNewGame={() => loadPuzzle(selectedGradeKey)}
      />
    </div>
  );
}
