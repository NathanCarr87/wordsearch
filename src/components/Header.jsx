import React from 'react';
import { Sparkles, Database, RefreshCw } from 'lucide-react';

export default function Header({ currentGradeLabel, dataSource, onRefresh, isLoading, children }) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs flex-none">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Logo and Compact Grade Control */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-indigo-600 text-white p-1.5 sm:p-2 rounded-xl shadow-xs shadow-indigo-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center">
              WordSearch <span className="text-indigo-600 ml-1">Quest</span>
            </h1>

            {/* Embedded compact grade selector */}
            {children}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className={`hidden md:flex px-2.5 py-1 rounded-full text-[11px] font-semibold items-center gap-1.5 border ${
            dataSource === 'firebase'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <Database className="w-3 h-3" />
            <span>{dataSource === 'firebase' ? 'Firebase' : 'Local'}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-slate-200 active:scale-95 touch-manipulation min-w-[36px] min-h-[36px]"
            title="Generate New Puzzle"
            aria-label="Generate New Puzzle"
          >
            <RefreshCw className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
