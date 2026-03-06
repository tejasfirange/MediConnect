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

// Asset Imports
import skinImg from '../../assets/skin care.png';
import eyeImg from '../../assets/eye.png';
import headacheImg from '../../assets/headache.png';
import bodyPainImg from '../../assets/body_pain.png';
import stomachImg from '../../assets/stomach_pain.png';
import feverImg from '../../assets/fever.png';
import coughImg from '../../assets/cough.png';
import hairImg from '../../assets/hair.png';

const categoryImageMap = {
  skin: skinImg,
  eye: eyeImg,
  headache: headacheImg,
  body_pain: bodyPainImg,
  stomach: stomachImg,
  fever: feverImg,
  cold_cough: coughImg,
  hair: hairImg,
};

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

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [i18n.language]);

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
    const result = await evaluateAssessment(categoryKey, nextAnswers, true);

    if (result.completed) {
      navigate('/result', {
        state: {
          result,
          category: categoryKey,
          answeredCount: nextAnswers.length,
          answers: nextAnswers,
        },
      });
      return;
    }

    setCurrentQuestionId(result.nextQuestionId);
    setCurrentQuestion(result.nextQuestion);
  };

  // Re-fetch question when language changes
  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      if (answers.length === 0) {
        getInitialQuestion(selectedCategory)
          .then(data => {
            setCurrentQuestionId(data.questionId);
            setCurrentQuestion(data.question);
          })
          .catch(err => setError(err.message))
          .finally(() => setLoading(false));
      } else {
        evaluateAssessment(selectedCategory, answers, false)
          .then(result => {
             if (!result.completed) {
                setCurrentQuestionId(result.nextQuestionId);
                setCurrentQuestion(result.nextQuestion);
             }
          })
          .catch(err => setError(err.message))
          .finally(() => setLoading(false));
      }
    }
  }, [i18n.language]);

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

  const selectedLabel = useMemo(
    () => {
      const category = categories.find((c) => c.key === selectedCategory);
      return getCategoryDisplayLabel(selectedCategory, category?.label, i18n.language);
    },
    [categories, selectedCategory, i18n.language]
  );

  return (
    <div className={`assessment-page min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 flex-1">
        <div className={`rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h1 className="text-2xl font-bold">Assessment</h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Select a category and answer dynamically generated questions.
          </p>

          {!selectedCategory ? (
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Select Specialization</h2>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isDark
                      ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  Back to Dashboard
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => startAssessment(category.key)}
                    disabled={loading}
                    className={`group relative flex flex-col items-center overflow-hidden rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      isDark 
                        ? 'border-slate-800 bg-slate-900 hover:border-blue-500/50' 
                        : 'border-slate-100 bg-white hover:border-blue-200'
                    } disabled:opacity-60`}
                  >
                    {/* Image Container */}
                    <div className={`w-full aspect-square overflow-hidden border-b ${
                      isDark ? 'bg-slate-800 border-slate-800' : 'bg-slate-50 border-slate-50'
                    }`}>
                      <img 
                        src={categoryImageMap[category.key] || hairImg} 
                        alt={category.label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-4 w-full text-center">
                      <p className={`text-[11px] font-black uppercase tracking-widest ${
                        isDark ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-500 group-hover:text-blue-600'
                      }`}>
                        {getCategoryDisplayLabel(category.key, category.label, i18n.language)}
                      </p>
                    </div>
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
