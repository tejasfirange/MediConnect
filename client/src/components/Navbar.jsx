import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, LogOut, Menu, Moon, Sun, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

function Navbar() {
  const { t, i18n } = useTranslation('common');
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('mediconnect-language');
    return saved === 'mr' || saved === 'en' ? saved : 'en';
  });
  const languageMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const onLanding = location.pathname === '/';
  const onDashboard = location.pathname.startsWith('/dashboard');

  const navItems = [
    { key: 'nav.features', href: onLanding ? '#features' : '/#features' },
    { key: 'nav.howItWorks', href: onLanding ? '#how-it-works' : '/#how-it-works' },
    { key: 'nav.forClinics', href: onLanding ? '#for-clinics' : '/#for-clinics' },
  ];

  const languages = [
    { code: 'en', label: t('nav.english') },
    { code: 'mr', label: t('nav.marathi') },
  ];

  const userInitial = user?.email?.charAt(0)?.toUpperCase() || 'U';

  useEffect(() => {
    localStorage.setItem('mediconnect-language', language);
    i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? 'border-b border-slate-800/80 bg-slate-950/80'
          : 'border-b border-slate-200/60 bg-white/80'
      }`}
      style={{ WebkitBackdropFilter: 'blur(16px)' }}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        {/* ─── Logo ─── */}
        <Link to="/" className="group inline-flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105">
            M
          </span>
          <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {t('brand')}
          </span>
        </Link>

        {/* ─── Desktop Nav Links ─── */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* ─── Desktop Right Section ─── */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Language Switcher */}
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={() => setLanguageOpen((prev) => !prev)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label={t('nav.language')}
              title={language === 'en' ? t('nav.english') : t('nav.marathi')}
            >
              <Globe size={18} />
            </button>

            {languageOpen && (
              <div
                className={`absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border p-1 shadow-xl transition-all ${
                  isDark ? 'border-slate-700 bg-slate-900 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/80'
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
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                        selected
                          ? isDark
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-blue-50 text-blue-600'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {selected && (
                        <span className="text-blue-500">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
              isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-amber-400'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? t('nav.themeLight') : t('nav.themeDark')}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth Section */}
          {isAuthenticated ? (
            <>
              {!onDashboard && (
                <Link
                  to="/dashboard"
                  className="ml-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Dashboard
                </Link>
              )}

              {/* Profile Avatar + Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="ml-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-transform duration-200 hover:scale-105"
                  aria-label="Profile menu"
                >
                  {userInitial}
                </button>

                {profileOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border p-1.5 shadow-xl ${
                      isDark ? 'border-slate-700 bg-slate-900 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/80'
                    }`}
                  >
                    {/* User info */}
                    <div className={`rounded-lg px-3 py-2.5 ${isDark ? 'bg-slate-800/60' : 'bg-slate-50'}`}>
                      <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Signed in as</p>
                      <p className={`mt-0.5 truncate text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        {user?.email || 'User'}
                      </p>
                    </div>

                    <div className={`my-1.5 h-px ${isDark ? 'bg-slate-700/60' : 'bg-slate-200/80'}`} />

                    {/* Dashboard link (if not on dashboard) */}
                    {!onDashboard && (
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <User size={16} />
                        Dashboard
                      </Link>
                    )}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`ml-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
              >
                {t('nav.getStarted')}
              </Link>
            </>
          )}
        </div>

        {/* ─── Mobile Menu Button ─── */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition md:hidden ${
            isDark
              ? 'text-slate-300 hover:bg-slate-800'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* ─── Mobile Menu ─── */}
      {menuOpen && (
        <div
          className={`border-t px-4 pb-4 pt-3 md:hidden ${
            isDark ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200/60 bg-white/95'
          }`}
          style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center gap-2 border-t pt-3" style={{ borderColor: isDark ? 'rgb(30 41 59 / 0.6)' : 'rgb(226 232 240 / 0.6)' }}>
            {/* Language toggle */}
            <button
              onClick={() => setLanguage((prev) => (prev === 'en' ? 'mr' : 'en'))}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe size={16} />
              {language === 'en' ? t('nav.english') : t('nav.marathi')}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? t('nav.themeLight') : t('nav.themeDark')}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {!onDashboard && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/20"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/20"
                >
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
