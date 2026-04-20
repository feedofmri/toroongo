import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ne', label: 'नेपाली (Nepali)' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'ms', label: 'Bahasa Melayu' },
    { code: 'ar', label: 'العربية (Arabic)', dir: 'rtl' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const checkRtl = (langCode) => {
        const langInfo = LANGUAGES.find(l => l.code === langCode);
        document.documentElement.dir = langInfo?.dir === 'rtl' ? 'rtl' : 'ltr';
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        checkRtl(lng);
        setIsOpen(false);
    };

    // Outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Force RTL on initial load if Arabic is selected
    useEffect(() => {
        checkRtl(i18n.language);
    }, [i18n.language]);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language?.split('-')[0]) || LANGUAGES[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                aria-label="Change Language"
            >
                <Languages size={20} />
                <span className="hidden lg:block text-sm font-medium uppercase tracking-wider">{currentLang.code}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-border-soft overflow-hidden z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-border-soft bg-surface-bg/50">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Language</p>
                    </div>
                    <div className="p-1.5 flex flex-col gap-0.5">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${i18n.language?.startsWith(lang.code) ? 'text-brand-primary bg-brand-primary/5 font-semibold' : 'text-text-primary hover:bg-surface-bg'}`}
                            >
                                {lang.label}
                                {i18n.language?.startsWith(lang.code) && <Check size={14} className="text-brand-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
