import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  GlassWater,
  Heart,
  History,
  LogOut,
  Settings,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  User,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getPatientHistory } from '../../services/patientService';
import api from '../../services/api';
import DoctorDashboard from './DoctorDashboard';
import './Dashboard.css';

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getFirstName(email, fallback) {
  if (!email) return fallback;
  const local = email.split('@')[0] || '';
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : fallback;
}

function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { isDark } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [profile, setProfile] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);

  const healthTips = useMemo(
    () => [
      { icon: GlassWater, tip: t('quickTip.tips.0') },
      { icon: Heart, tip: t('quickTip.tips.1') },
      { icon: TrendingUp, tip: t('quickTip.tips.2') },
      { icon: Sparkles, tip: t('quickTip.tips.3') },
    ],
    [t]
  );

  useEffect(() => {
    // If the user is a doctor, we don't need to load patient-specific reports/profile
    if (user?.role === 'doctor') {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadDashboardData() {
      try {
        const historyData = await getPatientHistory();
        if (!mounted) return;
        setReports(historyData);
        
        try {
          const profileData = await api.get('/patient/me');
          if (mounted) setProfile(profileData.data.patient);
        } catch (e) {
          // Profile might not exist yet
          if (mounted) setProfile(null);
        }
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [healthTips.length]);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const latestReport = reports[0]?.report || null;

  const summary = useMemo(() => {
    if (!latestReport) {
      return {
        riskKey: 'noData',
        totalAssessments: reports.length,
        lastAssessmentText: t('noAssessments'),
      };
    }

    return {
      riskKey: (latestReport.riskLevel || 'low').toLowerCase(),
      totalAssessments: reports.length,
      lastAssessmentText: t('latestReport', { id: reports[0]?.pr_id || '-' }),
    };
  }, [latestReport, reports, t]);

  const translatedRisk = t(`riskLevels.${summary.riskKey}`, {
    defaultValue: t('riskLevels.noData'),
  });

  const riskChipClass = {
    critical: 'bg-red-500/15 text-red-600 border border-red-200',
    high: 'bg-orange-500/15 text-orange-600 border border-orange-200',
    moderate: 'bg-amber-500/15 text-amber-600 border border-amber-200',
    low: 'bg-emerald-500/15 text-emerald-600 border border-emerald-200',
    noData: 'bg-slate-500/15 text-slate-600 border border-slate-200',
  }[summary.riskKey] || 'bg-slate-500/15 text-slate-600 border border-slate-200';

  const riskChipClassDark = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    moderate: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    noData: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  }[summary.riskKey] || 'bg-slate-500/20 text-slate-300 border border-slate-500/30';

  const CurrentTipIcon = healthTips[tipIndex].icon;

  const actionCards = [
    {
      to: '/assessment',
      icon: Activity,
      title: t('actions.newAssessmentTitle'),
      desc: t('actions.newAssessmentDesc'),
      iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
      iconColor: 'text-blue-500',
      primary: true,
    },
    {
      to: '/history',
      icon: History,
      title: t('actions.viewHistoryTitle'),
      desc: t('actions.viewHistoryDesc'),
      iconBg: isDark ? 'bg-violet-500/20' : 'bg-violet-100',
      iconColor: 'text-violet-500',
    },
    {
      to: '/tests',
      icon: Target,
      title: 'Health Tools',
      desc: 'Quick diagnostics like BMI, Stress, and Lung tests.',
      iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      to: '/my-consultations',
      icon: User,
      title: 'My Consultations',
      desc: 'Check prescription status and review doctor advice.',
      iconBg: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100',
      iconColor: 'text-emerald-500',
    },
    {
      to: '/profile',
      icon: Settings,
      title: 'Profile Settings',
      desc: 'Update your personal and clinical information.',
      iconBg: isDark ? 'bg-amber-500/20' : 'bg-amber-100',
      iconColor: 'text-amber-500',
    },
    {
      to: '/dashboard',
      icon: LogOut,
      title: t('actions.logoutTitle'),
      desc: t('actions.logoutDesc'),
      iconBg: isDark ? 'bg-rose-500/20' : 'bg-rose-100',
      iconColor: 'text-rose-500',
      onClick: handleLogout,
    },
  ];

  if (user?.role === 'doctor') {
    return <DoctorDashboard />;
  }

  return (
    <div
      className={`dashboard-page min-h-screen flex flex-col ${
        isDark ? 'dashboard-page--dark bg-slate-950 text-slate-100' : 'dashboard-page--light bg-slate-50 text-slate-900'
      }`}
    >
      <div className="dashboard-orb dashboard-orb--blue" aria-hidden="true" />
      <div className="dashboard-orb dashboard-orb--sky" aria-hidden="true" />
      <div className="dashboard-orb dashboard-orb--violet" aria-hidden="true" />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-14 flex-1">
        <section className="dashboard-hero">
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('brandTag')}
          </p>

          {!loading && !profile?.name && (
            <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-between gap-4 ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500 text-white">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Complete Your Profile</p>
                  <p className="text-xs opacity-80 text-amber-700 dark:text-amber-400">Add your name and contact details for better prescriptions.</p>
                </div>
              </div>
              <Link to="/profile" className="px-4 py-2 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition">
                Set Up Now
              </Link>
            </div>
          )}
          <h1 className="dashboard-hero__greeting mt-2">
            {t(`greeting.${getGreetingKey()}`)},{' '}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              {profile?.name || getFirstName(user?.email, t('greeting.fallbackName'))}
            </span>{' '}
            <span className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>{'\u{1F44B}'}</span>
          </h1>
          <p className={`dashboard-hero__sub max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {reports.length > 0
              ? t('hero.welcomeWithReports', { count: reports.length, risk: translatedRisk })
              : t('hero.welcomeEmpty')}
          </p>
          <Link
            to="/assessment"
            className="dashboard-cta mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30"
          >
            <Activity size={18} />
            {t('ctaStartNew')}
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </section>

        {loading ? (
          <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`dashboard-skeleton h-32 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
              />
            ))}
          </section>
        ) : (
          <>
            <section className="mt-10">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div
                  className={`dashboard-stat dashboard-stat--risk-${summary.riskKey} dashboard-fadeIn rounded-2xl border p-5 ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/80 shadow-lg shadow-black/20'
                      : 'border-slate-200/80 bg-white shadow-md shadow-slate-200/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('metrics.lastRisk')}
                    </p>
                    <ShieldAlert size={18} className="text-amber-500" />
                  </div>
                  <div className="mt-4">
                    <span className={`inline-block rounded-full px-3.5 py-1.5 text-sm font-bold ${isDark ? riskChipClassDark : riskChipClass}`}>
                      {translatedRisk}
                    </span>
                  </div>
                </div>

                <div
                  className={`dashboard-stat dashboard-fadeIn rounded-2xl border p-5 ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/80 shadow-lg shadow-black/20'
                      : 'border-slate-200/80 bg-white shadow-md shadow-slate-200/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('metrics.totalAssessments')}
                    </p>
                    <ClipboardList size={18} className="text-blue-500" />
                  </div>
                  {/* This line seems to be intended for DoctorDashboard, but was placed here. Removing it to fix the issue. */}
                  {/* <p className="text-[10px] font-black uppercase text-blue-500 mt-2 tracking-widest">Case ID: {String(selectedConsult.id).toUpperCase()}</p> */}
                  <p className="mt-3 text-4xl font-black leading-none tracking-tight">{summary.totalAssessments}</p>
                </div>

                <div
                  className={`dashboard-stat dashboard-fadeIn rounded-2xl border p-5 ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/80 shadow-lg shadow-black/20'
                      : 'border-slate-200/80 bg-white shadow-md shadow-slate-200/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('metrics.lastCheck')}
                    </p>
                    <CalendarClock size={18} className="text-violet-500" />
                  </div>
                  <p className="mt-3 text-xl font-bold">{summary.lastAssessmentText}</p>
                </div>
              </div>
            </section>

            <section className="dashboard-tip mt-8">
              <div
                className={`rounded-2xl border p-6 ${
                  isDark
                    ? 'border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/80'
                    : 'border-sky-100 bg-gradient-to-br from-sky-50/80 to-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-sky-500/20' : 'bg-sky-100'}`}>
                    <CurrentTipIcon size={20} className="text-sky-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        {t('quickTip.title')}
                      </p>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-sky-100 text-sky-600'}`}>
                        {t('quickTip.tag')}
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-sm leading-relaxed transition-opacity duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                      key={tipIndex}
                      style={{ animation: 'fadeSlideUp 500ms ease both' }}
                    >
                      {healthTips[tipIndex].tip}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-center gap-1.5">
                  {healthTips.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTipIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === tipIndex
                          ? 'w-6 bg-sky-500'
                          : `w-1.5 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'}`
                      }`}
                      aria-label={`Tip ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-8">
              <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('actions.quickActions')}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {actionCards.map((card) => {
                  const Icon = card.icon;
                  const isButton = Boolean(card.onClick);

                  if (isButton) {
                    return (
                      <button
                        key={card.title}
                        onClick={card.onClick}
                        className={`dashboard-action group cursor-pointer rounded-2xl border p-5 text-left ${
                          isDark
                            ? 'border-slate-800 bg-slate-900/80'
                            : 'border-slate-200/80 bg-white'
                        }`}
                      >
                        <div className={`dashboard-action__icon ${card.iconBg}`}>
                          <Icon size={22} className={card.iconColor} />
                        </div>
                        <p className={`mt-3 text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{card.title}</p>
                        <p className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{card.desc}</p>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={card.title}
                      to={card.to}
                      className={`dashboard-action group rounded-2xl border p-5 ${
                        isDark
                          ? 'border-slate-800 bg-slate-900/80'
                          : 'border-slate-200/80 bg-white'
                      } ${card.primary ? (isDark ? 'ring-1 ring-blue-500/20' : 'ring-1 ring-blue-100') : ''}`}
                    >
                      <div className={`dashboard-action__icon ${card.iconBg}`}>
                        <Icon size={22} className={card.iconColor} />
                      </div>
                      <p className={`mt-3 text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{card.title}</p>
                      <p className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{card.desc}</p>
                      <div className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${card.primary ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-slate-500'} transition group-hover:gap-2`}>
                        {t('actions.open')}
                        <ArrowRight size={12} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
