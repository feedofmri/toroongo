import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Package, ShoppingBag, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService, productService } from '../../services';

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
    const { user } = useAuth();
    const [stats, setStats] = useState({ revenue: 0, orderCount: 0, productsCount: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        Promise.all([
            orderService.getSellerOrders(user.id),
            productService.getProductsBySeller(user.id)
        ]).then(([orders, products]) => {
            const revenue = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
            setStats({
                revenue,
                orderCount: orders.length,
                productsCount: products.length
            });

            // Calculate top products
            const productSales = {};
            orders.forEach(order => {
                order.items.forEach(item => {
                    if (!productSales[item.productId]) {
                        productSales[item.productId] = { sold: 0, revenue: 0 };
                    }
                    productSales[item.productId].sold += item.quantity;
                    productSales[item.productId].revenue += item.quantity * item.priceAtPurchase;
                });
            });

            const top = Object.entries(productSales)
                .map(([id, data]) => {
                    const p = products.find(prod => String(prod.id) === String(id));
                    return {
                        name: p ? p.title : `Product #${id}`,
                        sold: data.sold,
                        revenue: data.revenue
                    };
                })
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 3);

            setTopProducts(top);
            setRecentOrders(orders.slice(0, 4));
            setLoading(false);
        }).catch(console.error);

    }, [user]);

    const displayStats = [
        { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, change: '+12.5%', up: true, icon: DollarSign },
        { label: 'Total Orders', value: stats.orderCount, change: '+8.2%', up: true, icon: ShoppingBag },
        { label: 'Products Listed', value: stats.productsCount, change: '+3', up: true, icon: Package },
        { label: 'Store Views', value: '12.4K', change: '-2.1%', up: false, icon: Eye },
    ];

    if (loading) {
        return <div className="p-8 text-center text-text-muted">Loading dashboard...</div>;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {displayStats.map((stat) => (
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
                        {topProducts.length === 0 ? (
                            <p className="text-sm text-text-muted">No sales yet.</p>
                        ) : topProducts.map((product, idx) => (
                            <div key={product.name} className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-surface-bg rounded-lg flex items-center justify-center text-xs font-bold text-text-muted">
                                    {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                                    <p className="text-xs text-text-muted">{product.sold} sold</p>
                                </div>
                                <span className="text-sm font-semibold text-text-primary">${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">No orders yet</td>
                                </tr>
                            ) : recentOrders.map((order) => {
                                const customerName = order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : 'Guest';
                                return (
                                    <tr key={order.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-6 py-3.5 text-sm font-medium text-text-primary">TRG-{order.id.split('-')[0].toUpperCase()}</td>
                                        <td className="px-6 py-3.5 text-sm text-text-muted">{customerName}</td>
                                        <td className="px-6 py-3.5 text-sm text-text-muted">
                                            <span className="line-clamp-1">{order.items.length > 0 ? `${order.items[0].quantity}x items` : 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm font-medium text-text-primary">${(order.subtotal || 0).toFixed(2)}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.processing}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
