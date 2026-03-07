import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { getPatientHistory } from '../../services/patientService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

function History() {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation('dashboard');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      try {
        const data = await getPatientHistory();
        if (!mounted) return;
        setReports(data);
        if (data.length > 0) {
          setSelectedReportId(data[0].pr_id);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedReport = useMemo(
    () => reports.find((report) => report.pr_id === selectedReportId) || null,
    [reports, selectedReportId]
  );

  const result = selectedReport?.report;
  const currentLang = i18n.language.startsWith('mr') ? 'mr' : 'en';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 flex-1">
        <div className={`rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <div className="mb-6">
             <button 
               onClick={() => navigate(-1)}
               className={`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                 isDark 
                 ? 'bg-slate-800 text-slate-400 hover:text-white' 
                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
               }`}
             >
               <ArrowLeft size={16} />
               {t('assessmentResult.backToDashboard')}
             </button>
             <h1 className="text-2xl font-bold">{t('pastHistory.title')}</h1>
             <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
               {t('pastHistory.subtitle')}
             </p>
          </div>

          {loading ? (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className={`h-24 animate-pulse rounded-2xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'}`} />
              ))}
            </div>
          ) : null}
          {error ? <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          {!loading && !error ? (
            reports.length === 0 ? (
              <div className={`mt-6 rounded-2xl border p-6 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-lg font-semibold">{t('pastHistory.noReports')}</p>
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t('pastHistory.noReportsText')}
                </p>
                <Link
                  to="/assessment"
                  className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-700"
                >
                  {t('actions.startAssessment')}
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="space-y-3 md:col-span-1">
                  {reports.map((item) => {
                    const active = item.pr_id === selectedReportId;
                    return (
                      <button
                        key={item.pr_id}
                        onClick={() => setSelectedReportId(item.pr_id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                          active
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : isDark
                              ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-semibold">{t('pastHistory.reportId', { id: item.pr_id })}</p>
                        <p className="mt-1 text-xs capitalize">
                          {categoryLabelMap[currentLang]?.[item.report?.category] || item.report?.category || '-'}
                        </p>
                        <p className="mt-1 text-xs">{t('pastHistory.risk')}: {item.report?.riskLevel || '-'}</p>
                      </button>
                    );
                  })}
                </div>

                <div className={`rounded-2xl border p-5 md:col-span-2 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  {selectedReport ? (
                    <>
                      <h2 className="text-lg font-semibold">{t('pastHistory.reportId', { id: selectedReport.pr_id })}</h2>
                      <p className="mt-2 text-sm">
                        {t('assessmentResult.category')}: <span className="font-medium capitalize">{categoryLabelMap[currentLang]?.[result?.category] || result?.category || '-'}</span>
                      </p>
                      <p className="mt-1 text-sm">{t('pastHistory.risk')}: <span className="font-medium capitalize">{result?.riskLevel || '-'}</span></p>
                      <p className="mt-1 text-sm">{t('pastHistory.score')}: <span className="font-medium">{result?.totalScore ?? '-'}</span></p>
                      <p className="mt-1 text-sm font-semibold text-blue-500 uppercase tracking-tight">{t('pastHistory.recommendation')}</p>
                      <p className="mt-0.5 text-base font-bold leading-snug">{result?.recommendation || '-'}</p>

                      {result?.summary ? (
                        <div className={`mt-4 rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-700'}`}>
                          <p className="font-semibold border-b border-slate-700/30 pb-1 mb-2">{t('pastHistory.summary')} ({result.summaryLanguage || 'en'})</p>
                          <div className="mt-1 markdown-wrapper">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {result.summary}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ) : null}

                      {Array.isArray(result?.responseDetails) && result.responseDetails.length > 0 ? (
                        <div className="mt-6 space-y-3">
                          <p className="text-sm font-semibold">{t('pastHistory.responseDetails')}</p>
                          {result.responseDetails.map((entry, index) => (
                            <div
                              key={`${entry.questionId}-${index}`}
                              className={`rounded-lg border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'}`}
                            >
                              <p className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{index + 1}. {entry.questionText}</p>
                              <p className="mt-1 font-medium text-blue-500">{t('pastHistory.ans')}: {entry.selectedOptionText}</p>
                              {entry.redFlag && (
                                <p className="mt-1 text-[10px] font-black uppercase text-rose-500 tracking-tighter">🚨 {t('pastHistory.redFlag')}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-sm">{t('pastHistory.selectReport')}</p>
                  )}
                </div>
              </div>
            )
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default History;
