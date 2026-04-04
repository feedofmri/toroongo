import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DataPreferences() {
    const { t } = useTranslation();
    const sections = t('dataPreferences.sections', { returnObjects: true }) || [];

    return (
        <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-text-primary mb-2">{t('dataPreferences.title')}</h1>
            <p className="text-sm text-text-muted mb-8">{t('dataPreferences.lastUpdated')}</p>

            <div className="space-y-6 text-sm text-text-muted leading-relaxed">
                {sections.map((section, idx) => (
                    <section key={idx}>
                        <h2 className="text-lg font-semibold text-text-primary mb-2">{section.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                        {section.items && (
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                {section.items.map((item, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                ))}
                            </ul>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}
