import React, { useState } from 'react';
import { GraduationCap, Check, ChevronDown, X } from 'lucide-react';

export default function GradeSelector({ grades, selectedGrade, onSelectGrade, disabled }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedGradeObj = grades.find(g => g.key === selectedGrade) || grades[0];

  const handleSelect = (key) => {
    onSelectGrade(key);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Compact Selector Pill / Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        type="button"
        className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border shadow-xs min-h-[38px] touch-manipulation active:scale-95 ${
          isOpen
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100'
            : 'bg-white text-indigo-950 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-expanded={isOpen}
        aria-label="Select Grade Level"
      >
        <GraduationCap className={`w-4 h-4 ${isOpen ? 'text-white' : 'text-indigo-600'}`} />
        <div className="flex items-center gap-1.5">
          <span>{selectedGradeObj ? selectedGradeObj.label : 'Select Grade'}</span>
          {selectedGradeObj && (
            <span className={`text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 rounded-md ${
              isOpen ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {selectedGradeObj.gridSize}x{selectedGradeObj.gridSize}
            </span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
      </button>

      {/* Modal / Overlay for selecting grades */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Card */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Select Grade Level</h2>
                  <p className="text-xs text-slate-500">Choose a level to change puzzle grid size and words</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close grade selector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto p-0.5">
              {grades.map((grade) => {
                const isSelected = selectedGrade === grade.key;
                return (
                  <button
                    key={grade.key}
                    onClick={() => handleSelect(grade.key)}
                    disabled={disabled}
                    className={`relative flex flex-col justify-center p-3 rounded-xl transition-all text-left border min-h-[52px] touch-manipulation ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 ring-2 ring-indigo-600/30 ring-offset-1'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50/60 hover:border-indigo-200'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-98'}`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-white text-indigo-600 rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="w-full pr-3">
                      <span className={`text-[10px] font-bold block ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {grade.gridSize}x{grade.gridSize} Grid
                      </span>
                      <span className="text-xs sm:text-sm font-bold block mt-0.5 truncate">{grade.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
