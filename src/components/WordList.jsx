import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, RotateCcw, Eye, EyeOff, Trophy, Clock } from 'lucide-react';

export default function WordList({ placedWords, foundWords, showAnswers, onToggleAnswers, onResetProgress, elapsedTime }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const completedCount = foundWords.length;
  const totalCount = placedWords.length;
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between h-full min-h-[220px]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Words to Find</span>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
              {completedCount}/{totalCount}
            </span>
          </h2>
        </div>

        <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>

      {isComplete && (
        <div className="mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 sm:p-3 rounded-xl flex items-center gap-2 animate-bounce">
          <Trophy className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">Awesome job! You found all words!</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 flex-grow overflow-y-auto max-h-[260px] lg:max-h-[380px] pr-1">
        {placedWords.map(({ word }) => {
          const isFound = foundWords.includes(word);
          return (
            <div
              key={word}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                isFound
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 line-through decoration-2 font-bold'
                  : 'bg-slate-50 text-slate-700 border border-slate-200/60 hover:bg-slate-100'
              }`}
            >
              <span className="tracking-wide font-mono text-xs sm:text-sm truncate">{word}</span>
              {isFound && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1" />}
            </div>
          );
        })}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
        <button
          onClick={onToggleAnswers}
          className={`flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors min-h-[44px] touch-manipulation active:scale-98 ${
            showAnswers
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showAnswers ? 'Hide Answers' : 'Reveal Answers'}</span>
        </button>

        <button
          onClick={onResetProgress}
          className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors min-h-[44px] touch-manipulation active:scale-98"
          title="Reset puzzle progress"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
