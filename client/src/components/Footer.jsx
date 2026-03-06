import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

function Footer() {
  const { t } = useTranslation('common');
  const { isDark } = useTheme();

  return (
    <footer className={`mt-auto border-t py-8 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-blue-100 bg-white'}`}>
      <div
        className={`mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 text-sm md:flex-row md:items-center md:justify-between md:px-10 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
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
