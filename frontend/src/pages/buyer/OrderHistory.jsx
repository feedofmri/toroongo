import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Package, Eye, Truck, CheckCircle, Clock, ChevronDown, XCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services';
import { formatPrice } from '../../utils/currency';
import { useProduct } from '../../context/ProductContext';
import Skeleton from '../../components/ui/Skeleton';

const STATUS_CONFIG = {
    processing: { icon: Clock, color: 'text-amber-600 bg-amber-50' },
    shipped: { icon: Truck, color: 'text-blue-600 bg-blue-50' },
    delivered: { icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    cancelled: { icon: XCircle, color: 'text-red-600 bg-red-50' },
};

import OrderDetailModal from '../../components/ui/OrderDetailModal';
import ReviewModal from '../../components/ui/ReviewModal';

export default function OrderHistory() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { products: allProducts } = useProduct();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [reviewingProduct, setReviewingProduct] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState(null);

    const fetchOrders = () => {
        if (user) {
            orderService.getUserOrders(user.id)
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(console.error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const handleCancelOrder = async () => {
        if (!cancellingOrder || !cancelReason) return;
        setIsCancelling(true);
        try {
            await orderService.cancelOrder(cancellingOrder, cancelReason);
            setCancellingOrder(null);
            setCancelReason('');
            fetchOrders();
        } catch (error) {
            alert(t('orders.cancelError') + error.message);
        } finally {
            setIsCancelling(false);
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter((o) => o.status === filter);

    const getProductInfo = (productId) => {
        const p = allProducts.find(pr => String(pr.id) === String(productId));
        return p || { title: t('product.unknownProduct'), imageUrl: '', sellerId: t('product.unknownSeller') };
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-text-primary">{t('orders.title')}</h2>
                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-border-soft rounded-lg
                     text-text-primary cursor-pointer hover:border-gray-300 focus:border-brand-primary
                     focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                    >
                        <option value="all">{t('orders.allOrders')}</option>
                        <option value="processing">{t('orders.processing')}</option>
                        <option value="shipped">{t('orders.shipped')}</option>
                        <option value="delivered">{t('orders.delivered')}</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
            </div>

            {/* Orders list */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-16 text-text-muted">{t('orders.loading')}</div>
                ) : filteredOrders.map((order) => {
                    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
                    const StatusIcon = statusCfg.icon;

                    return (
                        <div key={order.id} className="border border-border-soft rounded-2xl overflow-hidden">
                            {/* Order header */}
                            <div className="px-5 py-3 bg-surface-bg border-b border-border-soft flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-semibold text-text-primary">{t('orders.orderNo', { id: String(order.id).split('-')[0].toUpperCase() })}</span>
                                    <span className="text-text-muted">
                                        {new Date(order.createdAt).toLocaleDateString(t('common.dateLocale') || 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.color}`}>
                                        <StatusIcon size={12} />
                                        {t(`orders.${order.status}`)}
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
                                                <p className="text-xs text-text-muted mt-0.5">{t('orders.soldBy', { seller: pInfo.sellerId })} · {t('orders.qty')}: {item.quantity}</p>
                                                <p className="text-sm font-semibold text-text-primary mt-1">{formatPrice((item.priceAtPurchase))}</p>
                                            </div>
                                            {order.status === 'delivered' && !item.is_reviewed && (
                                                <button
                                                    onClick={() => {
                                                        setReviewingProduct(pInfo);
                                                        setActiveOrderId(order.id);
                                                    }}
                                                    className="flex-shrink-0 self-center px-3 py-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary/20 transition-colors"
                                                >
                                                    {t('orders.rateProduct', 'Rate Product')}
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Order footer */}
                            <div className="px-5 py-3 border-t border-border-soft flex items-center justify-between">
                                <span className="text-sm text-text-muted">
                                    {t('orders.total')} <span className="font-bold text-text-primary">{formatPrice(order.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0))}</span>
                                </span>
                                <div className="flex gap-2">
                                    {order.status === 'processing' && (
                                        <button
                                            onClick={() => setCancellingOrder(order.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <XCircle size={13} /> {t('orders.cancelOrder')}
                                        </button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary/15 transition-colors">
                                            <Truck size={13} /> {t('orders.track')}
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setSelectedOrderId(order.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted border border-border-soft rounded-lg hover:bg-surface-bg transition-colors"
                                    >
                                        <Eye size={13} /> {t('orders.details')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!loading && filteredOrders.length === 0 && (
                    <div className="text-center py-16">
                        <Package size={40} className="mx-auto text-text-muted/40 mb-4" />
                        <p className="text-text-primary font-medium mb-1">{t('orders.noOrders')}</p>
                        <p className="text-sm text-text-muted">{t('orders.noOrdersDesc')}</p>
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {cancellingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface-bg w-full max-w-md rounded-2xl p-6 shadow-xl border border-border-soft flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-primary">{t('orders.cancelTitle')}</h3>
                            <button onClick={() => setCancellingOrder(null)} className="p-1 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-100"><X size={20} /></button>
                        </div>
                        <p className="text-sm text-text-muted mb-4">{t('orders.cancelDesc')}</p>

                        <select
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full mb-6 p-3 bg-white border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        >
                            <option value="">{t('orders.selectReason')}</option>
                            <option value="Changed my mind">{t('orders.reasons.changedMind')}</option>
                            <option value="Found a better price elsewhere">{t('orders.reasons.betterPrice')}</option>
                            <option value="Ordered by mistake">{t('orders.reasons.mistake')}</option>
                            <option value="Expected delivery time is too long">{t('orders.reasons.longDelivery')}</option>
                            <option value="Other">{t('orders.reasons.other')}</option>
                        </select>

                        <div className="flex gap-3 justify-end mt-auto">
                            <button onClick={() => setCancellingOrder(null)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200">{t('orders.keepOrder')}</button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={!cancelReason || isCancelling}
                                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isCancelling ? t('orders.cancelling') : t('orders.confirmCancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Details Modal */}
            <OrderDetailModal 
                orderId={selectedOrderId} 
                onClose={() => setSelectedOrderId(null)} 
            />

            {/* Review Modal */}
            <ReviewModal 
                isOpen={!!reviewingProduct}
                onClose={() => {
                    setReviewingProduct(null);
                    setActiveOrderId(null);
                }}
                product={reviewingProduct}
                orderId={activeOrderId}
                onReviewSubmitted={() => {
                    // Maybe show a success toast or update UI
                    fetchOrders();
                }}
            />
        </div>
    );
}
