import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/currency';
import { useProduct } from '../../context/ProductContext';

const STATUS_CONFIG = {
    processing: { icon: Clock, color: 'text-amber-600 bg-amber-50', label: 'Processing' },
    shipped: { icon: Truck, color: 'text-blue-600 bg-blue-50', label: 'Shipped' },
    delivered: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Delivered' },
    cancelled: { icon: X, color: 'text-red-600 bg-red-50', label: 'Cancelled' },
};

export default function OrderDetailModal({ orderId, onClose, onUpdate }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { products: allProducts } = useProduct();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (orderId) {
            setLoading(true);
            orderService.getOrderById(orderId)
                .then(data => {
                    setOrder(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [orderId]);

    if (!orderId) return null;

    const getProductInfo = (productId) => {
        const p = allProducts.find(pr => String(pr.id) === String(productId));
        return p || { title: 'Unknown Product', imageUrl: '' };
    };

    const handleStatusChange = async (newStatus) => {
        if (!order || updatingStatus) return;
        setUpdatingStatus(true);
        try {
            await orderService.updateOrderStatus(order.id, newStatus);
            // Refresh local state
            const updated = await orderService.getOrderById(order.id);
            setOrder(updated);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const statusCfg = order ? (STATUS_CONFIG[order.status] || STATUS_CONFIG.processing) : STATUS_CONFIG.processing;
    const StatusIcon = statusCfg.icon;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-scale-up">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 text-text-muted hover:text-text-primary hover:bg-surface-bg rounded-full transition-all z-10"
                >
                    <X size={20} />
                </button>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20">
                        <Loader2 size={40} className="text-brand-primary animate-spin mb-4" />
                        <p className="text-text-muted font-medium">Loading order details...</p>
                    </div>
                ) : order ? (
                    <>
                        {/* Header */}
                        <div className="p-6 sm:p-8 bg-surface-bg/50 border-b border-border-soft">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-text-primary">Order Details</h2>
                                    <p className="text-sm text-text-muted mt-1">
                                        TRG-{String(order.id).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${statusCfg.color}`}>
                                    <StatusIcon size={16} />
                                    {statusCfg.label}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                            {/* Grid Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <MapPin size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Shipping To</p>
                                            <p className="text-sm font-medium text-text-primary">
                                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                            </p>
                                            <p className="text-sm text-text-muted leading-relaxed">
                                                {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                            <CreditCard size={20} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Payment Method</p>
                                            <p className="text-sm font-medium text-text-primary">{order.paymentMethod || 'Credit Card'}</p>
                                            <p className="text-sm text-text-muted mt-0.5">Paid securely via Toroongo Pay</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="mb-8">
                                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                                    <Package size={18} className="text-brand-primary" />
                                    Order Items ({order.items.length})
                                </h3>
                                <div className="space-y-4 bg-surface-bg/30 p-4 rounded-2xl border border-border-soft">
                                    {order.items.map((item, idx) => {
                                        const pInfo = getProductInfo(item.productId);
                                        return (
                                            <div key={idx} className="flex gap-4 group">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-border-soft flex-shrink-0">
                                                    <img 
                                                        src={pInfo.imageUrl || 'https://via.placeholder.com/64'} 
                                                        alt={pInfo.title} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-text-primary line-clamp-1">{pInfo.title}</p>
                                                    <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wide">
                                                        Qty: {item.quantity} · {formatPrice(item.priceAtPurchase)} each
                                                    </p>
                                                    <p className="text-sm font-bold text-brand-primary mt-1">
                                                        {formatPrice(item.priceAtPurchase * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="border-t border-border-soft pt-6 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Subtotal</span>
                                    <span className="font-semibold text-text-primary">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Shipping Fee</span>
                                    <span className="font-semibold text-text-primary">{formatPrice(order.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">Estimated Tax</span>
                                    <span className="font-semibold text-text-primary">{formatPrice(order.tax)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-border-soft">
                                    <span className="text-base font-bold text-text-primary">Total Amount</span>
                                    <span className="text-xl font-black text-brand-primary">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 pt-0 sm:p-8 sm:pt-0 bg-white space-y-4">
                            {/* Seller Status Controls */}
                            {user?.role === 'seller' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <div className="p-5 bg-surface-bg border border-border-soft rounded-2xl">
                                    <h4 className="text-sm font-bold text-text-primary mb-3">Seller Management</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {order.status === 'processing' && (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusChange('shipped')}
                                                    disabled={updatingStatus}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition-all disabled:opacity-50"
                                                >
                                                    {updatingStatus ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
                                                    Mark as Shipped
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusChange('cancelled')}
                                                    disabled={updatingStatus}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold border border-red-100 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
                                                >
                                                    Cancel Order
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'shipped' && (
                                            <button 
                                                onClick={() => handleStatusChange('delivered')}
                                                disabled={updatingStatus}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                                            >
                                                {updatingStatus ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={onClose}
                                className="w-full py-3.5 bg-brand-primary/5 text-brand-primary font-bold rounded-2xl hover:bg-brand-primary/10 transition-all"
                            >
                                Close Details
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-20 text-center">
                        <p className="text-text-muted">Order not found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
