import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowDown, Calendar, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { orderService, productService } from '../../services';
import Skeleton from '../../components/ui/Skeleton';
import { formatPrice } from '../../utils/currency';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';
import { PLATFORM_CONFIG } from '../../config/constants';

export default function SellerFinance() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { canAccess, currentPlan } = useSubscription();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ available: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    // Gate check — Advanced Analytics / Finance requires Pro+
    if (!canAccess('advanced_analytics')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature={t('sellerFinance.upgrade.title', 'Finance & Advanced Analytics')}
                    requiredPlan="pro"
                    message={t('sellerFinance.upgrade.message', 'Unlock advanced financial analytics with conversion funnels, detailed transaction tracking, and payout management. Upgrade to Pro.')}
                    variant="card"
                />
            </div>
        );
    }


    useEffect(() => {
        if (!user) return;

        Promise.all([
            orderService.getSellerOrders(user.id),
            productService.getProductsBySeller(user.id)
        ]).then(([orders, products]) => {
            let available = 0;
            let pending = 0;
            const txns = [];

            // We apply a standard platform fee
            const FEE_RATE = PLATFORM_CONFIG.DEFAULT_FEE_RATE;

            orders.forEach(order => {
                const amount = order.subtotal || 0;
                const fee = amount * FEE_RATE;
                const net = amount - fee;

                if (order.status === 'delivered') {
                    available += net;
                } else {
                    pending += net;
                }

                order.items.forEach(item => {
                    const product = products.find(p => String(p.id) === String(item.productId));
                    const itemAmount = item.priceAtPurchase * item.quantity;
                    const itemFee = itemAmount * FEE_RATE;
                    const itemNet = itemAmount - itemFee;

                    txns.push({
                        id: `TXN-${order.id.split('-')[0].toUpperCase()}-${item.productId}`,
                        date: order.createdAt,
                        type: 'sale',
                        description: `${product ? product.title : t('common.product', 'Product')} × ${item.quantity}`,
                        amount: itemAmount,
                        fee: itemFee,
                        net: itemNet,
                        status: order.status
                    });
                });
            });


            // Sort by date descending
            txns.sort((a, b) => new Date(b.date) - new Date(a.date));

            setTransactions(txns);
            setStats({ available, pending });
            setLoading(false);
        }).catch(console.error);
    }, [user]);

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-text-primary">{t('sellerFinance.title')}</h2>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl hover:bg-surface-bg transition-colors">
                    <Download size={15} /> {t('sellerFinance.exportCsv')}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign size={16} className="text-green-600" />
                        </div>
                        <span className="text-sm text-text-muted">{t('sellerFinance.stats.available')}</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">
                        {formatPrice(stats.available)}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <TrendingUp size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-text-muted">{t('sellerFinance.stats.pending', 'Pending Settlement')}</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">
                        {formatPrice(stats.pending)}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Calendar size={16} className="text-amber-600" />
                        </div>
                        <span className="text-sm text-text-muted">{t('sellerFinance.stats.payout', 'Next Payout')}</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">
                        {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(t('common.locale', 'en-US'), { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{t('sellerFinance.stats.est', 'Est.')} {formatPrice(stats.available)}</p>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-border-soft">
                    <h3 className="font-semibold text-text-primary">{t('sellerFinance.transactions.title')}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerFinance.transactions.table.id')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerFinance.transactions.table.date')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerFinance.transactions.table.type')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerFinance.transactions.table.description')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">{t('sellerFinance.transactions.table.amount')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">{t('sellerFinance.transactions.table.fee')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">{t('sellerFinance.transactions.table.net')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-8 text-center text-text-muted">{t('sellerFinance.transactions.table.loading')}</td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-8 text-center text-text-muted">{t('sellerFinance.transactions.table.noTransactions')}</td>
                                </tr>
                            ) : transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">{txn.id}</td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">
                                        {new Date(txn.date).toLocaleDateString(t('common.locale', 'en-US'), { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                          ${txn.type === 'sale' ? 'text-green-600 bg-green-50'
                                                : txn.type === 'payout' ? 'text-blue-600 bg-blue-50'
                                                    : 'text-red-500 bg-red-50'}`}>
                                            {t(`sellerFinance.transactions.type.${txn.type}`, txn.type)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted truncate max-w-[200px]">{txn.description}</td>
                                    <td className={`px-5 py-3.5 text-sm font-medium text-right ${txn.amount >= 0 ? 'text-text-primary' : 'text-red-500'}`}>
                                        {txn.amount >= 0 ? '+' : ''}{formatPrice(Math.abs(txn.amount))}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted text-right">
                                        {txn.fee !== 0 ? `${formatPrice(Math.abs(txn.fee))}` : '—'}
                                    </td>
                                    <td className={`px-5 py-3.5 text-sm font-semibold text-right ${txn.net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {txn.net >= 0 ? '+' : ''}{formatPrice(Math.abs(txn.net))}
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
