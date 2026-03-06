import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sparkles, Activity, ShieldAlert, ClipboardList, CalendarClock, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Landing.css';

function Landing() {
  const { t } = useTranslation('landing');
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const isDoctor = user?.role === 'doctor';

  const pageClass = `landing-page min-h-screen relative overflow-hidden ${isDark ? 'theme-dark bg-slate-950 text-slate-100' : 'bg-[#f8faff] text-slate-900'}`;

  return (
    <div id="home" className={pageClass}>
      {isDark && (
        <>
          <div className="dashboard-orb dashboard-orb--blue" aria-hidden="true" />
          <div className="dashboard-orb dashboard-orb--sky" aria-hidden="true" />
          <div className="dashboard-orb dashboard-orb--violet" aria-hidden="true" />
        </>
      )}
      <Navbar />

      <main className="relative z-10 isolate">
        {/* ─── Hero Section ─── */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 md:px-12 md:pt-16 lg:pt-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1 lg:pr-10">
              <div className="space-y-8">
                <p
                  className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] ${
                    isDark
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                      : 'border-blue-200 bg-blue-50 text-blue-600'
                  }`}
                >
                  {t('badge')}
                </p>
                <h1 className={`text-4xl font-extrabold leading-[1.12] tracking-tight md:text-5xl lg:text-6xl ${isDark ? 'text-slate-100' : 'text-slate-900 font-black'}`}>
                  {t('heroTitle')}
                </h1>
                <p className={`max-w-xl text-lg leading-relaxed md:text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('heroText')}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to={isAuthenticated ? (isDoctor ? '/dashboard' : '/assessment') : '/login'}
                    className="rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-blue-500/35 active:translate-y-0"
                  >
                    {isAuthenticated && isDoctor ? 'Go to Dashboard' : t('startAssessment')}
                  </Link>
                  <a
                    href="#how-it-works"
                    className={`rounded-xl border px-8 py-4 text-base font-bold transition duration-300 hover:-translate-y-1 active:translate-y-0 ${
                      isDark
                        ? 'border-slate-700 bg-slate-900/50 text-slate-100 hover:border-slate-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/10'
                    }`}
                  >
                    {t('watchDemo')}
                  </a>
                </div>

                <div className="flex flex-wrap gap-10 pt-6 border-t md:pt-8" style={{ borderColor: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.7)' }}>
                  <div>
                    <p className="text-3xl font-black tracking-tighter text-blue-600">98%</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('stat1')}
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tighter text-blue-600">3x</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('stat2')}
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tighter text-blue-600">24/7</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('stat3')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Content */}
            <div className="relative order-1 lg:order-2">
              <div className="relative mx-auto max-w-[540px] lg:max-w-none">
                {/* Main Illustration Wrapper */}
                <div className="relative z-10 w-full rounded-[2.5rem] bg-blue-600/5 p-3 ring-1 ring-blue-500/10 md:p-5">
                  <img
                    src="/hero.png"
                    alt="MediConnect Healthcare Hero"
                    className="w-full rounded-[2rem] shadow-2xl transition duration-500 hover:scale-[1.01]"
                  />

                  {/* Floating Risk Card */}
                  <div className="absolute -bottom-6 -left-6 hidden w-72 sm:block lg:-bottom-10 lg:-left-12">
                    <div
                      className={`hero-card rounded-[2rem] border p-6 shadow-2xl ${
                        isDark
                          ? 'border-slate-700 bg-slate-900/90 shadow-black/60 backdrop-blur-xl'
                          : 'border-blue-50/50 bg-white/90 shadow-blue-200/50 backdrop-blur-xl'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2 className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {t('liveRiskTitle')}
                        </h2>
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      </div>

                      <div className="mt-5 space-y-4">
                        <div className={`rounded-xl border-l-[3px] border-l-blue-500 p-3.5 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                          <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('symptom')}</p>
                          <p className={`mt-0.5 text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('symptomValue')}</p>
                        </div>

                        <div className={`rounded-xl border p-3.5 ${isDark ? 'border-orange-500/20 bg-orange-500/5' : 'border-orange-100 bg-orange-50/40'}`}>
                          <div className="flex items-center justify-between">
                            <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{t('riskLevel')}</p>
                            <span className="text-[10px] font-black tracking-widest uppercase text-orange-600">{t('riskHigh')}</span>
                          </div>
                          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-orange-500/20">
                            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative background blur */}
                <div className="absolute -z-10 -right-10 -top-10 h-64 w-64 rounded-full bg-blue-400/20 blur-[100px]" />
                <div className="absolute -z-10 -left-10 -bottom-10 h-64 w-64 rounded-full bg-violet-400/20 blur-[100px]" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section id="features" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <div className="flex flex-col items-center text-center">
            <h3 className={`text-3xl font-black tracking-tight sm:text-4xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {t('featuresTitle')}
            </h3>
            <div className="mt-5 h-1.5 w-16 rounded-full bg-blue-600" />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <article className={`group rounded-[2.5rem] border p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:shadow-black/40' : 'border-blue-50 bg-white hover:shadow-blue-200/20'}`}>
              <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Activity size={32} />
              </div>
              <h4 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('feature1Title')}</h4>
              <p className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t('feature1Text')}</p>
            </article>

            <article className={`group rounded-[2.5rem] border p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:shadow-black/40' : 'border-blue-50 bg-white hover:shadow-blue-200/20'}`}>
              <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-50 text-violet-600'}`}>
                <ShieldAlert size={32} />
              </div>
              <h4 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('feature2Title')}</h4>
              <p className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t('feature2Text')}</p>
            </article>

            <article className={`group rounded-[2.5rem] border p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:shadow-black/40' : 'border-blue-50 bg-white hover:shadow-blue-200/20'}`}>
              <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <Sparkles size={32} />
              </div>
              <h4 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('feature3Title')}</h4>
              <p className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t('feature3Text')}</p>
            </article>
          </div>
        </section>

        {/* ─── How it Works ─── */}
        <section id="how-it-works" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12">
          <div className="flex flex-col items-center text-center">
            <h3 className={`text-3xl font-black tracking-tight sm:text-4xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {t('howTitle')}
            </h3>
            <div className="mt-5 h-1.5 w-16 rounded-full bg-blue-600" />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((num) => (
              <div key={num} className="group relative">
                <div className={`h-full rounded-[2.5rem] border p-10 transition-colors duration-300 ${isDark ? 'border-slate-800 bg-slate-900/30 group-hover:bg-slate-900/50' : 'border-slate-200 bg-white shadow-sm hover:border-blue-200'}`}>
                  <span className="text-5xl font-black text-blue-600/10 transition-colors duration-300 group-hover:text-blue-600/20">0{num}</span>
                  <p className={`mt-6 text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t(`step${num}`)}</p>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t(`step${num}Text`)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── For Clinics ─── */}
        <section id="for-clinics" className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-20 md:px-12">
          <div
            className={`overflow-hidden rounded-[3.5rem] p-12 md:p-16 lg:p-24 relative ${
              isDark ? 'bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl' : 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl shadow-blue-500/30'
            }`}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <h3 className={`text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl ${isDark ? 'text-slate-100' : 'text-white'}`}>
                {t('clinicsTitle')}
              </h3>
              <p className={`mt-8 max-w-2xl text-lg leading-relaxed md:text-xl ${isDark ? 'text-slate-400' : 'text-blue-100/90'}`}>
                {t('clinicsText')}
              </p>
              <button className={`mt-12 group rounded-2xl px-12 py-5 text-lg font-bold shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}>
                {t('requestSetup')}
                <ArrowRight size={20} className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Landing;
