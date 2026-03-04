import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Download } from 'lucide-react';

const PAYOUTS = [
    { id: 'PAY-001', seller: 'Sony Electronics', amount: 12450.00, date: '2026-03-01', status: 'completed' },
    { id: 'PAY-002', seller: 'Urban Threads', amount: 8920.00, date: '2026-03-01', status: 'completed' },
    { id: 'PAY-003', seller: 'NaturGlow', amount: 5640.00, date: '2026-03-01', status: 'completed' },
    { id: 'PAY-004', seller: 'TechVault', amount: 4280.00, date: '2026-03-01', status: 'pending' },
];

export default function AdminFinance() {
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
                    <p className="text-2xl font-bold text-text-primary">$18,240</p>
                    <p className="text-xs text-green-600 mt-0.5">+14% vs last month</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><TrendingUp size={16} className="text-blue-600" /></div>
                        <span className="text-sm text-text-muted">Total GMV</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">$182,400</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center"><CreditCard size={16} className="text-amber-600" /></div>
                        <span className="text-sm text-text-muted">Pending Payouts</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">$4,280</p>
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
                            {PAYOUTS.map((p) => (
                                <tr key={p.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">{p.id}</td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{p.seller}</td>
                                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">${p.amount.toLocaleString()}</td>
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
