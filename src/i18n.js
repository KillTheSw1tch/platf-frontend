import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импорт переводов
import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationDE from './locales/de.json';
import translationIT from './locales/it.json';

// Получаем язык из localStorage или используем английский по умолчанию
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(LanguageDetector) // Используем автоопределение языка
  .use(initReactI18next)  // Используем i18next с React
  .init({
    resources: {
      en: { translation: translationEN },
      fr: { translation: translationFR },
      de: { translation: translationDE },
      it: { translation: translationIT },
    },
    lng: savedLanguage, // Устанавливаем язык из localStorage
    fallbackLng: 'en',   // Язык по умолчанию, если сохранённый не найден
    interpolation: {
      escapeValue: false, // Отключаем экранирование
    },
  });

export default i18n;
