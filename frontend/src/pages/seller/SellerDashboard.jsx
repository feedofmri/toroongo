import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Package, ShoppingBag, ArrowUp, ArrowDown, Eye, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { orderService, productService } from '../../services';
import { formatPrice, formatPriceInCurrency, convertCurrency } from '../../utils/currency';
import { PLANS, getNextPlan } from '../../data/planConfig';
import PlanBadge from '../../components/subscription/PlanBadge';
import PlanFeaturesWidget from '../../components/subscription/PlanFeaturesWidget';
import { PLATFORM_CONFIG, STATUS_STYLES } from '../../config/constants';

// Status styles moved to constants.js

// Simple bar chart component
function MiniBarChart({ data = [] }) {
    const bars = data.length > 0 ? data : [65, 80, 45, 90, 70, 85, 60, 95, 75, 88, 92, 78];
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

function PlanSummaryCard() {
    const { t } = useTranslation();
    const { currentPlan, planDetails, nextPlan, productCount, productLimit } = useSubscription();
    const nextPlanData = nextPlan ? PLANS[nextPlan] : null;

    return (
        <div className="mb-6">
            <div className="bg-white rounded-2xl border border-border-soft p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${planDetails.color}15` }}
                    >
                        <Crown size={20} style={{ color: planDetails.color }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-text-primary">
                                {planDetails.name} Plan
                            </span>
                            <PlanBadge plan={currentPlan} size="sm" showIcon={false} />
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                            {productLimit
                                ? `${productCount}/${productLimit} products used`
                                : `${productCount} products (Unlimited)`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {nextPlanData && (
                        <button
                            onClick={() => navigate('/seller/subscription')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-primary/20 transition-all"
                        >
                            <Sparkles size={14} />
                            Upgrade to {nextPlanData.name}
                            <ArrowRight size={14} />
                        </button>
                    )}
                    <Link
                        to="/seller/subscription"
                        className="px-4 py-2 border border-border-soft text-text-muted text-sm font-medium rounded-xl hover:border-brand-primary hover:text-brand-primary transition-colors"
                    >
                        Manage Plan
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SellerDashboard() {
    const { t } = useTranslation();
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
            const revenue = orders.reduce((sum, order) => {
                return sum + convertCurrency(
                    order.subtotal || 0,
                    order.seller_currency_code || 'USD',
                    user?.currency_code || 'USD'
                );
            }, 0);

            setStats({
                revenue,
                orderCount: orders.length,
                productsCount: products.length
            });

            // Calculate top products
            const productSales = {};
            orders.forEach(order => {
                const sellerCurrency = order.seller_currency_code || 'USD';
                const userCurrency = user?.currency_code || 'USD';

                order.items.forEach(item => {
                    if (!productSales[item.productId]) {
                        productSales[item.productId] = { sold: 0, revenue: 0 };
                    }
                    productSales[item.productId].sold += item.quantity;

                    const priceInSellerCurrency = convertCurrency(
                        item.priceAtPurchase || 0,
                        sellerCurrency,
                        userCurrency
                    );
                    productSales[item.productId].revenue += item.quantity * priceInSellerCurrency;
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
        { label: t('sellerDashboard.stats.totalRevenue'), value: formatPriceInCurrency(stats.revenue, user?.currency_code), change: '+12.5%', up: true, icon: DollarSign },
        { label: t('sellerDashboard.stats.totalOrders'), value: stats.orderCount, change: stats.orderCount > 0 ? '+100%' : '0%', up: true, icon: ShoppingBag },
        { label: t('sellerDashboard.stats.productsListed'), value: stats.productsCount, change: `+${stats.productsCount}`, up: true, icon: Package },
        { label: t('sellerDashboard.stats.storeViews'), value: user?.store_views || '0', change: '0%', up: true, icon: Eye },
    ];

    if (loading) {
        return <div className="p-8 text-center text-text-muted">{t('sellerDashboard.recentOrders.loading')}</div>;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">{t('sellerDashboard.nav.dashboard')}</h2>

            {/* Plan Summary + Upgrade CTA */}
            <PlanSummaryCard />

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
                            {stat.change} <span className="text-text-muted font-normal">{t('sellerDashboard.stats.vsLastMonth')}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-soft">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-text-primary">{t('sellerDashboard.revenueOverview.title')}</h3>
                        <span className="text-xs text-text-muted bg-surface-bg px-2.5 py-1 rounded-lg">{t('sellerDashboard.revenueOverview.last12Months')}</span>
                    </div>
                    <MiniBarChart data={stats.monthlyRevenue || []} />
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="font-semibold text-text-primary mb-4">{t('sellerDashboard.topProducts.title')}</h3>
                    <div className="space-y-4">
                        {topProducts.length === 0 ? (
                            <p className="text-sm text-text-muted">{t('sellerDashboard.topProducts.noSales')}</p>
                        ) : topProducts.map((product, idx) => (
                            <div key={product.name} className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-surface-bg rounded-lg flex items-center justify-center text-xs font-bold text-text-muted">
                                    {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                                    <p className="text-xs text-text-muted">{product.sold} {t('sellerDashboard.topProducts.sold')}</p>
                                </div>
                                <span className="text-sm font-semibold text-text-primary">
                                    {formatPriceInCurrency(product.revenue, user?.currency_code)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-border-soft">
                    <h3 className="font-semibold text-text-primary">{t('sellerDashboard.recentOrders.title')}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDashboard.recentOrders.order')}</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDashboard.recentOrders.customer')}</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDashboard.recentOrders.product')}</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDashboard.recentOrders.total')}</th>
                                <th className="px-6 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDashboard.recentOrders.status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">{t('sellerDashboard.recentOrders.noOrders')}</td>
                                </tr>
                            ) : recentOrders.map((order) => {
                                const customerName = order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : 'Guest';
                                return (
                                    <tr key={order.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-6 py-3.5 text-sm font-medium text-text-primary">{PLATFORM_CONFIG.ORDER_ID_PREFIX}{String(order.id).split('-')[0].toUpperCase()}</td>
                                        <td className="px-6 py-3.5 text-sm text-text-muted">{customerName}</td>
                                        <td className="px-6 py-3.5 text-sm text-text-muted">
                                            <span className="line-clamp-1">{order.items.length > 0 ? `${order.items[0].quantity}x items` : 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm font-medium text-text-primary">
                                            {formatPriceInCurrency(order.subtotal || 0, user?.currency_code)}
                                        </td>
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

            {/* Plan Features Overview (Moved to bottom) */}
            <div className="mb-8">
                <PlanFeaturesWidget />
            </div>
        </div>
    );
}
