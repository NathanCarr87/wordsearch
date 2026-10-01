import React from 'react';
import { Sparkles, Database, CheckCircle2, RefreshCw } from 'lucide-react';

export default function Header({ currentGradeLabel, dataSource, onRefresh, isLoading }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              WordSearch <span className="text-indigo-600 font-extrabold">Quest</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Grade-Based Vocabulary Builder</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
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
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
            title="Generate New Puzzle"
            aria-label="Generate New Puzzle"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
