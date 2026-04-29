import React, { useState } from 'react';
import {
    Tag, Plus, Search, Percent, DollarSign, Calendar, Copy,
    ToggleLeft, ToggleRight, Trash2, Eye, TrendingUp, Users, ShoppingBag
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

// Mock discount data
const MOCK_DISCOUNTS = [
    {
        id: 1,
        code: 'SUMMER25',
        type: 'percentage',
        value: 25,
        usageCount: 142,
        usageLimit: 500,
        minOrderValue: 30,
        status: 'active',
        expiresAt: '2026-06-30',
        createdAt: '2026-04-01',
    },
    {
        id: 2,
        code: 'FLAT10',
        type: 'fixed',
        value: 10,
        usageCount: 67,
        usageLimit: null,
        minOrderValue: 50,
        status: 'active',
        expiresAt: null,
        createdAt: '2026-03-15',
    },
    {
        id: 3,
        code: 'WELCOME15',
        type: 'percentage',
        value: 15,
        usageCount: 312,
        usageLimit: 1000,
        minOrderValue: 0,
        status: 'active',
        expiresAt: '2026-12-31',
        createdAt: '2026-01-01',
    },
    {
        id: 4,
        code: 'SPRING20',
        type: 'percentage',
        value: 20,
        usageCount: 89,
        usageLimit: 100,
        minOrderValue: 25,
        status: 'expired',
        expiresAt: '2026-03-31',
        createdAt: '2026-03-01',
    },
];

const STATUS_STYLES = {
    active: 'text-green-600 bg-green-50',
    expired: 'text-gray-500 bg-gray-100',
    paused: 'text-amber-600 bg-amber-50',
};

function DiscountStats({ discounts }) {
    const active = discounts.filter(d => d.status === 'active').length;
    const totalUsage = discounts.reduce((sum, d) => sum + d.usageCount, 0);
    const avgSavings = 18.5; // mock

    const stats = [
        { label: 'Active Discounts', value: active, icon: Tag, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Usage', value: totalUsage.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Avg. Savings', value: `$${avgSavings}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map(stat => (
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
    );
}

export default function DiscountManagement() {
    const { canAccess, currentPlan } = useSubscription();
    const [search, setSearch] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS);

    // Gate check
    if (!canAccess('discount')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature="Discount Rules"
                    requiredPlan="pro"
                    message="Create discount codes and promotional offers to boost your sales. Upgrade to Pro to unlock this feature."
                    variant="card"
                />
            </div>
        );
    }

    const filteredDiscounts = discounts.filter(d =>
        d.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
    };

    const handleToggleStatus = (id) => {
        setDiscounts(prev => prev.map(d =>
            d.id === id
                ? { ...d, status: d.status === 'active' ? 'paused' : 'active' }
                : d
        ));
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Discounts</h2>
                    <p className="text-text-muted text-sm mt-1">
                        Create and manage discount codes for your store
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                >
                    <Plus size={16} />
                    Create Discount
                </button>
            </div>

            {/* Stats */}
            <DiscountStats discounts={discounts} />

            {/* Create Form (Expandable) */}
            {showCreateForm && (
                <div className="bg-white rounded-2xl border border-border-soft p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Create New Discount</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Discount Code</label>
                            <input
                                type="text"
                                placeholder="e.g. SUMMER25"
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Discount Type</label>
                            <select className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary outline-none">
                                <option value="percentage">Percentage Off</option>
                                <option value="fixed">Fixed Amount Off</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Value</label>
                            <input
                                type="number"
                                placeholder="25"
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Minimum Order Value ($)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Usage Limit</label>
                            <input
                                type="number"
                                placeholder="Unlimited"
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Expiry Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                        <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                            Create Discount
                        </button>
                        <button
                            onClick={() => setShowCreateForm(false)}
                            className="px-5 py-2.5 text-text-muted text-sm font-medium hover:text-text-primary transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search discount codes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 pl-9 pr-3 py-2.5 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
            </div>

            {/* Discounts Table */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Code</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Type</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Value</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Usage</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Min. Order</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Expires</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {filteredDiscounts.map(discount => (
                                <tr key={discount.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm font-bold text-text-primary bg-surface-bg px-2 py-0.5 rounded">
                                                {discount.code}
                                            </code>
                                            <button
                                                onClick={() => handleCopyCode(discount.code)}
                                                className="p-1 text-text-muted hover:text-brand-primary transition-colors"
                                                title="Copy code"
                                            >
                                                <Copy size={13} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-xs text-text-muted capitalize flex items-center gap-1">
                                            {discount.type === 'percentage' ? <Percent size={12} /> : <DollarSign size={12} />}
                                            {discount.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">
                                        {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">
                                        {discount.usageCount}{discount.usageLimit ? ` / ${discount.usageLimit}` : ''}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">
                                        {discount.minOrderValue > 0 ? `$${discount.minOrderValue}` : '—'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[discount.status]}`}>
                                            {discount.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">
                                        {discount.expiresAt
                                            ? new Date(discount.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : 'Never'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleToggleStatus(discount.id)}
                                                className="p-1.5 text-text-muted hover:text-brand-primary transition-colors"
                                                title={discount.status === 'active' ? 'Pause' : 'Activate'}
                                            >
                                                {discount.status === 'active'
                                                    ? <ToggleRight size={16} className="text-green-500" />
                                                    : <ToggleLeft size={16} />}
                                            </button>
                                            <button
                                                className="p-1.5 text-text-muted hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredDiscounts.length === 0 && (
                    <div className="text-center py-12">
                        <Tag size={32} className="mx-auto text-text-muted/40 mb-3" />
                        <p className="text-text-primary font-medium">No discount codes found</p>
                        <p className="text-sm text-text-muted mt-1">Create your first discount code to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
