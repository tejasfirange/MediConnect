import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, CalendarClock, ClipboardList, GlassWater, History, LogOut, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import RiskMeter from '../../components/RiskMeter';
import { getPatientHistory } from '../../services/patientService';
import './Dashboard.css';

function toTitleCase(value) {
  if (!value) return 'No data';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
}

function Dashboard() {
  const { isDark } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        const data = await getPatientHistory();
        if (!mounted) return;
        setReports(data);
      } catch (error) {
        if (!mounted) return;
        toast.error(error.message || 'Unable to load dashboard data');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const latestReport = reports[0]?.report || null;

  const summary = useMemo(() => {
    if (!latestReport) {
      return {
        lastRisk: 'No data',
        totalAssessments: reports.length,
        lastAssessmentText: 'No assessments yet',
      };
    }

    return {
      lastRisk: toTitleCase(latestReport.riskLevel),
      totalAssessments: reports.length,
      lastAssessmentText: `Latest report #${reports[0]?.pr_id || '-'}`,
    };
  }, [latestReport, reports]);

  return (
    <div className={`dashboard-page min-h-screen pb-24 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
        <section className={`dashboard-shell rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-white/70 bg-white/80'}`}>
          <div className="dashboard-hero">
            <p className={`text-xs uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>MediConnect</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Health Dashboard</h1>
            <p className={`mt-2 max-w-2xl text-sm md:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Track your latest risk signals, review assessment activity, and take your next health check with a clearer workflow.
            </p>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className={`h-28 animate-pulse rounded-2xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'}`} />
              ))}
            </div>
          ) : (
            <>
              <section className="mt-8">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                  <div className={`dashboard-metric rounded-2xl border p-5 shadow-sm lg:col-span-4 ${isDark ? 'border-slate-700 bg-slate-800/90 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/80'}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last Risk Level</p>
                      <ShieldAlert size={18} className="text-amber-500" />
                    </div>
                    <p className="mt-4">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">{summary.lastRisk}</span>
                    </p>
                  </div>

                  <div className={`dashboard-metric rounded-2xl border p-5 shadow-sm lg:col-span-4 ${isDark ? 'border-slate-700 bg-slate-800/90 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/80'}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Assessments</p>
                      <ClipboardList size={18} className="text-blue-600" />
                    </div>
                    <p className="mt-3 text-4xl font-black leading-none">{summary.totalAssessments}</p>
                  </div>

                  <div className={`dashboard-metric rounded-2xl border p-5 shadow-sm lg:col-span-4 ${isDark ? 'border-slate-700 bg-slate-800/90 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/80'}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last Check</p>
                      <CalendarClock size={18} className="text-violet-500" />
                    </div>
                    <p className="mt-3 text-xl font-bold">{summary.lastAssessmentText}</p>
                  </div>
                </div>
              </section>

              <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-12">
                <div className="xl:col-span-7">
                  <RiskMeter riskLevel={latestReport?.riskLevel || 'low'} totalScore={latestReport?.totalScore || 0} />
                </div>
                <div className={`rounded-2xl border p-6 shadow-sm xl:col-span-5 ${isDark ? 'border-slate-700 bg-gradient-to-br from-slate-800 to-slate-700 shadow-black/20' : 'border-sky-100 bg-gradient-to-br from-sky-50 to-white shadow-sky-100/80'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <GlassWater size={18} className="text-blue-600" />
                        <p className="text-sm font-semibold">Quick Tip</p>
                      </div>
                      <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Drink enough water and track symptoms regularly. Small daily checks can prevent delayed treatment.
                      </p>
                    </div>
                    <div className={`hidden rounded-xl px-3 py-2 text-xs font-semibold md:block ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-500'}`}>
                      Wellness
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          <section className="mt-8">
            <div className="flex flex-wrap gap-3">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-700"
              >
                <Activity size={18} />
                Start Assessment
              </Link>
              <Link
                to="/history"
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:scale-[1.02] ${
                  isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <History size={18} />
                Past History
              </Link>
              <button
                onClick={handleLogout}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:scale-[1.02] ${
                  isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
