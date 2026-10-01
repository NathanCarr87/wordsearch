import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RefreshCw, Star } from 'lucide-react';

export default function VictoryModal({ isOpen, gradeLabel, timeSpent, onNewGame }) {
  if (!isOpen) return null;

  // Trigger celebration confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-indigo-100 transform transition-all scale-100">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Puzzle Completed!</h2>
        <p className="text-sm font-medium text-slate-500 mb-6">You solved the {gradeLabel} word search puzzle.</p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 flex justify-around">
          <div>
            <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">Time Taken</span>
            <span className="text-lg font-extrabold text-indigo-900">{formatTime(timeSpent)}</span>
          </div>
          <div className="border-r border-indigo-200"></div>
          <div>
            <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">Rating</span>
            <div className="flex items-center text-amber-400 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 transition-transform active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Play Another Puzzle</span>
        </button>
      </div>
    </div>
  );
}
