import React from 'react';
import { Users, Store, ShoppingBag, DollarSign, ArrowUp, ArrowDown, TrendingUp, Package } from 'lucide-react';

const STATS = [
    { label: 'Total Users', value: '24,580', change: '+840', up: true, icon: Users },
    { label: 'Active Sellers', value: '1,234', change: '+56', up: true, icon: Store },
    { label: 'Total Orders', value: '18.2K', change: '+1.2K', up: true, icon: ShoppingBag },
    { label: 'Platform Revenue', value: '$182K', change: '+$14K', up: true, icon: DollarSign },
];

const TOP_SELLERS = [
    { name: 'Sony Electronics', revenue: 82400, orders: 384, rating: 4.8 },
    { name: 'Urban Threads', revenue: 64200, orders: 520, rating: 4.6 },
    { name: 'NaturGlow', revenue: 45800, orders: 290, rating: 4.9 },
    { name: 'TechVault', revenue: 38200, orders: 260, rating: 4.7 },
];

const RECENT_ACTIVITY = [
    { text: 'New seller "ArtisanCraft" registered', time: '5 min ago', type: 'seller' },
    { text: 'Dispute #D-2847 resolved (ref: TRG-X8K)', time: '15 min ago', type: 'dispute' },
    { text: 'Category "Pet Supplies" added', time: '1 hour ago', type: 'category' },
    { text: 'Monthly payout processed ($42,800)', time: '2 hours ago', type: 'finance' },
    { text: 'User report: seller #412 flagged', time: '3 hours ago', type: 'dispute' },
];

function MiniBarChart() {
    const bars = [45, 65, 80, 55, 90, 70, 85, 95, 75, 88, 92, 98];
    const max = Math.max(...bars);
    return (
        <div className="flex items-end gap-1.5 h-28">
            {bars.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md bg-brand-primary/80 hover:bg-brand-primary transition-colors min-h-[4px]" style={{ height: `${(val / max) * 100}%` }} />
                    <span className="text-[9px] text-text-muted">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}</span>
                </div>
            ))}
        </div>
    );
}

export default function AdminOverview() {
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Platform Overview</h2>

            {/* Stats */}
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
                            {stat.change} <span className="text-text-muted font-normal">this month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-soft">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-text-primary">Platform Growth</h3>
                        <span className="text-xs text-text-muted bg-surface-bg px-2.5 py-1 rounded-lg">Monthly Orders</span>
                    </div>
                    <MiniBarChart />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="font-semibold text-text-primary mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {RECENT_ACTIVITY.map((item, idx) => (
                            <div key={idx} className="flex gap-3">
                                <div className="w-2 h-2 rounded-full mt-1.5 bg-brand-primary flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-text-primary leading-snug">{item.text}</p>
                                    <p className="text-[10px] text-text-muted mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Sellers */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-border-soft">
                    <h3 className="font-semibold text-text-primary">Top Sellers</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">#</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Seller</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Revenue</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Orders</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {TOP_SELLERS.map((seller, idx) => (
                                <tr key={seller.name} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-6 py-3.5 text-sm font-bold text-text-muted">{idx + 1}</td>
                                    <td className="px-6 py-3.5 text-sm font-medium text-text-primary">{seller.name}</td>
                                    <td className="px-6 py-3.5 text-sm font-medium text-text-primary">${seller.revenue.toLocaleString()}</td>
                                    <td className="px-6 py-3.5 text-sm text-text-muted">{seller.orders}</td>
                                    <td className="px-6 py-3.5 text-sm text-text-primary">⭐ {seller.rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
