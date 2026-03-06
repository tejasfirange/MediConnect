import React, { useState } from 'react';
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
import '../Dashboard/Dashboard.css';
function Result() {
  const { isDark } = useTheme();
  const { state } = useLocation();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const result = state?.result;
  const category = state?.category;
  const answeredCount = state?.answeredCount;

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

      toast.success('Details sent to doctor successfully!');
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send details');
    } finally {
      setLoading(false);
    }
  };

  const isRiskAboveLow = result?.riskLevel && result.riskLevel.toLowerCase() !== 'low';
  const canSendToDoctor = user?.role === 'patient' && isRiskAboveLow && !sent;

  return (
    <div className={`dashboard-page min-h-screen pb-24 ${isDark ? 'dashboard-page--dark' : 'dashboard-page--light'}`}>
      <div className="dashboard-orb dashboard-orb--blue"></div>
      <div className="dashboard-orb dashboard-orb--sky"></div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className={`prescription-card glass-panel rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h1 className="text-3xl font-bold mb-2">Assessment Result</h1>

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
                <p className="mt-1">Risk level: <span className="font-semibold capitalize">{result.riskLevel || '-'}</span></p>
                <p className="mt-1">Score: <span className="font-semibold">{result.totalScore ?? '-'}</span></p>
              </div>

              <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-sm font-semibold">Recommendation</p>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{result.recommendation}</p>
              </div>

              {result.summary ? (
                <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  <p className="mb-2 text-sm font-semibold border-b pb-2 ${isDark ? 'border-slate-700' : 'border-slate-200'}">Summary ({result.summaryLanguage || 'en'})</p>
                  <div className={`markdown-wrapper text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result.summary}
                    </ReactMarkdown>
                  </div>
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
                {canSendToDoctor && (
                  <button
                    onClick={handleSendToDoctor}
                    disabled={loading}
                    className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send to Doctor'}
                  </button>
                )}
                {sent && (
                  <p className="w-full text-sm font-semibold text-green-600">
                    Sent to doctor queue. A doctor will review your assessment shortly.
                  </p>
                )}
                <Link
                  to="/assessment"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Retake Assessment
                </Link>
                <Link
                  to="/dashboard"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                >
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
