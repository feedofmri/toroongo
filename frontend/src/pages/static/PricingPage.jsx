import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, HelpCircle, Sparkles, ChevronDown, XCircle, Crown } from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import { useAuth } from '../../context/AuthContext';
import {
    PLANS, PLAN_ORDER, PLAN_CARD_FEATURES, PLAN_INCLUDES_LABEL,
    AI_FEATURES, FEATURES, getPlanIndex, canAccessFeature
} from '../../data/planConfig';
import PlanBadge from '../../components/subscription/PlanBadge';

export default function PricingPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const isSeller = isAuthenticated && user?.role === 'seller';
    const currentPlan = user?.plan || 'starter';

    const allFeaturesList = Object.entries(FEATURES).map(([key, feat]) => ({
        key,
        label: feat.label,
        starter: canAccessFeature('starter', key),
        pro: canAccessFeature('pro', key),
        business: canAccessFeature('business', key),
        enterprise: canAccessFeature('enterprise', key),
    }));

    const pricingPlans = PLAN_ORDER.map((planKey) => {
        const plan = PLANS[planKey];
        const features = PLAN_CARD_FEATURES[planKey];
        const includesLabel = PLAN_INCLUDES_LABEL[planKey];
        const aiFeatures = AI_FEATURES[planKey];
        const isCurrent = isSeller && currentPlan === planKey;
        const isUpgrade = isSeller && getPlanIndex(planKey) > getPlanIndex(currentPlan);
        const isDowngrade = isSeller && getPlanIndex(planKey) < getPlanIndex(currentPlan);

        let buttonText = plan.buttonText;
        let buttonAction = () => navigate('/signup');

        if (isSeller) {
            if (isCurrent) {
                buttonText = t('pricing.cta.currentPlan', 'Current Plan');
                buttonAction = () => navigate('/seller/subscription');
            } else if (isUpgrade) {
                buttonText = t('pricing.cta.upgrade', 'Upgrade');
                buttonAction = () => alert('Under development');
            } else if (isDowngrade) {
                buttonText = t('pricing.cta.downgrade', 'Downgrade');
                buttonAction = () => alert('Under development');
            }
        }

        return {
            ...plan,
            features,
            includesLabel,
            aiFeatures,
            isCurrent,
            isUpgrade,
            isDowngrade,
            buttonText,
            buttonAction,
        };
    });

    const faqs = [
        { q: t('pricing.faq.fee.q', 'Are there any transaction fees?'), a: t('pricing.faq.fee.a', 'No! You keep 100% of your sales with 0% platform transaction fees on all plans.') },
        { q: t('pricing.faq.countries.q', 'Which countries do you support?'), a: t('pricing.faq.countries.a', 'Toroongo is a global platform accessible from anywhere in the world! However, our platform is specially tailored and friendly for sellers and buyers in 6 core markets: Bangladesh, Nepal, Malaysia, United Arab Emirates (UAE), Indonesia, and India. We also dynamically support 7 languages based on the visitor\'s location to ensure a seamless experience.') },
        { q: t('pricing.faq.change.q', 'Can I change my plan later?'), a: t('pricing.faq.change.a', 'Yes, you can upgrade or downgrade your plan at any time from your seller dashboard.') },
        { q: t('pricing.faq.ai.q', 'How do the AI features work?'), a: t('pricing.faq.ai.a', 'Each tier unlocks powerful, easy-to-use AI tools designed specifically to save you time and increase your sales.') },
    ];

    return (
        <div className="animate-fade-in">
            <div className="bg-surface-bg border-b border-border-soft py-12 lg:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">{t('pricing.title', 'Pricing & Plans')}</h1>
                    <p className="text-xl text-text-muted">{t('pricing.subtitle', 'Choose the perfect tier for your business. No transaction fees, ever.')}</p>
                    {isSeller && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <span className="text-sm text-text-muted">Your current plan:</span>
                            <PlanBadge plan={currentPlan} size="md" />
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-4 mb-20">
                    {pricingPlans.map((plan) => (
                        <div key={plan.key} className={`bg-white rounded-2xl p-6 flex flex-col relative ${
                            plan.isCurrent
                                ? 'border-2 shadow-xl scale-100 xl:scale-105 z-10 ring-2 ring-offset-2'
                                : plan.highlight && !isSeller
                                    ? 'border-2 border-brand-primary shadow-xl scale-100 xl:scale-105 z-10'
                                    : 'border border-border-soft hover:border-brand-primary/50 transition-colors'
                        }`}
                            style={plan.isCurrent ? {
                                borderColor: plan.color,
                                '--tw-ring-color': `${plan.color}30`,
                            } : {}}
                        >
                            {plan.isCurrent && (
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                                    style={{ backgroundColor: plan.color }}
                                >
                                    {t('pricing.currentPlan', 'Current Plan')}
                                </div>
                            )}
                            {plan.highlight && !plan.isCurrent && !isSeller && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {t('pricing.mostPopular', 'Most Popular')}
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                            <p className="text-sm text-text-muted min-h-[40px] mb-4">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-text-primary">
                                    {formatPrice(plan.price)}
                                </span>
                                <span className="text-sm font-semibold text-text-muted mt-2 ml-1">{plan.period}</span>
                            </div>

                            <button
                                onClick={plan.buttonAction}
                                className={`w-full py-3 mb-6 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                                    plan.isCurrent
                                        ? 'bg-surface-bg text-text-muted cursor-default'
                                        : plan.isUpgrade || (plan.highlight && !isSeller)
                                            ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                            : 'bg-surface-bg text-text-primary border border-border-soft hover:border-brand-primary hover:text-brand-primary'
                                }`}
                            >
                                {plan.isCurrent && <Crown size={16} />}
                                {plan.buttonText}
                            </button>
                            
                            {plan.includesLabel && (
                                <div className="mb-4 pb-4 border-b border-border-soft">
                                    <p className="text-sm font-semibold text-text-primary">{plan.includesLabel}</p>
                                </div>
                            )}

                            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 border border-brand-primary/20">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-3">
                                    <Sparkles size={16} /> {plan.aiFeatures && plan.aiFeatures.length > 1 ? t('pricing.aiSuperpowers', 'AI Superpowers') : t('pricing.aiSuperpower', 'AI Superpower')}
                                </h4>
                                <div className="space-y-3">
                                    {plan.aiFeatures && plan.aiFeatures.map((ai, idx) => (
                                        <div key={idx}>
                                            <p className="text-xs text-text-muted font-bold mb-0.5">{ai.title}</p>
                                            <p className="text-xs text-text-muted/80 leading-relaxed">{ai.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-sm text-text-muted">
                                        <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-4 border-t border-border-soft">
                                <a 
                                    href="#compare-features" 
                                    className="w-full flex items-center justify-center py-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                                >
                                    {t('pricing.compareFeatures', 'Compare all features')}
                                    <ChevronDown size={18} className="ml-1" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div id="compare-features" className="max-w-5xl mx-auto pt-16 pb-24 scroll-mt-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-text-primary">{t('pricing.compareTitle', 'Compare All Features')}</h2>
                        <p className="text-text-muted mt-3">{t('pricing.compareDesc', 'Find exactly what you get in each tier with our full feature breakdown.')}</p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-border-soft shadow-sm">
                        <table className="w-full text-left border-collapse min-w-[800px] bg-white">
                            <thead>
                                <tr>
                                    <th className="py-5 px-6 border-b border-border-soft bg-surface-bg sticky left-0 z-10 w-[30%] text-sm font-bold text-text-primary uppercase tracking-wider">{t('pricing.table.features', 'Features')}</th>
                                    {PLAN_ORDER.map((planKey) => {
                                        const plan = PLANS[planKey];
                                        const isCurrent = isSeller && currentPlan === planKey;
                                        return (
                                            <th key={planKey} className={`py-5 px-6 border-b text-sm font-bold text-center w-[17.5%] ${
                                                isCurrent
                                                    ? 'border-t-4 bg-opacity-5'
                                                    : 'border-border-soft bg-white'
                                            }`}
                                                style={isCurrent ? {
                                                    borderTopColor: plan.color,
                                                    borderBottomColor: plan.color,
                                                    color: plan.color,
                                                    backgroundColor: `${plan.color}08`,
                                                } : { color: '#1a1a2e' }}
                                            >
                                                <div className="flex flex-col items-center gap-1">
                                                    {plan.name}
                                                    {isCurrent && (
                                                        <span className="text-[9px] uppercase tracking-widest font-bold opacity-70">Current</span>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-soft">
                                {allFeaturesList.map((feature, idx) => (
                                    <tr key={idx} className="hover:bg-surface-bg/50 transition-colors group">
                                        <td className="py-4 px-6 sticky left-0 bg-white group-hover:bg-surface-bg/50 z-10 font-medium text-sm text-text-primary">{feature.label}</td>
                                        {PLAN_ORDER.map((planKey) => {
                                            const hasFeature = canAccessFeature(planKey, feature.key);
                                            const isCurrent = isSeller && currentPlan === planKey;
                                            const plan = PLANS[planKey];
                                            return (
                                                <td key={planKey} className={`py-4 px-6 text-center ${isCurrent ? '' : ''}`}
                                                    style={isCurrent ? { backgroundColor: `${plan.color}05` } : {}}
                                                >
                                                    {hasFeature
                                                        ? <CheckCircle size={20} className={`mx-auto ${isCurrent ? '' : 'text-green-500'}`} style={isCurrent ? { color: plan.color } : {}} />
                                                        : <XCircle size={20} className={`mx-auto ${isCurrent ? 'opacity-20' : 'text-border-soft'}`} style={isCurrent ? { color: plan.color } : {}} />
                                                    }
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">{t('pricing.faqTitle', 'Frequently Asked Questions')}</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="p-6 border border-border-soft rounded-2xl hover:border-brand-primary/30 transition-colors">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary mb-2">
                                    <HelpCircle size={18} className="text-brand-primary flex-shrink-0" /> {faq.q}
                                </h3>
                                <p className="text-sm text-text-muted leading-relaxed pl-7">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
