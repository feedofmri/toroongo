import React from 'react';
import { DollarSign, TrendingUp, Package, ShoppingBag, ArrowUp, ArrowDown, Eye } from 'lucide-react';

const STATS = [
    { label: 'Total Revenue', value: '$24,580', change: '+12.5%', up: true, icon: DollarSign },
    { label: 'Total Orders', value: '384', change: '+8.2%', up: true, icon: ShoppingBag },
    { label: 'Products Listed', value: '56', change: '+3', up: true, icon: Package },
    { label: 'Store Views', value: '12.4K', change: '-2.1%', up: false, icon: Eye },
];

const RECENT_ORDERS = [
    { id: 'TRG-X1A', customer: 'Sarah M.', product: 'Sony WH-1000XM5', total: 348.00, status: 'shipped' },
    { id: 'TRG-Y2B', customer: 'James K.', product: 'WF-1000XM5 Earbuds', total: 278.00, status: 'processing' },
    { id: 'TRG-Z3C', customer: 'Emily R.', product: 'Minimalist Desk Lamp', total: 89.00, status: 'delivered' },
    { id: 'TRG-W4D', customer: 'Michael T.', product: 'Sony WH-1000XM5', total: 348.00, status: 'processing' },
];

const TOP_PRODUCTS = [
    { name: 'Sony WH-1000XM5', sold: 142, revenue: 49416 },
    { name: 'WF-1000XM5 Earbuds', sold: 98, revenue: 27244 },
    { name: 'Minimalist Desk Lamp', sold: 64, revenue: 5696 },
];

const STATUS_STYLES = {
    processing: 'text-amber-600 bg-amber-50',
    shipped: 'text-blue-600 bg-blue-50',
    delivered: 'text-green-600 bg-green-50',
};

// Simple bar chart component
function MiniBarChart() {
    const bars = [65, 80, 45, 90, 70, 85, 60, 95, 75, 88, 92, 78];
    const max = Math.max(...bars);
    return (
        <div className="flex items-end gap-1.5 h-32">
            {bars.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                        className="w-full rounded-t-md bg-brand-primary/80 hover:bg-brand-primary transition-colors min-h-[4px]"
                        style={{ height: `${(val / max) * 100}%` }}
                    />
                    <span className="text-[9px] text-text-muted">
                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function SellerDashboard() {
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STATS.map((stat) => (
                    <div key={stat.label} className="bg-white p-5 rounded-2xl border border-border-soft">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-text-muted">{stat.label}</span>
                            <div className="w-9 h-9 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                <stat.icon size={16} className="text-brand-primary" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                            {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            {stat.change} <span className="text-text-muted font-normal">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-soft">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-text-primary">Revenue Overview</h3>
                        <span className="text-xs text-text-muted bg-surface-bg px-2.5 py-1 rounded-lg">Last 12 months</span>
                    </div>
                    <MiniBarChart />
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="font-semibold text-text-primary mb-4">Top Products</h3>
                    <div className="space-y-4">
                        {TOP_PRODUCTS.map((product, idx) => (
                            <div key={product.name} className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-surface-bg rounded-lg flex items-center justify-center text-xs font-bold text-text-muted">
                                    {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                                    <p className="text-xs text-text-muted">{product.sold} sold</p>
                                </div>
                                <span className="text-sm font-semibold text-text-primary">${product.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-border-soft">
                    <h3 className="font-semibold text-text-primary">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Order</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Customer</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Product</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Total</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {RECENT_ORDERS.map((order) => (
                                <tr key={order.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-6 py-3.5 text-sm font-medium text-text-primary">{order.id}</td>
                                    <td className="px-6 py-3.5 text-sm text-text-muted">{order.customer}</td>
                                    <td className="px-6 py-3.5 text-sm text-text-muted">{order.product}</td>
                                    <td className="px-6 py-3.5 text-sm font-medium text-text-primary">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status]}`}>
                                            {order.status}
                                        </span>
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
