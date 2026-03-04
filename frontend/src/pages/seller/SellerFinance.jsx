import React from 'react';
import { DollarSign, TrendingUp, ArrowDown, Calendar, Download } from 'lucide-react';

const TRANSACTIONS = [
    { id: 'TXN-001', date: '2026-03-03', type: 'Sale', description: 'Sony WH-1000XM5 × 1', amount: 348.00, fee: 34.80, net: 313.20 },
    { id: 'TXN-002', date: '2026-03-02', type: 'Sale', description: 'WF-1000XM5 Earbuds × 1', amount: 278.00, fee: 27.80, net: 250.20 },
    { id: 'TXN-003', date: '2026-03-01', type: 'Payout', description: 'Weekly payout → Bank ****4567', amount: -1245.60, fee: 0, net: -1245.60 },
    { id: 'TXN-004', date: '2026-02-28', type: 'Sale', description: 'Desk Lamp × 2', amount: 178.00, fee: 17.80, net: 160.20 },
    { id: 'TXN-005', date: '2026-02-27', type: 'Refund', description: 'Return – Sony WH-1000XM5', amount: -348.00, fee: -34.80, net: -313.20 },
];

export default function SellerFinance() {
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Finance</h2>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl hover:bg-surface-bg transition-colors">
                    <Download size={15} /> Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign size={16} className="text-green-600" />
                        </div>
                        <span className="text-sm text-text-muted">Available Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">$4,236.80</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <TrendingUp size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-text-muted">Pending Settlement</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">$626.00</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Calendar size={16} className="text-amber-600" />
                        </div>
                        <span className="text-sm text-text-muted">Next Payout</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">Mar 7</p>
                    <p className="text-xs text-text-muted mt-0.5">Est. $4,236.80</p>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-border-soft">
                    <h3 className="font-semibold text-text-primary">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Transaction</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Date</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Type</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Description</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Amount</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Fee</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Net</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {TRANSACTIONS.map((txn) => (
                                <tr key={txn.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">{txn.id}</td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">
                                        {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                      ${txn.type === 'Sale' ? 'text-green-600 bg-green-50'
                                                : txn.type === 'Payout' ? 'text-blue-600 bg-blue-50'
                                                    : 'text-red-500 bg-red-50'}`}>
                                            {txn.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{txn.description}</td>
                                    <td className={`px-5 py-3.5 text-sm font-medium text-right ${txn.amount >= 0 ? 'text-text-primary' : 'text-red-500'}`}>
                                        {txn.amount >= 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted text-right">
                                        {txn.fee !== 0 ? `$${Math.abs(txn.fee).toFixed(2)}` : '—'}
                                    </td>
                                    <td className={`px-5 py-3.5 text-sm font-semibold text-right ${txn.net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {txn.net >= 0 ? '+' : ''}${Math.abs(txn.net).toFixed(2)}
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
