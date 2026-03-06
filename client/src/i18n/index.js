import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enLanding from './locales/en/landing.json';
import mrCommon from './locales/mr/common.json';
import mrLanding from './locales/mr/landing.json';

const savedLanguage = localStorage.getItem('mediconnect-language');
const initialLanguage = savedLanguage === 'mr' || savedLanguage === 'en' ? savedLanguage : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, landing: enLanding },
    mr: { common: mrCommon, landing: mrLanding },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  ns: ['common', 'landing'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
