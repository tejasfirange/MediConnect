import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RiskMeter from '../../components/RiskMeter';
import { useTheme } from '../../context/ThemeContext';
import './Result.css';

function Result() {
  const { isDark } = useTheme();
  const { state } = useLocation();

  const result = state?.result;
  const category = state?.category;
  const answeredCount = state?.answeredCount;

  return (
    <div className={`result-page min-h-screen pb-24 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className={`rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h1 className="text-2xl font-bold">Result</h1>

          {!result ? (
            <div className="mt-4 space-y-3">
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                No result data found. Please complete an assessment first.
              </p>
              <Link to="/assessment" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                Start Assessment
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className={`rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                <p>Category: <span className="font-semibold capitalize">{category}</span></p>
                <p className="mt-1">Answered questions: <span className="font-semibold">{answeredCount}</span></p>
                <p className="mt-1">Red flag: <span className="font-semibold">{result.redFlagTriggered ? 'Yes' : 'No'}</span></p>
              </div>

              <RiskMeter riskLevel={result.riskLevel} totalScore={result.totalScore} />

              <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-sm font-semibold">Recommendation</p>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{result.recommendation}</p>
              </div>

              {result.summary ? (
                <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  <p className="text-sm font-semibold">Summary ({result.summaryLanguage || 'en'})</p>
                  <p className={`mt-1 whitespace-pre-line text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{result.summary}</p>
                </div>
              ) : null}

              {Array.isArray(result.responseDetails) && result.responseDetails.length > 0 ? (
                <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  <p className="text-sm font-semibold">Response Details</p>
                  <div className="mt-3 space-y-2">
                    {result.responseDetails.map((item, index) => (
                      <div
                        key={`${item.questionId}-${index}`}
                        className={`rounded-lg border px-3 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}
                      >
                        <p className="font-medium">{index + 1}. {item.questionText}</p>
                        <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>Answer: {item.selectedOptionText}</p>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                          Score: {item.score}{item.redFlag ? ' | Red flag: Yes' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Link to="/assessment" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Retake Assessment
                </Link>
                <Link to="/dashboard" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Result;
