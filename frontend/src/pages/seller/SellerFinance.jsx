import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowDown, Calendar, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService, productService } from '../../services';
import Skeleton from '../../components/ui/Skeleton';

export default function SellerFinance() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ available: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        Promise.all([
            orderService.getSellerOrders(user.id),
            productService.getProductsBySeller(user.id)
        ]).then(([orders, products]) => {
            let available = 0;
            let pending = 0;
            const txns = [];

            // We apply a standard 10% platform fee
            const FEE_RATE = 0.10;

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
                        type: 'Sale',
                        description: `${product ? product.title : 'Product'} × ${item.quantity}`,
                        amount: itemAmount,
                        fee: itemFee,
                        net: itemNet,
                        status: order.status
                    });
                });
            });

            // Add a mock payout just for visual completeness if there are transactions
            if (txns.length > 0) {
                txns.push({
                    id: 'TXN-PAYOUT-001',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    type: 'Payout',
                    description: 'Weekly payout → Bank ****4567',
                    amount: -1245.60,
                    fee: 0,
                    net: -1245.60,
                    status: 'completed'
                });
            }

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
                    <p className="text-2xl font-bold text-text-primary">
                        ${stats.available.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <TrendingUp size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-text-muted">Pending Settlement</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">
                        ${stats.pending.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Calendar size={16} className="text-amber-600" />
                        </div>
                        <span className="text-sm text-text-muted">Next Payout</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">
                        {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">Est. ${stats.available.toFixed(2)}</p>
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
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-8 text-center text-text-muted">Loading transactions...</td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-8 text-center text-text-muted">No transactions yet.</td>
                                </tr>
                            ) : transactions.map((txn) => (
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
                                    <td className="px-5 py-3.5 text-sm text-text-muted truncate max-w-[200px]">{txn.description}</td>
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
