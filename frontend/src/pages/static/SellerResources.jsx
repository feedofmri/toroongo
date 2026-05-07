import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, MessageSquare, TrendingUp, Camera, Package, BarChart3, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SellerResources() {
    const { t } = useTranslation();

    const GUIDES = [
        { icon: BookOpen, title: t('sellerResources.guidesList.g1.title', 'AI-Powered Setup'), desc: t('sellerResources.guidesList.g1.desc', 'Launch your store in minutes with our AI Storefront Builder.'), tag: 'Setup' },
        { icon: Camera, title: t('sellerResources.guidesList.g2.title', 'AI Image Enhancement'), desc: t('sellerResources.guidesList.g2.desc', 'Automatically remove backgrounds and upscale product photos.'), tag: 'AI Tools' },
        { icon: TrendingUp, title: t('sellerResources.guidesList.g3.title', 'Global SEO & Localization'), desc: t('sellerResources.guidesList.g3.desc', 'Automatically translate your catalog into 7+ languages.'), tag: 'Marketing' },
        { icon: Package, title: t('sellerResources.guidesList.g4.title', 'Global Logistics Hub'), desc: t('sellerResources.guidesList.g4.desc', 'Seamlessly ship to Bangladesh, Nepal, UAE, and beyond.'), tag: 'Logistics' },
        { icon: BarChart3, title: t('sellerResources.guidesList.g5.title', 'Sales Forecasting'), desc: t('sellerResources.guidesList.g5.desc', 'Use AI to predict inventory needs and trend analysis.'), tag: 'Analytics' },
        { icon: FileText, title: t('sellerResources.guidesList.g6.title', 'Zero Commission Model'), desc: t('sellerResources.guidesList.g6.desc', 'Learn how to keep 100% of your revenue with 0% transaction fees.'), tag: 'Finance' },
    ];


    const RESOURCES = [
        { icon: Video, title: t('sellerResources.resourcesList.r1.title', 'Toroongo Academy'), desc: t('sellerResources.resourcesList.r1.desc', 'Master the platform with video masterclasses.'), cta: t('common.watchNow', 'Start Learning') },
        { icon: MessageSquare, title: t('sellerResources.resourcesList.r2.title', 'Global Seller Hub'), desc: t('sellerResources.resourcesList.r2.desc', 'Network with sellers across 6+ countries.'), cta: t('common.joinForum', 'Join Community') },
        { icon: FileText, title: t('sellerResources.resourcesList.r3.title', 'System Documentation'), desc: t('sellerResources.resourcesList.r3.desc', 'Deep dive into our AI and Logistics APIs.'), cta: t('common.readDocs', 'View Docs') },
    ];

    return (
        <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('sellerResources.title')}</h1>
                    <p className="text-white/80 max-w-lg mx-auto">{t('sellerResources.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Guides */}
                <h2 className="text-xl font-bold text-text-primary mb-6">{t('sellerResources.guides')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {GUIDES.map((guide) => (
                        <div key={guide.title} className="p-5 bg-white border border-border-soft rounded-2xl hover:border-brand-primary/20 transition-colors group cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <guide.icon size={22} className="text-brand-primary" />
                                <span className="text-[10px] font-bold uppercase text-text-muted bg-surface-bg px-2 py-0.5 rounded-md">{guide.tag}</span>
                            </div>
                            <h3 className="font-semibold text-text-primary text-sm mb-1 group-hover:text-brand-primary transition-colors">{guide.title}</h3>
                            <p className="text-xs text-text-muted leading-relaxed">{guide.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Additional Resources */}
                <h2 className="text-xl font-bold text-text-primary mb-6">{t('sellerResources.more')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    {RESOURCES.map((res) => (
                        <div key={res.title} className="p-6 border border-border-soft rounded-2xl text-center">
                            <res.icon size={28} className="text-brand-primary mx-auto mb-3" />
                            <h3 className="font-semibold text-text-primary mb-1">{res.title}</h3>
                            <p className="text-xs text-text-muted mb-3">{res.desc}</p>
                            <button className="text-xs font-semibold text-brand-primary hover:text-brand-secondary">{res.cta} &rarr;</button>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-surface-bg rounded-2xl p-8 border border-border-soft text-center">
                    <h3 className="text-lg font-bold text-text-primary mb-2">{t('sellerResources.ready')}</h3>
                    <p className="text-sm text-text-muted mb-4">{t('sellerResources.readyDesc')}</p>
                    <Link to="/sell" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        {t('sellerResources.getStarted')} <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
