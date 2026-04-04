import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

export default function PricingPage() {
    const { t } = useTranslation();

    const pricingPlans = [
        {
            name: t('pricing.plans.starter.title', 'Starter'),
            price: formatPrice(0),
            period: t('pricing.month', '/ Month'),
            description: t('pricing.plans.starter.desc', 'Perfect for new artisans just starting out.'),
            features: [
                t('pricing.features.products', 'Up to 10 products'),
                t('pricing.features.basicAnalytics', 'Basic analytics'),
                t('pricing.features.standardSupport', 'Standard support'),
            ],
            aiFeature: t('pricing.plans.starter.ai', 'AI Product Description Generator'),
            aiDesc: t('pricing.plans.starter.aiDesc', 'Instantly write engaging, SEO-friendly descriptions from a few keywords.'),
            buttonText: t('pricing.cta.getStarted', 'Get Started'),
            highlight: false
        },
        {
            name: t('pricing.plans.pro.title', 'Pro'),
            price: formatPrice(5),
            period: t('pricing.month', '/ Month'),
            description: t('pricing.plans.pro.desc', 'Ideal for growing sellers with high volume.'),
            features: [
                t('pricing.features.unlimited', 'Unlimited products'),
                t('pricing.features.advancedAnalytics', 'Advanced analytics'),
                t('pricing.features.prioSupport', 'Priority support'),
                t('pricing.features.customStorefront', 'Custom storefront design'),
            ],
            aiFeature: t('pricing.plans.growth.ai', 'AI Image Enhancer'),
            aiDesc: t('pricing.plans.growth.aiDesc', 'Automatically remove basic backgrounds and replace them with pure white or brand colors.'),
            buttonText: t('pricing.cta.goPro', 'Go Pro'),
            highlight: true
        },
        {
            name: t('pricing.plans.business.title', 'Business'),
            price: formatPrice(15),
            period: t('pricing.month', '/ Month'),
            description: t('pricing.plans.business.desc', 'For established brands and retailers.'),
            features: [
                t('pricing.features.multiAccount', 'Multiple seller accounts'),
                t('pricing.features.dedicatedManager', 'Dedicated account manager'),
                t('pricing.features.apiAccess', 'Full API access'),
                t('pricing.features.lowFee', 'Lower transaction fees'),
            ],
            aiFeature: t('pricing.plans.business.ai', 'AI Support & Recommendations'),
            aiDesc: t('pricing.plans.business.aiDesc', '24/7 AI chatbot for buyer questions & smart "Frequently Bought Together" recommendations.'),
            buttonText: t('pricing.cta.contactSales', 'Contact Sales'),
            highlight: false
        },
        {
            name: t('pricing.plans.enterprise.title', 'Enterprise'),
            price: formatPrice(40),
            period: t('pricing.month', '/ Month'),
            description: t('pricing.plans.enterprise.desc', 'Scale without limits with custom solutions.'),
            features: [
                t('pricing.features.customContract', 'Custom contract pricing'),
                t('pricing.features.premiumSLA', 'Premium support SLA'),
            ],
            aiFeature: t('pricing.plans.enterprise.ai', 'AI Forecasting & Sentiment'),
            aiDesc: t('pricing.plans.enterprise.aiDesc', 'Predict inventory run-outs and analyze hundreds of reviews for instant, actionable summaries.'),
            buttonText: t('pricing.cta.contactUs', 'Contact Us'),
            highlight: false
        }
    ];

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
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-4 mb-20">
                    {pricingPlans.map((plan) => (
                        <div key={plan.name} className={`bg-white rounded-2xl p-6 flex flex-col relative ${plan.highlight ? 'border-2 border-brand-primary shadow-xl scale-100 xl:scale-105 z-10' : 'border border-border-soft hover:border-brand-primary/50 transition-colors'}`}>
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {t('pricing.mostPopular', 'Most Popular')}
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                            <p className="text-sm text-text-muted min-h-[40px] mb-4">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-text-primary">
                                    {plan.price}
                                </span>
                                <span className="text-sm font-semibold text-text-muted mt-2 ml-1">{plan.period}</span>
                            </div>

                            <Link to="/signup" className={`w-full py-3 mb-6 font-semibold rounded-xl transition-colors flex items-center justify-center ${plan.highlight ? 'bg-brand-primary text-white hover:bg-brand-secondary' : 'bg-surface-bg text-text-primary border border-border-soft hover:border-brand-primary hover:text-brand-primary'}`}>
                                {plan.buttonText}
                            </Link>

                            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 border border-brand-primary/20">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-2">
                                    <Sparkles size={16} /> {t('pricing.aiSuperpower', 'AI Superpower')}
                                </h4>
                                <p className="text-xs text-text-muted font-bold mb-1">{plan.aiFeature}</p>
                                <p className="text-xs text-text-muted/80">{plan.aiDesc}</p>
                            </div>

                            <ul className="space-y-3 mt-auto">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-sm text-text-muted">
                                        <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
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
