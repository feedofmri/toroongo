import React, { useState } from 'react';
import { Search, ChevronDown, Eye, Truck, CheckCircle, Clock, Package, RotateCcw, CreditCard } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services';
import { formatPrice, formatPriceInCurrency, convertCurrency } from '../../utils/currency';
import { useProduct } from '../../context/ProductContext';
import Skeleton from '../../components/ui/Skeleton';
import OrderDetailModal from '../../components/ui/OrderDetailModal';
import { PLATFORM_CONFIG } from '../../config/constants';

const STATUS_CONFIG = {
    processing: { labelKey: 'processing', icon: Clock, style: 'text-amber-600 bg-amber-50' },
    shipped: { labelKey: 'shipped', icon: Truck, style: 'text-blue-600 bg-blue-50' },
    delivered: { labelKey: 'delivered', icon: CheckCircle, style: 'text-green-600 bg-green-50' },
    returned: { labelKey: 'returned', icon: RotateCcw, style: 'text-purple-600 bg-purple-50' },
    refunded: { labelKey: 'refunded', icon: CreditCard, style: 'text-indigo-600 bg-indigo-50' },
    return_requested: { labelKey: 'return_requested', icon: RotateCcw, style: 'text-red-600 bg-red-50' },
};


export default function OrderManagement() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { products: allProducts } = useProduct();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = () => {
        if (user) {
            setLoading(true);
            orderService.getSellerOrders(user.id)
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    };

    React.useEffect(() => {
        fetchOrders();
    }, [user]);

    const filtered = orders.filter((o) => {
        const matchesFilter = filter === 'all' || o.status === filter;
        const matchesSearch = String(o.id).toLowerCase().includes(search.toLowerCase()) ||
            (o.shippingAddress?.firstName || '').toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getProductName = (productId) => {
        const p = allProducts.find(pr => String(pr.id) === String(productId));
        return p ? p.title : t('common.unknownProduct', 'Unknown Product');
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">{t('sellerOrders.title')}</h2>


            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {[
                    { label: t('sellerOrders.stats.pending'), count: orders.filter((o) => o.status === 'processing').length, color: 'text-amber-600' },
                    { label: t('sellerOrders.stats.shipped'), count: orders.filter((o) => o.status === 'shipped').length, color: 'text-blue-600' },
                    { label: t('sellerOrders.stats.completed'), count: orders.filter((o) => o.status === 'delivered').length, color: 'text-green-600' },
                    { label: t('sellerOrders.stats.return_requested'), count: orders.filter((o) => o.status === 'return_requested').length, color: 'text-red-600' },
                    { label: t('sellerOrders.stats.returned'), count: orders.filter((o) => o.status === 'returned').length, color: 'text-purple-600' },
                    { label: t('sellerOrders.stats.refunded'), count: orders.filter((o) => o.status === 'refunded').length, color: 'text-indigo-600' },
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
                        placeholder={t('sellerOrders.filters.searchPlaceholder')}
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
                        <option value="all">{t('sellerOrders.filters.allStatus')}</option>
                        <option value="processing">{t('sellerOrders.filters.processing')}</option>
                        <option value="shipped">{t('sellerOrders.filters.shipped')}</option>
                        <option value="delivered">{t('sellerOrders.filters.delivered')}</option>
                        <option value="return_requested">{t('sellerOrders.filters.return_requested')}</option>
                        <option value="returned">{t('sellerOrders.filters.returned')}</option>
                        <option value="refunded">{t('sellerOrders.filters.refunded')}</option>
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
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerOrders.table.order')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerOrders.table.date')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerOrders.table.customer')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerOrders.table.product')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerOrders.table.total')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerOrders.table.status')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">{t('sellerOrders.table.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-8 text-center text-text-muted">{t('sellerOrders.table.loading')}</td>
                                </tr>
                            ) : filtered.map((order) => {
                                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
                                const firstItem = order.items[0];
                                const productName = firstItem ? getProductName(firstItem.productId) : t('common.na', 'N/A');
                                const customerName = order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : t('common.guest', 'Guest');
                                const customerEmail = order.shippingAddress?.email || t('common.na', 'N/A');

                                return (
                                    <tr key={order.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">{PLATFORM_CONFIG.ORDER_ID_PREFIX}{String(order.id).split('-')[0].toUpperCase()}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">
                                            {new Date(order.createdAt).toLocaleDateString(t('common.locale', 'en-US'), { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-medium text-text-primary">{customerName}</p>
                                            <p className="text-[11px] text-text-muted">{customerEmail}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">
                                            <span className="line-clamp-1">{productName}</span>
                                            {order.items.length > 1 && <span className="text-xs text-brand-primary">{t('sellerOrders.table.moreItems', { count: order.items.length - 1 })}</span>}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-text-primary">
                                            {formatPriceInCurrency(
                                                convertCurrency(
                                                    order.subtotal || 0,
                                                    order.seller_currency_code || 'USD',
                                                    user?.currency_code || 'USD'
                                                ),
                                                user?.currency_code
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${cfg.style}`}>
                                                <cfg.icon size={11} /> {t(`sellerOrders.filters.${cfg.labelKey}`)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button 
                                                onClick={() => setSelectedOrderId(order.id)}
                                                className="text-xs font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                                            >
                                                {t('sellerOrders.table.view')}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-12">
                        <Package size={32} className="mx-auto text-text-muted/40 mb-3" />
                        <p className="text-text-primary font-medium">{t('sellerOrders.table.noOrders')}</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <OrderDetailModal 
                orderId={selectedOrderId} 
                onClose={() => setSelectedOrderId(null)} 
                onUpdate={fetchOrders}
            />
        </div>
    );
}
