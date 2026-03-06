import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

function Footer() {
  const { t } = useTranslation('common');
  const { isDark } = useTheme();

  return (
    <footer className={`fixed inset-x-0 bottom-0 z-40 border-t ${isDark ? 'border-slate-700 bg-slate-900' : 'border-blue-100 bg-white'}`}>
      <div
        className={`mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm md:flex-row md:items-center md:justify-between md:px-6 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        <p>&copy; {new Date().getFullYear()} MediConnect. {t('footer.rights')}</p>
        <div className="flex items-center gap-4">
          <a href="#home" className="transition hover:text-blue-600">
            {t('footer.privacy')}
          </a>
          <a href="#home" className="transition hover:text-blue-600">
            {t('footer.terms')}
          </a>
          <a href="#home" className="transition hover:text-blue-600">
            {t('footer.contact')}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
