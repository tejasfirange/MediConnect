import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { t, i18n } = useTranslation('common');
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('mediconnect-language');
    return saved === 'mr' || saved === 'en' ? saved : 'en';
  });
  const languageMenuRef = useRef(null);
  const location = useLocation();
  const onLanding = location.pathname === '/';

  const navItems = [
    { key: 'nav.features', href: onLanding ? '#features' : '/#features' },
    { key: 'nav.howItWorks', href: onLanding ? '#how-it-works' : '/#how-it-works' },
    { key: 'nav.forClinics', href: onLanding ? '#for-clinics' : '/#for-clinics' },
  ];

  const languages = [
    { code: 'en', label: t('nav.english') },
    { code: 'mr', label: t('nav.marathi') },
  ];

  useEffect(() => {
    localStorage.setItem('mediconnect-language', language);
    i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur ${
        isDark ? 'border-slate-700 bg-slate-900/85' : 'border-blue-100/80 bg-white/85'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="group inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white transition-transform duration-200 group-hover:scale-105">
            M
          </span>
          <span className={`text-lg font-semibold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {t('brand')}
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={() => setLanguageOpen((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isDark
                  ? 'border-slate-600 text-slate-100 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              aria-label={t('nav.language')}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </svg>
              {language === 'en' ? t('nav.english') : t('nav.marathi')}
            </button>

            {languageOpen && (
              <div
                className={`absolute right-0 mt-2 w-40 rounded-lg border p-1 shadow-lg ${
                  isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                {languages.map((item) => {
                  const selected = item.code === language;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setLanguageOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                        isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-blue-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-blue-600">{selected ? '\u2713' : ''}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              isDark
                ? 'border-slate-600 text-slate-100 hover:bg-slate-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDark ? t('nav.themeLight') : t('nav.themeDark')}
          </button>
          <Link
            to="/login"
            className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            {t('nav.signIn')}
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            {t('nav.getStarted')}
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`inline-flex rounded-lg border p-2 transition md:hidden ${
            isDark
              ? 'border-slate-600 text-slate-100 hover:bg-slate-800'
              : 'border-blue-200 text-slate-700 hover:bg-blue-50'
          }`}
          aria-label="Toggle menu"
        >
          <span className="text-sm font-semibold">{t('nav.menu')}</span>
        </button>
      </nav>

      {menuOpen && (
        <div className={`border-t px-4 py-3 md:hidden ${isDark ? 'border-slate-700 bg-slate-900' : 'border-blue-100 bg-white'}`}>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition hover:text-blue-600 ${
                    isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setLanguage((prev) => (prev === 'en' ? 'mr' : 'en'))}
              className={`w-1/2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                isDark ? 'border-slate-600 text-slate-100' : 'border-slate-300 text-slate-700'
              }`}
            >
              {language === 'en' ? `${t('nav.english')} \u2713` : `${t('nav.marathi')} \u2713`}
            </button>
            <button
              onClick={toggleTheme}
              className={`w-1/2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                isDark ? 'border-slate-600 text-slate-100' : 'border-slate-300 text-slate-700'
              }`}
            >
              {isDark ? t('nav.themeLight') : t('nav.themeDark')}
            </button>
            <Link to="/login" className="w-1/2 rounded-lg border border-blue-200 px-3 py-2 text-center text-sm font-semibold text-blue-700">
              {t('nav.signIn')}
            </Link>
            <Link to="/register" className="w-1/2 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white">
              {t('nav.getStarted')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
