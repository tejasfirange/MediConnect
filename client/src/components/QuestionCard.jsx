import React from 'react';
import { useTheme } from '../context/ThemeContext';

function QuestionCard({ questionId, question, onSelectOption, disabled }) {
  const { isDark } = useTheme();

  if (!question) return null;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{questionId}</p>
      <h2 className={`mt-2 text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{question.text}</h2>

      <div className="mt-4 space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={`${questionId}-${index}`}
            onClick={() => onSelectOption(index)}
            disabled={disabled}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isDark
                ? 'border-slate-600 bg-slate-900 text-slate-100 hover:border-blue-500 hover:bg-slate-700'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
