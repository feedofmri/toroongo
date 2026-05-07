import React from 'react';
import { Link } from 'react-router-dom';
import { Store, TrendingUp, Globe, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SellOnToroongo() {
    const { t } = useTranslation();
    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('sell.hero.title')}</h1>
                    <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                        {t('sell.hero.subtitle')}
                    </p>
                    <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-text-primary font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                        {t('sell.hero.cta')} <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                    {[
                        { icon: Store, title: t('sell.features.f1.title'), desc: t('sell.features.f1.desc') },
                        { icon: TrendingUp, title: t('sell.features.f2.title'), desc: t('sell.features.f2.desc') },
                        { icon: Globe, title: t('sell.features.f3.title'), desc: t('sell.features.f3.desc') },
                        { icon: Zap, title: t('sell.features.f4.title'), desc: t('sell.features.f4.desc') },
                    ].map((item) => (
                        <div key={item.title} className="p-6 border border-border-soft rounded-2xl">
                            <item.icon size={24} className="text-brand-primary mb-3" />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* How it works */}
                <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">{t('sell.howItWorks.title')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                    {[
                        { step: '01', title: t('sell.howItWorks.s1.title'), desc: t('sell.howItWorks.s1.desc') },
                        { step: '02', title: t('sell.howItWorks.s2.title'), desc: t('sell.howItWorks.s2.desc') },
                        { step: '03', title: t('sell.howItWorks.s3.title'), desc: t('sell.howItWorks.s3.desc') },
                    ].map((item) => (
                        <div key={item.step} className="text-center">
                            <div className="w-12 h-12 bg-brand-primary text-white font-bold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">{item.step}</div>
                            <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                            <p className="text-sm text-text-muted">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing */}
                <div className="bg-surface-bg rounded-2xl p-8 border border-border-soft text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">{t('sell.pricing.title')}</h2>
                    <p className="text-text-muted text-sm mb-6">{t('sell.pricing.subtitle')}</p>
                    <ul className="max-w-sm mx-auto space-y-2 mb-6 text-left">
                        {t('sell.pricing.features', { returnObjects: true }).map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                                <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {item}
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => alert(t('common.underDevelopment', 'Under development'))}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-bg text-text-primary border border-border-soft font-semibold rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto"
                        >
                            {t('sell.pricing.viewPlans')}
                        </button>
                        <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors w-full sm:w-auto">
                            {t('sell.pricing.signup')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
