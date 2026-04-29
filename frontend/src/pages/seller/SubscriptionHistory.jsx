import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Receipt, Download, CheckCircle, XCircle, Clock, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { subscriptionService } from '../../services';
import { formatPrice } from '../../utils/currency';
import PlanBadge from '../../components/subscription/PlanBadge';

const STATUS_CONFIG = {
    active: { label: 'Active', icon: CheckCircle, className: 'text-green-600 bg-green-50' },
    cancelled: { label: 'Cancelled', icon: XCircle, className: 'text-red-500 bg-red-50' },
    expired: { label: 'Expired', icon: Clock, className: 'text-gray-500 bg-gray-100' },
    pending_downgrade: { label: 'Pending Downgrade', icon: ArrowDown, className: 'text-amber-600 bg-amber-50' },
};

export default function SubscriptionHistory() {
    const { t, i18n } = useTranslation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await subscriptionService.getSubscriptionHistory();
            setHistory(data.history || []);
        } catch (error) {
            console.error('Error fetching subscription history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString(i18n.language || 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    to="/seller/subscription"
                    className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-bg rounded-xl transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Payment History</h2>
                    <p className="text-text-muted text-sm mt-1">View all your subscription transactions</p>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted space-y-3">
                        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                        <p className="text-sm font-medium">Loading history...</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-surface-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Receipt size={28} className="text-text-muted/40" />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">No transactions yet</h3>
                        <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
                            Your payment history will appear here once you upgrade your plan.
                        </p>
                        <Link
                            to="/seller/subscription"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                        >
                            View Plans
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-bg text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Transaction</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-soft">
                                {history.map((item) => {
                                    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.active;
                                    const StatusIcon = status.icon;
                                    return (
                                        <tr key={item.id} className="hover:bg-surface-bg/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-text-primary">
                                                    {item.transaction_id || '—'}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {item.notes || (item.previous_plan
                                                        ? `${item.previous_plan} → ${item.plan}`
                                                        : item.plan)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <PlanBadge plan={item.plan} size="sm" />
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                                                {formatPrice(item.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-text-primary">{formatDate(item.started_at)}</p>
                                                <p className="text-xs text-text-muted">
                                                    Expires: {formatDate(item.expires_at)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                                                    <StatusIcon size={12} />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-muted">
                                                {item.card_last_four
                                                    ? `•••• ${item.card_last_four}`
                                                    : item.payment_method === 'system'
                                                        ? 'System'
                                                        : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
