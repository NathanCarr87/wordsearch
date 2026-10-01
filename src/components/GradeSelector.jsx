import React from 'react';
import { BookOpen, GraduationCap, Grid, Check } from 'lucide-react';

export default function GradeSelector({ grades, selectedGrade, onSelectGrade, disabled }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <GraduationCap className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base font-bold text-slate-800">Select Grade Level</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {grades.map((grade) => {
          const isSelected = selectedGrade === grade.key;
          return (
            <button
              key={grade.key}
              onClick={() => onSelectGrade(grade.key)}
              disabled={disabled}
              className={`relative flex flex-col items-center justify-between p-3 rounded-xl transition-all text-left border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 ring-2 ring-indigo-600/30 ring-offset-1'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50/60 hover:border-indigo-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 bg-white text-indigo-600 rounded-full p-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="w-full">
                <span className={`text-xs font-bold block ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {grade.gridSize}x{grade.gridSize} Grid
                </span>
                <span className="text-sm font-bold block mt-0.5 truncate">{grade.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
