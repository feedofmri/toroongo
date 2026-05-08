import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Share2, Plus, Search, ExternalLink, CheckCircle, AlertCircle,
    Eye, TrendingUp, BarChart3, Copy, Settings, Globe, ShoppingBag, Megaphone
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

function IntegrationCard({ integration }) {
    const { t } = useTranslation();
    const isConnected = integration.status === 'connected';

    return (
        <div className={`bg-white rounded-2xl border p-5 transition-all ${
            isConnected ? 'border-green-200 hover:border-green-300' : 'border-border-soft hover:border-gray-300'
        }`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                        <h4 className="text-sm font-semibold text-text-primary">{integration.name}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isConnected ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'
                        }`}>
                            {isConnected ? `● ${t('sellerSocial.card.connected')}` : `○ ${t('sellerSocial.card.notConnected')}`}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-text-muted mb-4 leading-relaxed">{integration.description}</p>

            {isConnected ? (
                <div className="space-y-2">
                    {integration.pixelId && (
                        <div className="flex items-center justify-between p-2.5 bg-surface-bg rounded-lg">
                            <span className="text-[11px] text-text-muted">{t('sellerSocial.card.pixelId')}</span>
                            <div className="flex items-center gap-1.5">
                                <code className="text-[11px] font-mono text-text-primary">{integration.pixelId}</code>
                                <button className="p-0.5 text-text-muted hover:text-brand-primary"><Copy size={10} /></button>
                            </div>
                        </div>
                    )}
                    {integration.feedUrl && (
                        <div className="flex items-center justify-between p-2.5 bg-surface-bg rounded-lg">
                            <span className="text-[11px] text-text-muted">{t('sellerSocial.card.feedUrl')}</span>
                            <button className="p-0.5 text-text-muted hover:text-brand-primary"><Copy size={10} /></button>
                        </div>
                    )}
                    {integration.eventsTracked > 0 && (
                        <div className="flex items-center justify-between p-2.5 bg-surface-bg rounded-lg">
                            <span className="text-[11px] text-text-muted">{t('sellerSocial.card.events')}</span>
                            <span className="text-[11px] font-semibold text-text-primary">{integration.eventsTracked.toLocaleString()}</span>
                        </div>
                    )}
                    {integration.productsListed && (
                        <div className="flex items-center justify-between p-2.5 bg-surface-bg rounded-lg">
                            <span className="text-[11px] text-text-muted">{t('sellerSocial.card.synced')}</span>
                            <span className="text-[11px] font-semibold text-text-primary">{integration.productsListed}</span>
                        </div>
                    )}
                    <div className="flex gap-2 pt-1">
                        <button className="flex-1 px-3 py-2 text-xs font-semibold text-text-primary bg-white border border-border-soft rounded-xl hover:bg-gray-50 transition-colors">
                            <Settings size={12} className="inline mr-1" />{t('sellerSocial.card.configure')}
                        </button>
                        <button className="px-3 py-2 text-xs font-semibold text-red-500 bg-white border border-border-soft rounded-xl hover:bg-red-50 transition-colors">
                            {t('sellerSocial.card.disconnect')}
                        </button>
                    </div>
                </div>
            ) : (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    <Plus size={14} />
                    {t('sellerSocial.card.connect')}
                </button>
            )}
        </div>
    );
}

export default function SocialCommerce() {
    const { t } = useTranslation();
    const { canAccess, currentPlan } = useSubscription();

    const INTEGRATIONS = [
        {
            id: 'meta_pixel',
            name: t('sellerSocial.integrations.meta_pixel.name'),
            description: t('sellerSocial.integrations.meta_pixel.desc'),
            icon: '📘',
            status: 'connected',
            pixelId: '123456789012345',
            eventsTracked: 1247,
        },
        {
            id: 'google_shopping',
            name: t('sellerSocial.integrations.google_shopping.name'),
            description: t('sellerSocial.integrations.google_shopping.desc'),
            icon: '🛍️',
            status: 'connected',
            feedUrl: 'https://toroongo.com/feed/google/abc123.xml',
            productsListed: 24,
        },
        {
            id: 'tiktok_pixel',
            name: t('sellerSocial.integrations.tiktok_pixel.name'),
            description: t('sellerSocial.integrations.tiktok_pixel.desc'),
            icon: '🎵',
            status: 'disconnected',
            pixelId: null,
            eventsTracked: 0,
        },
        {
            id: 'pinterest_tag',
            name: t('sellerSocial.integrations.pinterest_tag.name'),
            description: t('sellerSocial.integrations.pinterest_tag.desc'),
            icon: '📌',
            status: 'disconnected',
            pixelId: null,
            eventsTracked: 0,
        },
    ];

    if (!canAccess('social')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature={t('sellerSocial.title')}
                    requiredPlan="pro"
                    message={t('sellerSocial.subtitle')}
                    variant="card"
                />
            </div>
        );
    }

    const connected = INTEGRATIONS.filter(i => i.status === 'connected').length;

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">{t('sellerSocial.title')}</h2>
                <p className="text-text-muted text-sm mt-1">
                    {t('sellerSocial.subtitle')}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                            <Share2 size={16} className="text-green-600" />
                        </div>
                        <span className="text-xs text-text-muted">{t('sellerSocial.stats.connected')}</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">{connected} / {INTEGRATIONS.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Eye size={16} className="text-blue-600" />
                        </div>
                        <span className="text-xs text-text-muted">{t('sellerSocial.stats.events')}</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">1,247</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                            <TrendingUp size={16} className="text-purple-600" />
                        </div>
                        <span className="text-xs text-text-muted">{t('sellerSocial.stats.sales')}</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">$342</p>
                </div>
            </div>

            {/* Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INTEGRATIONS.map(integration => (
                    <IntegrationCard key={integration.id} integration={integration} />
                ))}
            </div>
        </div>
    );
}
