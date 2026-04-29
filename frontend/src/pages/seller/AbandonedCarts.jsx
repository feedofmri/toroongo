import React, { useState } from 'react';
import {
    ShoppingCart, Mail, Clock, TrendingUp, Eye, Send,
    CheckCircle, XCircle, DollarSign, ArrowRight, BarChart3, Filter
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

const MOCK_CARTS = [
    {
        id: 1,
        customer: 'Sarah M.',
        email: 's***@gmail.com',
        items: 3,
        total: 89.99,
        abandonedAt: '2026-04-29T14:30:00',
        status: 'recovered',
        emailsSent: 2,
        recoveredAt: '2026-04-29T18:15:00',
    },
    {
        id: 2,
        customer: 'David K.',
        email: 'd***@yahoo.com',
        items: 1,
        total: 45.00,
        abandonedAt: '2026-04-29T12:00:00',
        status: 'email_sent',
        emailsSent: 1,
        recoveredAt: null,
    },
    {
        id: 3,
        customer: 'Aisha R.',
        email: 'a***@outlook.com',
        items: 5,
        total: 234.50,
        abandonedAt: '2026-04-28T22:45:00',
        status: 'pending',
        emailsSent: 0,
        recoveredAt: null,
    },
    {
        id: 4,
        customer: 'Michael C.',
        email: 'm***@gmail.com',
        items: 2,
        total: 67.00,
        abandonedAt: '2026-04-28T16:20:00',
        status: 'expired',
        emailsSent: 3,
        recoveredAt: null,
    },
    {
        id: 5,
        customer: 'Lisa W.',
        email: 'l***@gmail.com',
        items: 1,
        total: 29.99,
        abandonedAt: '2026-04-28T10:15:00',
        status: 'recovered',
        emailsSent: 1,
        recoveredAt: '2026-04-28T14:30:00',
    },
];

const STATUS_MAP = {
    recovered:  { label: 'Recovered',   color: 'text-green-600 bg-green-50',  icon: CheckCircle },
    email_sent: { label: 'Email Sent',  color: 'text-blue-600 bg-blue-50',    icon: Send },
    pending:    { label: 'Pending',     color: 'text-amber-600 bg-amber-50',  icon: Clock },
    expired:    { label: 'Expired',     color: 'text-gray-500 bg-gray-100',   icon: XCircle },
};

function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function AbandonedCarts() {
    const { canAccess, currentPlan } = useSubscription();
    const [filter, setFilter] = useState('all');
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

    const filtered = filter === 'all' ? MOCK_CARTS : MOCK_CARTS.filter(c => c.status === filter);
    const recovered = MOCK_CARTS.filter(c => c.status === 'recovered');
    const recoveredValue = recovered.reduce((s, c) => s + c.total, 0);
    const recoveryRate = ((recovered.length / MOCK_CARTS.length) * 100).toFixed(0);

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Abandoned Cart Recovery</h2>
                <p className="text-text-muted text-sm mt-1">
                    Automatically recover lost sales with follow-up email sequences
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Abandoned Carts', value: MOCK_CARTS.length, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Recovered', value: recovered.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Recovery Rate', value: `${recoveryRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Revenue Recovered', value: `$${recoveredValue.toFixed(2)}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
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
                        <h3 className="text-sm font-semibold text-text-primary">Email Automation</h3>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-text-muted">{emailSettings.enabled ? 'Active' : 'Paused'}</span>
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
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">1st Reminder</p>
                        <p className="text-sm font-semibold text-text-primary">{emailSettings.firstEmail} hour after</p>
                        <p className="text-[10px] text-text-muted mt-0.5">Gentle reminder with cart items</p>
                    </div>
                    <div className="p-3 bg-surface-bg rounded-xl">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">2nd Reminder</p>
                        <p className="text-sm font-semibold text-text-primary">{emailSettings.secondEmail} hours after</p>
                        <p className="text-[10px] text-text-muted mt-0.5">Urgency + social proof</p>
                    </div>
                    <div className="p-3 bg-surface-bg rounded-xl">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">3rd Reminder</p>
                        <p className="text-sm font-semibold text-text-primary">{emailSettings.thirdEmail} hours after</p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            {emailSettings.discountOnThird ? `${emailSettings.discountPercent}% discount included` : 'Final reminder'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'email_sent', label: 'Email Sent' },
                    { key: 'recovered', label: 'Recovered' },
                    { key: 'expired', label: 'Expired' },
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
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Customer</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Items</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Value</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Abandoned</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Emails Sent</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Action</th>
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
                                        <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">${cart.total.toFixed(2)}</td>
                                        <td className="px-5 py-3.5 text-xs text-text-muted">{getTimeAgo(cart.abandonedAt)}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{cart.emailsSent}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                                                <StatusIcon size={11} />{statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            {cart.status === 'pending' && (
                                                <button className="text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors">
                                                    Send Now
                                                </button>
                                            )}
                                            {cart.status === 'email_sent' && (
                                                <button className="text-xs text-text-muted hover:text-text-primary transition-colors">
                                                    View Emails
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
