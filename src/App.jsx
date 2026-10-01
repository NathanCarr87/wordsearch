import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import GradeSelector from './components/GradeSelector';
import WordSearchBoard from './components/WordSearchBoard';
import WordList from './components/WordList';
import VictoryModal from './components/VictoryModal';
import { getGradeCorpus, getAvailableGrades } from './firebase';
import { generateWordSearch } from './utils/wordSearchGenerator';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [gradesList, setGradesList] = useState([]);
  const [selectedGradeKey, setSelectedGradeKey] = useState('grade1');
  const [gradeCorpus, setGradeCorpus] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState(null); // 'LOAD_ERROR' | 'NO_WORDS' | null
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isVictory, setIsVictory] = useState(false);

  // Load list of available grades
  useEffect(() => {
    setGradesList(getAvailableGrades());
  }, []);

  // Timer interval
  useEffect(() => {
    let timer;
    if (puzzle && !isVictory && !isLoading && !errorState) {
      timer = setInterval(() => setElapsedTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [puzzle, isVictory, isLoading, errorState]);

  // Load grade corpus and generate new puzzle
  const loadPuzzle = useCallback(async (gradeKey) => {
    setIsLoading(true);
    setErrorState(null);
    setShowAnswers(false);
    setFoundWords([]);
    setIsVictory(false);
    setElapsedTime(0);

    try {
      const corpus = await getGradeCorpus(gradeKey);
      setGradeCorpus(corpus);

      if (!corpus) {
        setErrorState('LOAD_ERROR');
        setIsLoading(false);
        return;
      }

      if (!Array.isArray(corpus.words) || corpus.words.length === 0) {
        setErrorState('NO_WORDS');
        setIsLoading(false);
        return;
      }

      const newPuzzle = generateWordSearch(
        corpus.words,
        corpus.gridSize,
        corpus.allowedDirections,
        corpus.maxWords
      );

      setPuzzle(newPuzzle);
    } catch (err) {
      console.error("Error loading grade corpus:", err);
      setErrorState('LOAD_ERROR');
    } finally {
      setIsLoading(false);
    }
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
    <div className="h-dvh max-h-dvh bg-slate-100 text-slate-800 flex flex-col font-sans overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <Header
        currentGradeLabel={gradeCorpus?.label || ''}
        dataSource={gradeCorpus?.source || 'local'}
        onRefresh={() => loadPuzzle(selectedGradeKey)}
        isLoading={isLoading}
      >
        <GradeSelector
          grades={gradesList}
          selectedGrade={selectedGradeKey}
          onSelectGrade={handleGradeChange}
          disabled={isLoading}
        />
      </Header>

      <main className="max-w-4xl w-full mx-auto px-2 sm:px-4 py-2 flex-grow flex flex-col min-h-0 overflow-y-auto sm:overflow-hidden justify-start sm:justify-center items-center gap-2 sm:gap-3">
        {isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center bg-white rounded-2xl shadow-xs border border-slate-200 p-6 w-full my-auto max-h-[300px]">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-slate-600 font-bold text-xs sm:text-sm">Loading corpus...</p>
          </div>
        ) : errorState === 'LOAD_ERROR' ? (
          <div className="flex-grow flex flex-col items-center justify-center bg-white rounded-2xl shadow-xs border border-rose-200 p-6 text-center w-full my-auto max-h-[300px]">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Unable to load word corpus.</h3>
            <p className="text-xs text-slate-500 mb-3">Please check your network connection or try again.</p>
            <button
              onClick={() => loadPuzzle(selectedGradeKey)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-xs flex items-center gap-2 min-h-[38px]"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : errorState === 'NO_WORDS' ? (
          <div className="flex-grow flex flex-col items-center justify-center bg-white rounded-2xl shadow-xs border border-amber-200 p-6 text-center w-full my-auto max-h-[300px]">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No active words available.</h3>
            <p className="text-xs text-slate-500">This grade level currently has no active words in the database.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start w-full gap-2 sm:gap-3 flex-grow min-h-0 my-auto">
            {/* Words To Find (ALWAYS ABOVE PUZZLE) */}
            {puzzle && (
              <div className="w-full flex-none">
                <WordList
                  placedWords={puzzle.placedWords}
                  foundWords={foundWords}
                  showAnswers={showAnswers}
                  onToggleAnswers={() => setShowAnswers(!showAnswers)}
                  onResetProgress={handleResetProgress}
                  elapsedTime={elapsedTime}
                />
              </div>
            )}

            {/* Word Search Board */}
            {puzzle && (
              <div className="w-full flex-grow flex items-center justify-center min-h-0">
                <WordSearchBoard
                  grid={puzzle.grid}
                  size={puzzle.size}
                  placedWords={puzzle.placedWords}
                  foundWords={foundWords}
                  onWordFound={handleWordFound}
                  showAnswers={showAnswers}
                />
              </div>
            )}
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
