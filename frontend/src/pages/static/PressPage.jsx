import React from 'react';
import { Mail, Download, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function PressPage() {
    const { t } = useTranslation();
    const PRESS_RELEASES = [
        { date: t('press.releases.r1.date', 'Feb 15, 2026'), title: t('press.releases.r1.title', 'Toroongo Surpasses 1 Million Active Users'), excerpt: t('press.releases.r1.excerpt', 'The marketplace platform reaches a major milestone in its growth journey.') },
        { date: t('press.releases.r2.date', 'Jan 28, 2026'), title: t('press.releases.r2.title', 'Toroongo Launches Seller Storefront Customization'), excerpt: t('press.releases.r2.excerpt', 'New feature allows sellers to build fully branded storefronts.') },
        { date: t('press.releases.r3.date', 'Dec 10, 2025'), title: t('press.releases.r3.title', 'Toroongo Raises $25M Series A Funding'), excerpt: t('press.releases.r3.excerpt', 'Led by GlobalVentures Capital, the round will fund international expansion.') },
        { date: t('press.releases.r4.date', 'Oct 5, 2025'), title: t('press.releases.r4.title', 'Toroongo Partners with Leading Payment Providers'), excerpt: t('press.releases.r4.excerpt', 'New integrations with Stripe and PayPal enable faster checkout.') },
    ];

    const MEDIA_MENTIONS = [
        { outlet: 'TechCrunch', title: t('press.news.m1', 'Toroongo is building the Amazon-meets-Shopify hybrid'), url: '#' },
        { outlet: 'Forbes', title: t('press.news.m2', 'Top 10 E-commerce Startups to Watch in 2026'), url: '#' },
        { outlet: 'The Verge', title: t('press.news.m3', 'How Toroongo empowers small sellers to compete globally'), url: '#' },
    ];
    return (
        <div className="animate-fade-in">
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-3">{t('press.title')}</h1>
                    <p className="text-white/70 max-w-lg mx-auto">{t('press.subtitle')}</p>
                    <a href="mailto:press@toroongo.com" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors">
                        <Mail size={14} /> {t('press.emailUs')}
                    </a>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Press Releases */}
                <h2 className="text-2xl font-bold text-text-primary mb-6">{t('press.releases')}</h2>
                <div className="space-y-4 mb-16">
                    {PRESS_RELEASES.map((item, idx) => (
                        <div key={idx} className="p-5 border border-border-soft rounded-2xl hover:border-brand-primary/20 transition-colors">
                            <span className="text-xs text-text-muted">{item.date}</span>
                            <h3 className="text-lg font-semibold text-text-primary mt-1">{item.title}</h3>
                            <p className="text-sm text-text-muted mt-1.5 leading-relaxed">{item.excerpt}</p>
                            <button className="flex items-center gap-1 mt-3 text-xs font-medium text-brand-primary hover:text-brand-secondary">
                                {t('press.readMore')} <ExternalLink size={11} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Media Mentions */}
                <h2 className="text-2xl font-bold text-text-primary mb-6">{t('press.news')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                    {MEDIA_MENTIONS.map((m, idx) => (
                        <a key={idx} href={m.url} className="block p-5 border border-border-soft rounded-2xl hover:border-brand-primary/20 transition-colors">
                            <span className="text-xs font-bold text-brand-primary uppercase">{m.outlet}</span>
                            <p className="text-sm font-medium text-text-primary mt-2 leading-snug">{m.title}</p>
                        </a>
                    ))}
                </div>

                {/* Brand Assets */}
                <div className="bg-surface-bg rounded-2xl p-8 border border-border-soft text-center">
                    <h3 className="text-lg font-bold text-text-primary mb-2">{t('press.assets')}</h3>
                    <p className="text-sm text-text-muted mb-4">{t('press.assetsDesc')}</p>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        <Download size={14} /> {t('press.download')}
                    </button>
                </div>
            </div>
        </div>
    );
}
