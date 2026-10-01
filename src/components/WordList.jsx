import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, RotateCcw, Eye, EyeOff, Clock } from 'lucide-react';
import { DEFAULT_ANIMATION_PROFILE } from '../utils/animationProfiles';

export default function WordList({
  placedWords,
  foundWords,
  showAnswers,
  onToggleAnswers,
  onResetProgress,
  elapsedTime,
  animationProfile = DEFAULT_ANIMATION_PROFILE
}) {
  const [newlyFoundWords, setNewlyFoundWords] = useState([]);
  const prevFoundWordsRef = useRef(foundWords);

  useEffect(() => {
    const prev = prevFoundWordsRef.current;
    const added = foundWords.filter(w => !prev.includes(w));

    if (added.length > 0) {
      setNewlyFoundWords(added);
      const timer = setTimeout(() => {
        setNewlyFoundWords([]);
      }, 500);

      prevFoundWordsRef.current = foundWords;
      return () => clearTimeout(timer);
    }

    prevFoundWordsRef.current = foundWords;
  }, [foundWords]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const completedCount = foundWords.length;
  const totalCount = placedWords.length;

  return (
    <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 shadow-xs border border-slate-200/80 flex flex-col gap-2 w-full">
      {/* Header info & controls row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight uppercase">
            Find these words
          </span>
          <span className="bg-indigo-100 text-indigo-800 text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-extrabold">
            {completedCount}/{totalCount}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatTime(elapsedTime)}</span>
          </div>

          <button
            onClick={onToggleAnswers}
            className={`p-1.5 rounded-lg text-xs font-bold border transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation active:scale-95 ${
              showAnswers
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title={showAnswers ? 'Hide Answers' : 'Reveal Answers'}
            aria-label={showAnswers ? 'Hide Answers' : 'Reveal Answers'}
          >
            {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={onResetProgress}
            className="p-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation active:scale-95"
            title="Reset puzzle progress"
            aria-label="Reset puzzle progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Words list horizontal chip container */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[110px] sm:max-h-[140px] overflow-y-auto p-0.5 scrollbar-thin">
        {placedWords.map(({ word }) => {
          const isFound = foundWords.includes(word);
          const isNewlyFound = newlyFoundWords.includes(word);

          return (
            <div
              key={word}
              style={{
                '--word-scale': `${animationProfile.wordListScale || 1.1}`
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 min-h-[32px] touch-manipulation ${
                isFound
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs'
                  : 'bg-indigo-50/80 text-indigo-950 border border-indigo-100 hover:bg-indigo-100/60'
              } ${isNewlyFound ? 'animate-word-pop ring-2 ring-emerald-400 z-10' : ''}`}
            >
              <span className={`tracking-wider font-mono uppercase ${isFound ? 'line-through decoration-2 opacity-90' : ''}`}>
                {word}
              </span>
              {isFound && (
                <CheckCircle2
                  className={`w-3.5 h-3.5 text-emerald-600 flex-shrink-0 ml-0.5 transition-transform ${
                    isNewlyFound ? 'scale-125' : 'scale-100'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
