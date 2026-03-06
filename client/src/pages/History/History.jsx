import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { getPatientHistory } from '../../services/patientService';

function History() {
  const { isDark } = useTheme();
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

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className={`rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h1 className="text-2xl font-bold">Past History</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Review your previous assessment reports and recommendations.
          </p>

          {loading ? <p className="mt-4 text-sm">Loading history...</p> : null}
          {error ? <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          {!loading && !error ? (
            reports.length === 0 ? (
              <div className="mt-6 space-y-3">
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>No past reports found yet.</p>
                <Link to="/assessment" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Take Assessment
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
                        <p className="font-semibold">Report #{item.pr_id}</p>
                        <p className="mt-1 text-xs capitalize">{item.report?.category || '-'}</p>
                        <p className="mt-1 text-xs">Risk: {item.report?.riskLevel || '-'}</p>
                      </button>
                    );
                  })}
                </div>

                <div className={`rounded-2xl border p-5 md:col-span-2 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  {selectedReport ? (
                    <>
                      <h2 className="text-lg font-semibold">Report #{selectedReport.pr_id}</h2>
                      <p className="mt-2 text-sm capitalize">Category: {result?.category || '-'}</p>
                      <p className="mt-1 text-sm">Risk: {result?.riskLevel || '-'}</p>
                      <p className="mt-1 text-sm">Score: {result?.totalScore ?? '-'}</p>
                      <p className="mt-1 text-sm">Recommendation: {result?.recommendation || '-'}</p>

                      {result?.summary ? (
                        <div className={`mt-4 rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                          <p className="font-semibold">Summary ({result.summaryLanguage || 'en'})</p>
                          <p className="mt-1 whitespace-pre-line">{result.summary}</p>
                        </div>
                      ) : null}

                      {Array.isArray(result?.responseDetails) && result.responseDetails.length > 0 ? (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-semibold">Response Details</p>
                          {result.responseDetails.map((entry, index) => (
                            <div
                              key={`${entry.questionId}-${index}`}
                              className={`rounded-lg border px-3 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}
                            >
                              <p className="font-medium">{index + 1}. {entry.questionText}</p>
                              <p className="mt-1">Answer: {entry.selectedOptionText}</p>
                              <p className="mt-1 text-xs opacity-80">Score: {entry.score}{entry.redFlag ? ' | Red flag: Yes' : ''}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-sm">Select a report to view details.</p>
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
