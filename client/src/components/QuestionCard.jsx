import React from 'react';

function QuestionCard({ questionId, question, onSelectOption, disabled }) {
  if (!question) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{questionId}</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">{question.text}</h2>

      <div className="mt-4 space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={`${questionId}-${index}`}
            onClick={() => onSelectOption(index)}
            disabled={disabled}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
