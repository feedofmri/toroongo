import React, { useState } from 'react';
import {
    Link2, Users, TrendingUp, DollarSign, Copy, Plus, Search,
    ExternalLink, CheckCircle, Clock, Eye, BarChart3, Share2
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';
import { formatPrice } from '../../utils/currency';

export default function AffiliateProgram() {
    const { user } = useAuth();
    const { canAccess, currentPlan } = useSubscription();
    const [search, setSearch] = useState('');
    const [showInvite, setShowInvite] = useState(false);
    const [affiliates] = useState([]);

    if (!canAccess('affiliate')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature="Affiliate & Referral System"
                    requiredPlan="enterprise"
                    message="Run your own affiliate network. Let influencers, bloggers, and partners earn commissions by promoting your products."
                    variant="card"
                />
            </div>
        );
    }

    const filtered = affiliates.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase())
    );
    const totalRevenue = affiliates.reduce((s, a) => s + a.revenue, 0);
    const totalEarned = affiliates.reduce((s, a) => s + a.earned, 0);
    const totalConversions = affiliates.reduce((s, a) => s + a.conversions, 0);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Affiliate Program</h2>
                    <p className="text-text-muted text-sm mt-1">
                        Manage your affiliate network and track partner performance
                    </p>
                </div>
                <button
                    onClick={() => setShowInvite(!showInvite)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                >
                    <Plus size={16} />
                    Invite Affiliate
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Active Affiliates', value: affiliates.filter(a => a.status === 'active').length, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Total Conversions', value: totalConversions, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Revenue Generated', value: formatPrice(totalRevenue, user?.currency_code), icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Commissions Paid', value: formatPrice(totalEarned, user?.currency_code), icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
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

            {/* Invite Form */}
            {showInvite && (
                <div className="bg-white rounded-2xl border border-border-soft p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Invite New Affiliate</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Affiliate / Partner Name</label>
                            <input type="text" placeholder="e.g. TechReview Blog" className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Email Address</label>
                            <input type="email" placeholder="partner@example.com" className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Referral Code</label>
                            <input type="text" placeholder="e.g. PARTNER15" className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none uppercase" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Commission Rate (%)</label>
                            <input type="number" placeholder="15" className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">Send Invite</button>
                        <button onClick={() => setShowInvite(false)} className="px-5 py-2.5 text-text-muted text-sm font-medium hover:text-text-primary transition-colors">Cancel</button>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search affiliates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 pl-9 pr-3 py-2.5 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
            </div>

            {/* Affiliate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(affiliate => (
                    <div key={affiliate.id} className="bg-white rounded-2xl border border-border-soft p-5 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-sm font-semibold text-text-primary">{affiliate.name}</p>
                                <p className="text-xs text-text-muted">{affiliate.email}</p>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                affiliate.status === 'active' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                            }`}>
                                {affiliate.status === 'active' ? '● Active' : '◌ Pending'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <code className="text-xs font-bold text-text-primary bg-surface-bg px-2.5 py-1 rounded">{affiliate.code}</code>
                            <span className="text-[10px] text-text-muted">{affiliate.commission}% commission</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-surface-bg rounded-lg text-center">
                                <p className="text-xs font-bold text-text-primary">{affiliate.clicks.toLocaleString()}</p>
                                <p className="text-[10px] text-text-muted">Clicks</p>
                            </div>
                            <div className="p-2 bg-surface-bg rounded-lg text-center">
                                <p className="text-xs font-bold text-text-primary">{affiliate.conversions}</p>
                                <p className="text-[10px] text-text-muted">Sales</p>
                            </div>
                            <div className="p-2 bg-surface-bg rounded-lg text-center">
                                <p className="text-xs font-bold text-green-600">{formatPrice(affiliate.earned, user?.currency_code)}</p>
                                <p className="text-[10px] text-text-muted">Earned</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
