import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Star, Sparkles } from 'lucide-react';
import { DEFAULT_ANIMATION_PROFILE } from '../utils/animationProfiles';

export default function VictoryModal({
  isOpen,
  gradeLabel,
  timeSpent,
  onNewGame,
  animationProfile = DEFAULT_ANIMATION_PROFILE
}) {
  useEffect(() => {
    if (!isOpen) return;

    // Trigger celebration confetti scaled according to animation profile
    const particleCount = animationProfile.celebrationParticleCount || 80;
    const spread = animationProfile.celebrationSpread || 70;
    const colors = animationProfile.colors || ['#6366f1', '#10b981', '#f59e0b'];

    confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true
    });

    if (animationProfile.intensity === 'playful') {
      const timer = setTimeout(() => {
        confetti({
          particleCount: Math.floor(particleCount * 0.4),
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
          disableForReducedMotion: true
        });
        confetti({
          particleCount: Math.floor(particleCount * 0.4),
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
          disableForReducedMotion: true
        });
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isOpen, animationProfile]);

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isPlayful = animationProfile.intensity === 'playful';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-indigo-100 transform transition-all scale-100">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ${
          isPlayful ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
        }`}>
          {isPlayful ? (
            <Trophy className="w-10 h-10 animate-bounce" />
          ) : (
            <Sparkles className="w-9 h-9 text-indigo-600" />
          )}
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
          {isPlayful ? '🎉 Puzzle Complete!' : 'Puzzle Completed'}
        </h2>
        <p className="text-sm font-medium text-slate-500 mb-6">
          You solved the {gradeLabel} word search puzzle.
        </p>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 flex justify-around">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Time Taken</span>
            <span className="text-lg font-extrabold text-slate-800">{formatTime(timeSpent)}</span>
          </div>
          <div className="border-r border-slate-200"></div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Rating</span>
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
          className="w-full py-3.5 px-6 min-h-[48px] rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 transition-transform active:scale-95 touch-manipulation cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Play Another Puzzle</span>
        </button>
      </div>
    </div>
  );
}
