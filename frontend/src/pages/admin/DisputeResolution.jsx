import React from 'react';
import { AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

const DISPUTES = [
    { id: 'D-2841', buyer: 'Sarah M.', seller: 'TechVault', reason: 'Item not as described', order: 'TRG-X1A', amount: 199.00, date: '2026-03-02', status: 'open' },
    { id: 'D-2842', buyer: 'James K.', seller: 'Urban Threads', reason: 'Arrived damaged', order: 'TRG-Y2B', amount: 68.00, date: '2026-03-01', status: 'in_review' },
    { id: 'D-2843', buyer: 'Emily R.', seller: 'NaturGlow', reason: 'Wrong item received', order: 'TRG-Z3C', amount: 42.00, date: '2026-02-28', status: 'resolved' },
    { id: 'D-2844', buyer: 'Michael T.', seller: 'Sony Electronics', reason: 'Defective product', order: 'TRG-W4D', amount: 348.00, date: '2026-02-27', status: 'resolved' },
];

const STATUS_CONFIG = {
    open: { label: 'Open', icon: AlertTriangle, style: 'text-red-500 bg-red-50' },
    in_review: { label: 'In Review', icon: Clock, style: 'text-amber-600 bg-amber-50' },
    resolved: { label: 'Resolved', icon: CheckCircle, style: 'text-green-600 bg-green-50' },
};

export default function DisputeResolution() {
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Dispute Resolution</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Open', count: DISPUTES.filter((d) => d.status === 'open').length, color: 'text-red-500' },
                    { label: 'In Review', count: DISPUTES.filter((d) => d.status === 'in_review').length, color: 'text-amber-600' },
                    { label: 'Resolved', count: DISPUTES.filter((d) => d.status === 'resolved').length, color: 'text-green-600' },
                ].map((s) => (
                    <div key={s.label} className="bg-white p-4 rounded-xl border border-border-soft text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                        <p className="text-xs text-text-muted">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="bg-surface-bg text-left">
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">ID</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Buyer</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Seller</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Reason</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Amount</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Action</th>
                        </tr></thead>
                        <tbody className="divide-y divide-border-soft">
                            {DISPUTES.map((d) => {
                                const cfg = STATUS_CONFIG[d.status];
                                return (
                                    <tr key={d.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">{d.id}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{d.buyer}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{d.seller}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{d.reason}</td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-text-primary">${d.amount.toFixed(2)}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${cfg.style}`}>
                                                <cfg.icon size={11} /> {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button className="flex items-center gap-1 text-xs font-medium text-brand-primary hover:text-brand-secondary ml-auto">
                                                <MessageSquare size={12} /> View
                                            </button>
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
