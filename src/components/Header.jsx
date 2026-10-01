import React from 'react';
import { Sparkles, Database, CheckCircle2, RefreshCw } from 'lucide-react';

export default function Header({ currentGradeLabel, dataSource, onRefresh, isLoading }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="bg-indigo-600 text-white p-2 sm:p-2.5 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
              WordSearch <span className="text-indigo-600 font-extrabold">Quest</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Grade-Based Vocabulary Builder</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`hidden sm:flex px-3 py-1 rounded-full text-xs font-semibold items-center gap-1.5 border ${
            dataSource === 'firebase'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <Database className="w-3.5 h-3.5" />
            <span>Corpus: {dataSource === 'firebase' ? 'Firebase Firestore' : 'Local Corpus'}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-slate-200 active:scale-95 touch-manipulation min-w-[44px] min-h-[44px]"
            title="Generate New Puzzle"
            aria-label="Generate New Puzzle"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
