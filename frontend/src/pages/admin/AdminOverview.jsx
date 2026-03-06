import React, { useState, useEffect } from 'react';
import { Users, Store, ShoppingBag, DollarSign, ArrowUp, ArrowDown, TrendingUp, Package, Star } from 'lucide-react';
import { adminService } from '../../services';
import Skeleton from '../../components/ui/Skeleton';

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

function MiniBarChart({ data = [] }) {
    if (!data.length) return <div className="h-28 flex items-center justify-center text-text-muted">No data</div>;

    const max = Math.max(...data.map(d => d.sales)) || 1;
    return (
        <div className="flex items-end gap-1.5 h-28">
            {data.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                        className="w-full rounded-t-md bg-brand-primary/80 hover:bg-brand-primary transition-colors min-h-[4px] relative"
                        style={{ height: `${(val.sales / max) * 100}%` }}
                    >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                            {val.sales} sales
                        </div>
                    </div>
                    <span className="text-[9px] text-text-muted">{val.date.substring(0, 1)}</span>
                </div>
            ))}
        </div>
    );
}

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getPlatformStats()
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const displayStats = stats ? [
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+12', up: true, icon: Users },
        { label: 'Active Sellers', value: stats.sellerCount.toLocaleString(), change: '+3', up: true, icon: Store },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: '+18%', up: true, icon: ShoppingBag },
        { label: 'Platform Revenue', value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: '+5.2%', up: true, icon: DollarSign },
    ] : [];

    if (loading) {
        return <div className="p-8 text-center text-text-muted">Loading overview...</div>;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Platform Overview</h2>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {displayStats.map((stat) => (
                    <div key={stat.label} className="bg-white p-5 rounded-2xl border border-border-soft flex flex-col justify-between">
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
                        <span className="text-xs text-text-muted bg-surface-bg px-2.5 py-1 rounded-lg">Last 7 Days</span>
                    </div>
                    <MiniBarChart data={stats.salesData} />
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
                                    <td className="px-6 py-3.5 text-sm text-text-primary"><span className="inline-flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /> {seller.rating}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
