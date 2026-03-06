import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Result.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { evaluateAssessment } from '../../services/assessmentService';
import '../Dashboard/Dashboard.css';

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

function Result() {
  const { isDark } = useTheme();
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  
  const [loading, setLoading] = useState(false);
  const [reEvaluating, setReEvaluating] = useState(false);
  const [sent, setSent] = useState(false);
  const [currentResult, setCurrentResult] = useState(state?.result);

  const category = state?.category;
  const answeredCount = state?.answeredCount;
  const answers = state?.answers;

  useEffect(() => {
    if (category && answers && answers.length > 0) {
      setReEvaluating(true);
      evaluateAssessment(category, answers)
        .then(newResult => {
          setCurrentResult(newResult);
        })
        .catch(err => {
          console.error("Failed to re-evaluate assessment in new language:", err);
        })
        .finally(() => {
          setReEvaluating(false);
        });
    }
  }, [i18n.language, category, answers]);

  const result = currentResult;

  const handleSendToDoctor = async () => {
    if (!result?.reportId) {
      toast.error('Report ID missing. Cannot send to doctor.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/consultations/consult', {
        reportId: result.reportId
      });

      toast.success(t('assessmentResult.sentToQueue'));
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send details');
    } finally {
      setLoading(false);
    }
  };

  const isRiskAboveLow = result?.riskLevelCode && (result.riskLevelCode === 'high' || result.riskLevelCode === 'critical');
  const canSendToDoctor = user?.role === 'patient' && isRiskAboveLow && !sent;

  return (
    <div className={`dashboard-page min-h-screen flex flex-col ${isDark ? 'dashboard-page--dark bg-slate-950' : 'dashboard-page--light bg-slate-50'}`}>
      <div className="dashboard-orb dashboard-orb--blue"></div>
      <div className="dashboard-orb dashboard-orb--sky"></div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 flex-1">
        <div className={`prescription-card glass-panel rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-6">
             <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('assessmentResult.title')}</h1>
             {reEvaluating && (
                <div className="flex items-center gap-2 text-blue-500 animate-pulse">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-xs font-bold uppercase tracking-widest">{t('assessmentResult.transmitting')}</span>
                </div>
             )}
          </div>

          {!result ? (
            <div className="mt-4 space-y-3">
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                {t('assessmentResult.noData')}
              </p>
              <Link to="/assessment" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                {t('actions.startAssessment')}
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className={`rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                <p>{t('assessmentResult.category')}: <span className="font-semibold capitalize">
                   {categoryLabelMap[i18n.language.startsWith('mr') ? 'mr' : 'en']?.[category] || category}
                </span></p>
                <p className="mt-1">{t('assessmentResult.answeredQuestions')}: <span className="font-semibold">{answeredCount}</span></p>
                <p className="mt-1">{t('assessmentResult.redFlag')}: <span className="font-semibold">{result.redFlagTriggered ? t('assessmentResult.yes') : t('assessmentResult.no')}</span></p>
                <p className="mt-1">{t('assessmentResult.riskLevel')}: <span className="font-semibold capitalize">{result.riskLevel || '-'}</span></p>
                <p className="mt-1">{t('assessmentResult.score')}: <span className="font-semibold">{result.totalScore ?? '-'}</span></p>
              </div>

              <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-1">{t('assessmentResult.clinicalRecommendation')}</p>
                <p className={`text-lg font-bold leading-relaxed ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{result.recommendation}</p>
              </div>

              {result.summary ? (
                <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`mb-2 text-sm font-semibold border-b border-slate-700/50 pb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t('assessmentResult.medicalSummary')} ({result.summaryLanguage || 'en'})</p>
                  <div className={`markdown-wrapper text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result.summary}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : null}

              {Array.isArray(result.responseDetails) && result.responseDetails.length > 0 ? (
                <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t('assessmentResult.clinicalResponseHistory')}</p>
                  <div className="space-y-3">
                    {result.responseDetails.map((item, index) => (
                      <div
                        key={`${item.questionId}-${index}`}
                        className={`rounded-lg border px-4 py-3 text-sm transition-colors ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'}`}
                      >
                        <p className={`font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{index + 1}. {item.questionText}</p>
                        <p className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{t('assessmentResult.patientAnswer')}: {item.selectedOptionText}</p>
                        {item.redFlag && (
                           <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-tighter border border-rose-500/20">
                              <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse"></span>
                              {t('assessmentResult.redFlagAlert')}
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-6">
                {canSendToDoctor && (
                  <button
                    onClick={handleSendToDoctor}
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {loading ? t('assessmentResult.transmitting') : t('assessmentResult.sendToDoctor')}
                  </button>
                )}
                {sent && (
                  <div className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-2">
                    <p className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {t('assessmentResult.sentToQueue')}
                    </p>
                  </div>
                )}
                <Link
                  to="/assessment"
                  className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                >
                  {t('assessmentResult.retake')}
                </Link>
                 <Link
                  to="/dashboard"
                  className={`rounded-xl border px-6 py-3.5 text-sm font-bold transition ${
                    isDark 
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' 
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('assessmentResult.backToDashboard')}
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
