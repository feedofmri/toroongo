import React, { useState } from 'react';
import { Search, ChevronDown, Eye, Truck, CheckCircle, Clock, Package } from 'lucide-react';

const MOCK_ORDERS = [
    { id: 'TRG-X1A', date: '2026-03-03', customer: 'Sarah M.', email: 'sarah@email.com', product: 'Sony WH-1000XM5', qty: 1, total: 348.00, status: 'processing' },
    { id: 'TRG-Y2B', date: '2026-03-02', customer: 'James K.', email: 'james@email.com', product: 'WF-1000XM5 Earbuds', qty: 1, total: 278.00, status: 'shipped' },
    { id: 'TRG-Z3C', date: '2026-03-01', customer: 'Emily R.', email: 'emily@email.com', product: 'Minimalist Desk Lamp', qty: 2, total: 178.00, status: 'delivered' },
    { id: 'TRG-W4D', date: '2026-02-28', customer: 'Michael T.', email: 'michael@email.com', product: 'Sony WH-1000XM5', qty: 1, total: 348.00, status: 'processing' },
    { id: 'TRG-V5E', date: '2026-02-27', customer: 'Anna L.', email: 'anna@email.com', product: 'WF-1000XM5 Earbuds', qty: 3, total: 834.00, status: 'delivered' },
];

const STATUS_CONFIG = {
    processing: { label: 'Processing', icon: Clock, style: 'text-amber-600 bg-amber-50' },
    shipped: { label: 'Shipped', icon: Truck, style: 'text-blue-600 bg-blue-50' },
    delivered: { label: 'Delivered', icon: CheckCircle, style: 'text-green-600 bg-green-50' },
};

export default function OrderManagement() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = MOCK_ORDERS.filter((o) => {
        const matchesFilter = filter === 'all' || o.status === filter;
        const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Orders</h2>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Pending', count: MOCK_ORDERS.filter((o) => o.status === 'processing').length, color: 'text-amber-600' },
                    { label: 'Shipped', count: MOCK_ORDERS.filter((o) => o.status === 'shipped').length, color: 'text-blue-600' },
                    { label: 'Completed', count: MOCK_ORDERS.filter((o) => o.status === 'delivered').length, color: 'text-green-600' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-4 rounded-xl border border-border-soft text-center">
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                        <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border-soft rounded-xl
                     focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-border-soft rounded-xl
                     cursor-pointer hover:border-gray-300 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Order</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Date</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Customer</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Product</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Total</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {filtered.map((order) => {
                                const cfg = STATUS_CONFIG[order.status];
                                return (
                                    <tr key={order.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">{order.id}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">
                                            {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-medium text-text-primary">{order.customer}</p>
                                            <p className="text-[11px] text-text-muted">{order.email}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">
                                            {order.product} <span className="text-text-muted/60">× {order.qty}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-text-primary">${order.total.toFixed(2)}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${cfg.style}`}>
                                                <cfg.icon size={11} /> {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button className="text-xs font-medium text-brand-primary hover:text-brand-secondary transition-colors">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <Package size={32} className="mx-auto text-text-muted/40 mb-3" />
                        <p className="text-text-primary font-medium">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
