import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Download } from 'lucide-react';
import { adminService } from '../../services';

export default function AdminFinance() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getPlatformStats()
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    if (loading) return <div className="p-8 text-center text-text-muted">Loading financial data...</div>;

    const gmv = stats?.totalRevenue || 0;
    const commission = gmv * 0.10; // 10% platform fee
    const pending = gmv * 0.90 * 0.2; // roughly 20% of seller earnings are pending as mock data

    const mockPayouts = [
        { id: 'PAY-001', seller: 'Sony Electronics', amount: pending * 0.4, date: new Date().toISOString(), status: 'pending' },
        { id: 'PAY-002', seller: 'Urban Threads', amount: pending * 0.3, date: new Date().toISOString(), status: 'pending' },
        { id: 'PAY-003', seller: 'NaturGlow', amount: pending * 0.2, date: new Date().toISOString(), status: 'completed' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Financial Hub</h2>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl hover:bg-surface-bg">
                    <Download size={15} /> Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center"><DollarSign size={16} className="text-green-600" /></div>
                        <span className="text-sm text-text-muted">Platform Commission</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">${commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-xs text-green-600 mt-0.5">+14% vs last month</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><TrendingUp size={16} className="text-blue-600" /></div>
                        <span className="text-sm text-text-muted">Total GMV</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">${gmv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center"><CreditCard size={16} className="text-amber-600" /></div>
                        <span className="text-sm text-text-muted">Pending Payouts</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">${pending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-border-soft"><h3 className="font-semibold text-text-primary">Seller Payouts</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="bg-surface-bg text-left">
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">ID</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Seller</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Amount</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Date</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                        </tr></thead>
                        <tbody className="divide-y divide-border-soft">
                            {mockPayouts.map((p) => (
                                <tr key={p.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">{p.id}</td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{p.seller}</td>
                                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${p.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>{p.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
