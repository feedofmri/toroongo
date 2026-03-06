import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Truck, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services';
import { useProduct } from '../../context/ProductContext';
import Skeleton from '../../components/ui/Skeleton';

const STATUS_CONFIG = {
    processing: { label: 'Processing', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-600 bg-blue-50' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
};

export default function OrderHistory() {
    const { user } = useAuth();
    const { products: allProducts } = useProduct();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (user) {
            orderService.getUserOrders(user.id)
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(console.error);
        }
    }, [user]);

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter((o) => o.status === filter);

    const getProductInfo = (productId) => {
        const p = allProducts.find(pr => String(pr.id) === String(productId));
        return p || { title: 'Unknown Product', imageUrl: '', sellerId: 'Unknown' };
    };

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
                {loading ? (
                    <div className="text-center py-16 text-text-muted">Loading orders...</div>
                ) : filteredOrders.map((order) => {
                    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
                    const StatusIcon = statusCfg.icon;

                    return (
                        <div key={order.id} className="border border-border-soft rounded-2xl overflow-hidden">
                            {/* Order header */}
                            <div className="px-5 py-3 bg-surface-bg border-b border-border-soft flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-semibold text-text-primary">TRG-{order.id.split('-')[0].toUpperCase()}</span>
                                    <span className="text-text-muted">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                                {order.items.map((item, idx) => {
                                    const pInfo = getProductInfo(item.productId);
                                    return (
                                        <div key={idx} className="p-5 flex gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-bg flex-shrink-0 border border-border-soft">
                                                {pInfo.imageUrl ? <img src={pInfo.imageUrl} alt={pInfo.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-border-soft"></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-text-primary line-clamp-1">{pInfo.title}</p>
                                                <p className="text-xs text-text-muted mt-0.5">Sold by {pInfo.sellerId} · Qty: {item.quantity}</p>
                                                <p className="text-sm font-semibold text-text-primary mt-1">${(item.priceAtPurchase).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Order footer */}
                            <div className="px-5 py-3 border-t border-border-soft flex items-center justify-between">
                                <span className="text-sm text-text-muted">
                                    Total: <span className="font-bold text-text-primary">${order.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0).toFixed(2)}</span>
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

                {!loading && filteredOrders.length === 0 && (
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
