import React, { useState } from 'react';
import {
    ShoppingCart, Mail, Clock, TrendingUp, Eye, Send,
    CheckCircle, XCircle, DollarSign, ArrowRight, BarChart3, Filter
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';
import { formatPrice } from '../../utils/currency';

const STATUS_MAP = {
    recovered:  { label: 'Recovered',   color: 'text-green-600 bg-green-50',  icon: CheckCircle },
    email_sent: { label: 'Email Sent',  color: 'text-blue-600 bg-blue-50',    icon: Send },
    pending:    { label: 'Pending',     color: 'text-amber-600 bg-amber-50',  icon: Clock },
    expired:    { label: 'Expired',     color: 'text-gray-500 bg-gray-100',   icon: XCircle },
};
// Note: Labels in STATUS_MAP will be translated in the component render

function getTimeAgo(dateStr, t) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return t('sellerAbandonedCarts.table.justNow', 'Just now');
    if (hours < 24) return t('sellerAbandonedCarts.table.hoursAgo', '{{count}}h ago', { count: hours });
    const days = Math.floor(hours / 24);
    return t('sellerAbandonedCarts.table.daysAgo', '{{count}}d ago', { count: days });
}

export default function AbandonedCarts() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { canAccess, currentPlan } = useSubscription();
    const [filter, setFilter] = useState('all');
    const [carts] = useState([]);
    const [emailSettings, setEmailSettings] = useState({
        enabled: true,
        firstEmail: 1,  // hours
        secondEmail: 24,
        thirdEmail: 72,
        discountOnThird: true,
        discountPercent: 10,
    });

    if (!canAccess('abandoned')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature="Abandoned Cart Recovery"
                    requiredPlan="business"
                    message="Automatically follow up with customers who left items in their cart. Recover lost sales with targeted email sequences."
                    variant="card"
                />
            </div>
        );
    }

    const filtered = filter === 'all' ? carts : carts.filter(c => c.status === filter);
    const recovered = carts.filter(c => c.status === 'recovered');
    const recoveredValue = recovered.reduce((s, c) => s + c.total, 0);
    const recoveryRate = carts.length > 0 ? ((recovered.length / carts.length) * 100).toFixed(0) : '0';

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">{t('sellerAbandonedCarts.title', 'Abandoned Cart Recovery')}</h2>
                <p className="text-text-muted text-sm mt-1">
                    {t('sellerAbandonedCarts.subtitle', 'Automatically recover lost sales with follow-up email sequences')}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: t('sellerAbandonedCarts.stats.abandoned', 'Abandoned Carts'), value: carts.length, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: t('sellerAbandonedCarts.stats.recovered', 'Recovered'), value: recovered.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: t('sellerAbandonedCarts.stats.rate', 'Recovery Rate'), value: `${recoveryRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: t('sellerAbandonedCarts.stats.revenue', 'Revenue Recovered'), value: formatPrice(recoveredValue, user?.currency_code), icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white p-4 rounded-2xl border border-border-soft">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <stat.icon size={16} className={stat.color} />
                            </div>
                            <span className="text-xs text-text-muted">{stat.label}</span>
                        </div>
                        <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Email Automation Settings */}
            <div className="bg-white rounded-2xl border border-border-soft p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Mail size={16} className="text-brand-primary" />
                        <h3 className="text-sm font-semibold text-text-primary">{t('sellerAbandonedCarts.automation.title', 'Email Automation')}</h3>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-text-muted">{emailSettings.enabled ? t('sellerAbandonedCarts.automation.active', 'Active') : t('sellerAbandonedCarts.automation.paused', 'Paused')}</span>
                        <input
                            type="checkbox"
                            checked={emailSettings.enabled}
                            onChange={(e) => setEmailSettings({ ...emailSettings, enabled: e.target.checked })}
                            className="accent-brand-primary w-4 h-4"
                        />
                    </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-surface-bg rounded-xl">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{t('sellerAbandonedCarts.automation.reminder1', '1st Reminder')}</p>
                        <p className="text-sm font-semibold text-text-primary">{emailSettings.firstEmail === 1 ? t('sellerAbandonedCarts.automation.hourAfter', '1 hour after') : t('sellerAbandonedCarts.automation.hoursAfter', '{{count}} hours after', { count: emailSettings.firstEmail })}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{t('sellerAbandonedCarts.automation.gentleDesc', 'Gentle reminder with cart items')}</p>
                    </div>
                    <div className="p-3 bg-surface-bg rounded-xl">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{t('sellerAbandonedCarts.automation.reminder2', '2nd Reminder')}</p>
                        <p className="text-sm font-semibold text-text-primary">{t('sellerAbandonedCarts.automation.hoursAfter', '{{count}} hours after', { count: emailSettings.secondEmail })}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{t('sellerAbandonedCarts.automation.urgencyDesc', 'Urgency + social proof')}</p>
                    </div>
                    <div className="p-3 bg-surface-bg rounded-xl">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{t('sellerAbandonedCarts.automation.reminder3', '3rd Reminder')}</p>
                        <p className="text-sm font-semibold text-text-primary">{t('sellerAbandonedCarts.automation.hoursAfter', '{{count}} hours after', { count: emailSettings.thirdEmail })}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            {emailSettings.discountOnThird ? t('sellerAbandonedCarts.automation.discountDesc', '{{percent}}% discount included', { percent: emailSettings.discountPercent }) : t('sellerAbandonedCarts.automation.finalDesc', 'Final reminder')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                    { key: 'all', label: t('sellerAbandonedCarts.filters.all', 'All') },
                    { key: 'pending', label: t('sellerAbandonedCarts.filters.pending', 'Pending') },
                    { key: 'email_sent', label: t('sellerAbandonedCarts.filters.emailSent', 'Email Sent') },
                    { key: 'recovered', label: t('sellerAbandonedCarts.filters.recovered', 'Recovered') },
                    { key: 'expired', label: t('sellerAbandonedCarts.filters.expired', 'Expired') },
                ].map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                            filter === f.key
                                ? 'bg-brand-primary/10 text-brand-primary'
                                : 'text-text-muted hover:bg-surface-bg'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Cart Table */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerAbandonedCarts.table.customer', 'Customer')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerAbandonedCarts.table.items', 'Items')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerAbandonedCarts.table.value', 'Value')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerAbandonedCarts.table.abandoned', 'Abandoned')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerAbandonedCarts.table.emailsSent', 'Emails Sent')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerAbandonedCarts.table.status', 'Status')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">{t('sellerAbandonedCarts.table.action', 'Action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {filtered.map(cart => {
                                const statusInfo = STATUS_MAP[cart.status];
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <tr key={cart.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-medium text-text-primary">{cart.customer}</p>
                                            <p className="text-xs text-text-muted">{cart.email}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{cart.items} items</td>
                                        <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">{formatPrice(cart.total, user?.currency_code)}</td>
                                        <td className="px-5 py-3.5 text-xs text-text-muted">{getTimeAgo(cart.abandonedAt, t)}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{cart.emailsSent}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                                                <StatusIcon size={11} />{t(`sellerAbandonedCarts.filters.${cart.status === 'email_sent' ? 'emailSent' : cart.status}`, statusInfo.label)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            {cart.status === 'pending' && (
                                                <button className="text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors">
                                                    {t('sellerAbandonedCarts.table.sendNow', 'Send Now')}
                                                </button>
                                            )}
                                            {cart.status === 'email_sent' && (
                                                <button className="text-xs text-text-muted hover:text-text-primary transition-colors">
                                                    {t('sellerAbandonedCarts.table.viewEmails', 'View Emails')}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
