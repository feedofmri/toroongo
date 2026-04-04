import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend) // Load translations from /public/locales
    .use(LanguageDetector) // Auto-detect language
    .use(initReactI18next) // Pass the i18n instance to react-i18next
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'bn', 'ne', 'ms', 'ar', 'id', 'hi'],
        interpolation: {
            escapeValue: false, // React already safeguards from XSS
        },
        detection: {
            // Check order for language detection
            order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'], // Save user's preference
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        }
    });

export default i18n;
