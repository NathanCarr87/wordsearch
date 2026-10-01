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
            <p className="text-slate-600 font-bold text-sm">Loading corpus...</p>
          </div>
        ) : errorState === 'LOAD_ERROR' ? (
          <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl shadow-sm border border-rose-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Unable to load the word corpus.</h3>
            <p className="text-sm text-slate-500 mb-4">Please check your network connection or try again.</p>
            <button
              onClick={() => loadPuzzle(selectedGradeKey)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : errorState === 'NO_WORDS' ? (
          <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl shadow-sm border border-amber-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No enabled words available.</h3>
            <p className="text-sm text-slate-500 mb-4">This grade currently has no active words in the database.</p>
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
