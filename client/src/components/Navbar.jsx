import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, LogOut, Menu, Moon, Sun, User, X, Activity } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const onLanding = location.pathname === '/';
  const onDashboard = location.pathname.startsWith('/dashboard');

  const navItems = [
    { key: 'nav.features', href: onLanding ? '#features' : '/#features' },
    { key: 'nav.howItWorks', href: onLanding ? '#how-it-works' : '/#how-it-works' },
    { key: 'nav.forClinics', href: onLanding ? '#for-clinics' : '/#for-clinics' },
  ];

  // Always show Health Tests and preventative tools for everyone
  navItems.push({ 
    key: 'nav.healthTests',
    label: 'Health Tests',
    href: '/tests' 
  });

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

  // Handle scroll shadow and sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-[60] transition-all duration-300 ${
        scrolled 
          ? isDark 
            ? 'bg-slate-950/90 border-b border-slate-800/80 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-b border-slate-200/80 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)]'
          : 'bg-transparent border-b border-transparent'
      } backdrop-blur-md`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        {/* ─── Logo & Branding ─── */}
        <Link to="/" className="group flex items-center gap-1.5">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <img 
              src="/logo.png" 
              alt="MediConnect Logo" 
              className="h-8 w-8 object-contain brightness-0 invert" 
            />
          </div>
          <span className={`text-xl font-[800] tracking-tighter ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Medi<span className="text-blue-500">Connect</span>
          </span>
        </Link>

        {/* ─── Desktop Nav Links ─── */}
        <ul className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <li key={item.key || item.href}>
              <a
                href={item.href}
                className={`group relative rounded-lg px-4 py-2 text-[13px] font-bold tracking-wide transition-all duration-200 ${
                  isDark
                    ? 'text-slate-400 hover:text-slate-100'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.key?.includes('nav.') ? t(item.key) : item.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 scale-x-0 bg-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* ─── Desktop Right Section ─── */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme & Language Utilities */}
          <div className={`flex items-center gap-1 rounded-2xl border p-1 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-100/50'}`}>
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setLanguageOpen((prev) => !prev)}
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                  isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Globe size={16} />
              </button>
              {languageOpen && (
                <div className={`absolute right-0 mt-3 w-40 overflow-hidden rounded-2xl border p-1.5 shadow-2xl ${
                  isDark ? 'border-slate-800 bg-slate-900 shadow-black/40' : 'border-slate-200 bg-white shadow-slate-200/50'
                }`}>
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => { setLanguage(item.code); setLanguageOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold transition ${
                        item.code === language 
                          ? 'bg-blue-600 text-white' 
                          : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                isDark ? 'text-slate-400 hover:text-amber-400' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Auth Section */}
          {isAuthenticated ? (
            <>
              {!onDashboard && (
                <Link
                  to="/dashboard"
                  className="relative overflow-hidden rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 active:translate-y-0"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
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
                        <Activity size={16} />
                        Dashboard
                      </Link>
                    )}

                    {/* Profile Link */}
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User size={16} />
                      My Profile
                    </Link>

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
              <li key={item.key || item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.key?.includes('nav.') ? t(item.key) : item.label}
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
              <div className="flex flex-col w-full gap-1">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User size={16} />
                  Profile
                </Link>
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
              </div>
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
