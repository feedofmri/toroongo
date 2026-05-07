import React from 'react';
import { useTranslation } from 'react-i18next';

function LegalPage({ title, lastUpdated, children }) {
    return (
        <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-text-primary mb-2">{title}</h1>
            <p className="text-sm text-text-muted mb-8">{lastUpdated}</p>
            <div className="prose prose-sm prose-slate max-w-none text-text-muted leading-relaxed space-y-6">
                {children}
            </div>
        </div>
    );
}

export function TermsOfService() {
    const { t } = useTranslation();
    const sections = t('legal.terms.sections', { returnObjects: true }) || [];

    return (
        <LegalPage title={t('legal.terms.title')} lastUpdated={t('legal.terms.lastUpdated')}>
            {sections.map((section, idx) => (
                <section key={idx}>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">{section.title}</h2>
                    <p>{section.content}</p>
                </section>
            ))}
        </LegalPage>
    );
}

export function PrivacyPolicy() {
    const { t } = useTranslation();
    const sections = t('legal.privacy.sections', { returnObjects: true }) || [];

    return (
        <LegalPage title={t('legal.privacy.title')} lastUpdated={t('legal.privacy.lastUpdated')}>
            {sections.map((section, idx) => (
                <section key={idx}>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">{section.title}</h2>
                    <p>{section.content}</p>
                </section>
            ))}
        </LegalPage>
    );
}

export function CookiePolicy() {
    const { t } = useTranslation();
    const sections = t('legal.cookies.sections', { returnObjects: true }) || [];

    return (
        <LegalPage title={t('legal.cookies.title')} lastUpdated={t('legal.cookies.lastUpdated')}>
            {sections.map((section, idx) => (
                <section key={idx}>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">{section.title}</h2>
                    <p>{section.content}</p>
                </section>
            ))}
        </LegalPage>
    );
}

export function SellerAgreement() {
    const { t } = useTranslation();
    const sections = t('legal.sellerAgreement.sections', { returnObjects: true }) || [];

    return (
        <LegalPage title={t('legal.sellerAgreement.title')} lastUpdated={t('legal.sellerAgreement.lastUpdated')}>
            {sections.map((section, idx) => (
                <section key={idx}>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">{section.title}</h2>
                    <p>{section.content}</p>
                </section>
            ))}
        </LegalPage>
    );
}

export function SocialImpact() {
    const { t } = useTranslation();
    const sections = t('legal.impact.sections', { returnObjects: true }) || [];

    return (
        <LegalPage title={t('legal.impact.title')} lastUpdated={t('legal.impact.lastUpdated')}>
            {sections.map((section, idx) => (
                <section key={idx}>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">{section.title}</h2>
                    <p>{section.content}</p>
                </section>
            ))}
        </LegalPage>
    );
}

