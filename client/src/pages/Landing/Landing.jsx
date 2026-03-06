import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import './Landing.css';

function Landing() {
  const { t } = useTranslation('landing');
  const { isDark } = useTheme();

  const pageClass = `landing-page min-h-screen pb-24 ${isDark ? 'theme-dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`;

  return (
    <div id="home" className={pageClass}>
      <Navbar />

      <main className="relative isolate overflow-hidden">
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-14 md:px-6 lg:grid-cols-2 lg:pt-20">

          <div>
            <img src="/hero.png" alt="MediConnect Healthcare Hero" />
          </div>

          <div className="space-y-6">
            <p
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'border-blue-400/40 bg-blue-500/10 text-blue-300' : 'border-blue-200 bg-blue-50 text-blue-700'
              }`}
            >
              {t('badge')}
            </p>
            <h1 className={`text-4xl font-bold leading-tight tracking-tight md:text-5xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {t('heroTitle')}
            </h1>
            <p className={`max-w-xl text-base leading-7 md:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('heroText')}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                {t('startAssessment')}
              </Link>
              <a href="#how-it-works" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-blue-200 hover:text-blue-700">
                {t('watchDemo')}
              </a>
            </div>

            <div className={`flex flex-wrap gap-6 pt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <div>
                <p className="text-2xl font-bold text-blue-700">98%</p>
                <p>{t('stat1')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">3x</p>
                <p>{t('stat2')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">24/7</p>
                <p>{t('stat3')}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className={`hero-card rounded-3xl border p-6 shadow-xl md:p-8 ${
                isDark ? 'border-slate-700 bg-slate-900 shadow-blue-950/30' : 'border-blue-100 bg-white shadow-blue-100/50'
              }`}
            >
              <h2 className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('liveRiskTitle')}</h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('liveRiskSub')}</p>

              <div className="mt-6 space-y-4">
                <div className={`rounded-xl border p-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('symptom')}</p>
                  <p className={`mt-1 font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('symptomValue')}</p>
                </div>

                <div className={`rounded-xl border p-4 ${isDark ? 'border-blue-400/30 bg-blue-950/40' : 'border-blue-100 bg-blue-50'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-blue-900">{t('riskLevel')}</p>
                    <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">{t('riskHigh')}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                    <div className="h-full w-4/5 rounded-full bg-blue-600" />
                  </div>
                </div>

                <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  {t('notify')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
          <h3 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('featuresTitle')}</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-blue-100 bg-white'}`}>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('feature1Title')}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('feature1Text')}</p>
            </article>
            <article className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-blue-100 bg-white'}`}>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('feature2Title')}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('feature2Text')}</p>
            </article>
            <article className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-900' : 'border-blue-100 bg-white'}`}>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('feature3Title')}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('feature3Text')}</p>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
          <h3 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('howTitle')}</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <p className="text-sm font-semibold text-blue-700">1. {t('step1')}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('step1Text')}</p>
            </div>
            <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <p className="text-sm font-semibold text-blue-700">2. {t('step2')}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('step2Text')}</p>
            </div>
            <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <p className="text-sm font-semibold text-blue-700">3. {t('step3')}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('step3Text')}</p>
            </div>
          </div>
        </section>

        <section id="for-clinics" className="mx-auto w-full max-w-6xl px-4 pb-14 pt-12 md:px-6">
          <div
            className={`rounded-3xl border p-6 md:p-8 ${
              isDark ? 'border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800' : 'border-blue-100 bg-gradient-to-r from-white to-blue-50'
            }`}
          >
            <h3 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('clinicsTitle')}</h3>
            <p className={`mt-2 max-w-2xl text-sm md:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('clinicsText')}
            </p>
            <button className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              {t('requestSetup')}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
