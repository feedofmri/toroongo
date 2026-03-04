import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Truck, CheckCircle, Clock, ChevronDown } from 'lucide-react';

const MOCK_ORDERS = [
    {
        id: 'TRG-A8F2K1',
        date: '2026-02-28',
        status: 'delivered',
        total: 348.00,
        items: [
            { title: 'Sony WH-1000XM5 Headphones', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=100', qty: 1, price: 348.00 },
        ],
        seller: 'Sony Electronics',
    },
    {
        id: 'TRG-K9M3P2',
        date: '2026-03-01',
        status: 'shipped',
        total: 141.99,
        items: [
            { title: 'Vitamin C Brightening Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100', qty: 2, price: 84.00 },
            { title: 'Retinol Night Cream', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=100', qty: 1, price: 58.00 },
        ],
        seller: 'NaturGlow',
    },
    {
        id: 'TRG-X5J8W4',
        date: '2026-03-03',
        status: 'processing',
        total: 199.00,
        items: [
            { title: 'Keychron Q1 Pro Keyboard', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=100', qty: 1, price: 199.00 },
        ],
        seller: 'TechVault',
    },
];

const STATUS_CONFIG = {
    processing: { label: 'Processing', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-600 bg-blue-50' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
};

export default function OrderHistory() {
    const [filter, setFilter] = useState('all');

    const filteredOrders = filter === 'all'
        ? MOCK_ORDERS
        : MOCK_ORDERS.filter((o) => o.status === filter);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-text-primary">My Orders</h2>
                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-border-soft rounded-lg
                     text-text-primary cursor-pointer hover:border-gray-300 focus:border-brand-primary
                     focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                    >
                        <option value="all">All Orders</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
            </div>

            {/* Orders list */}
            <div className="space-y-4">
                {filteredOrders.map((order) => {
                    const statusCfg = STATUS_CONFIG[order.status];
                    const StatusIcon = statusCfg.icon;

                    return (
                        <div key={order.id} className="border border-border-soft rounded-2xl overflow-hidden">
                            {/* Order header */}
                            <div className="px-5 py-3 bg-surface-bg border-b border-border-soft flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-semibold text-text-primary">{order.id}</span>
                                    <span className="text-text-muted">
                                        {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.color}`}>
                                        <StatusIcon size={12} />
                                        {statusCfg.label}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-border-soft">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="p-5 flex gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-bg flex-shrink-0 border border-border-soft">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-primary line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-text-muted mt-0.5">Sold by {order.seller} · Qty: {item.qty}</p>
                                            <p className="text-sm font-semibold text-text-primary mt-1">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order footer */}
                            <div className="px-5 py-3 border-t border-border-soft flex items-center justify-between">
                                <span className="text-sm text-text-muted">
                                    Total: <span className="font-bold text-text-primary">${order.total.toFixed(2)}</span>
                                </span>
                                <div className="flex gap-2">
                                    {order.status === 'shipped' && (
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary/15 transition-colors">
                                            <Truck size={13} /> Track
                                        </button>
                                    )}
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted border border-border-soft rounded-lg hover:bg-surface-bg transition-colors">
                                        <Eye size={13} /> Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-16">
                        <Package size={40} className="mx-auto text-text-muted/40 mb-4" />
                        <p className="text-text-primary font-medium mb-1">No orders found</p>
                        <p className="text-sm text-text-muted">Try changing your filter or start shopping!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
