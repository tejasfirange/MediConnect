import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import QuestionCard from '../../components/QuestionCard';
import { useTheme } from '../../context/ThemeContext';
import {
  getCategories,
  getInitialQuestion,
  evaluateAssessment,
} from '../../services/assessmentService';
import './Assessment.css';

const categoryLabelMap = {
  en: {
    skin: 'Skin',
    hair: 'Hair',
    eye: 'Eye',
    headache: 'Headache',
    body_pain: 'Body Pain',
    stomach: 'Stomach',
    fever: 'Fever',
    cold_cough: 'Cold & Cough',
  },
  mr: {
    skin: 'त्वचा',
    hair: 'केस',
    eye: 'डोळे',
    headache: 'डोकेदुखी',
    body_pain: 'अंगदुखी',
    stomach: 'पोट',
    fever: 'ताप',
    cold_cough: 'सर्दी आणि खोकला',
  },
};

function getCategoryDisplayLabel(key, fallbackLabel, language) {
  const lang = String(language || 'en').toLowerCase().startsWith('mr') ? 'mr' : 'en';
  return categoryLabelMap[lang]?.[key] || fallbackLabel || key;
}

function Assessment() {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!mounted) return;
        setCategories(data);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      }
    }

    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedLabel = useMemo(
    () => {
      const category = categories.find((c) => c.key === selectedCategory);
      return getCategoryDisplayLabel(selectedCategory, category?.label, i18n.language);
    },
    [categories, selectedCategory, i18n.language]
  );

  const startAssessment = async (categoryKey) => {
    setError('');
    setLoading(true);

    try {
      const data = await getInitialQuestion(categoryKey);
      setSelectedCategory(categoryKey);
      setCurrentQuestionId(data.questionId);
      setCurrentQuestion(data.question);
      setAnswers([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyAnswers = async (nextAnswers, categoryKey = selectedCategory) => {
    const result = await evaluateAssessment(categoryKey, nextAnswers);

    if (result.completed) {
      navigate('/result', {
        state: {
          result,
          category: categoryKey,
          answeredCount: nextAnswers.length,
        },
      });
      return;
    }

    setCurrentQuestionId(result.nextQuestionId);
    setCurrentQuestion(result.nextQuestion);
  };

  const handleSelectOption = async (optionIndex) => {
    if (!currentQuestionId || !selectedCategory) return;

    setLoading(true);
    setError('');

    try {
      const nextAnswers = [...answers, { questionId: currentQuestionId, optionIndex }];
      setAnswers(nextAnswers);
      await applyAnswers(nextAnswers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    if (answers.length === 0 || !selectedCategory) return;

    setLoading(true);
    setError('');

    try {
      const reduced = answers.slice(0, -1);
      setAnswers(reduced);

      if (reduced.length === 0) {
        const data = await getInitialQuestion(selectedCategory);
        setCurrentQuestionId(data.questionId);
        setCurrentQuestion(data.question);
      } else {
        await applyAnswers(reduced);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`assessment-page min-h-screen pb-24 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className={`rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h1 className="text-2xl font-bold">Assessment</h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Select a category and answer dynamically generated questions.
          </p>

          {!selectedCategory ? (
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                    isDark
                      ? 'border-slate-600 text-slate-100 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Back to Dashboard
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => startAssessment(category.key)}
                    disabled={loading}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-60"
                  >
                    {getCategoryDisplayLabel(category.key, category.label, i18n.language)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className={`rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                Category: <span className="font-semibold capitalize">{selectedLabel}</span>
                <span className="ml-4">Answered: {answers.length}</span>
              </div>

              <QuestionCard
                questionId={currentQuestionId}
                question={currentQuestion}
                onSelectOption={handleSelectOption}
                disabled={loading}
              />

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBack}
                  disabled={answers.length === 0 || loading}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous question
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setCurrentQuestionId('');
                    setCurrentQuestion(null);
                    setAnswers([]);
                    setError('');
                  }}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Change category
                </button>
              </div>
            </div>
          )}

          {error ? <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Assessment;
