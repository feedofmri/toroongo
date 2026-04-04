import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services';
import { formatPrice } from '../../utils/currency';

export default function OrderConfirmation() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [latestOrder, setLatestOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        orderService.getUserOrders(user.id)
            .then(orders => {
                if (orders.length > 0) {
                    setLatestOrder(orders[0]);
                }
                setLoading(false);
            })
            .catch(console.error);
    }, [user]);

    const orderNumber = latestOrder ? 'TRG-' + latestOrder.id.split('-')[0].toUpperCase() : 'TRG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const createdAt = latestOrder ? new Date(latestOrder.createdAt) : new Date();
    const estimatedDelivery = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    if (loading) {
        return <div className="p-16 text-center text-text-muted">{t('orderConfirmation.loading', 'Loading your order confirmation...')}</div>;
    }

    return (
        <div className="animate-fade-in">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                {/* Success icon */}
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-500" />
                </div>

                <h1 className="text-3xl font-bold text-text-primary mb-3">{t('orderConfirmation.title', 'Order Confirmed!')}</h1>
                <p className="text-text-muted mb-8">
                    {t('orderConfirmation.subtitle', "Thank you for your purchase. We've sent a confirmation email with your order details.")}
                </p>

                {/* Order details card */}
                <div className="bg-surface-bg rounded-2xl border border-border-soft p-6 sm:p-8 mb-8 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{t('orderConfirmation.orderNumber', 'Order Number')}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-bold text-text-primary">{orderNumber}</p>
                                <button
                                    onClick={() => navigator.clipboard.writeText(orderNumber)}
                                    className="p-1 text-text-muted hover:text-brand-primary transition-colors"
                                    aria-label={t('orderConfirmation.copyOrderNumber', 'Copy order number')}
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{t('orderConfirmation.estimatedDelivery', 'Estimated Delivery')}</p>
                            <p className="text-lg font-bold text-text-primary">{estimatedDelivery}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{t('orderConfirmation.shippingTo', 'Shipping To')}</p>
                            <p className="text-sm text-text-primary">
                                {latestOrder?.shippingAddress ? (
                                    <>
                                        {latestOrder.shippingAddress.firstName} {latestOrder.shippingAddress.lastName}<br />
                                        {latestOrder.shippingAddress.address}, {latestOrder.shippingAddress.city}, {latestOrder.shippingAddress.state} {latestOrder.shippingAddress.zip}
                                    </>
                                ) : t('orderConfirmation.defaultAddress', '123 Main Street, New York, NY 10001')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{t('orderConfirmation.payment', 'Payment')}</p>
                            <p className="text-sm text-text-primary">{latestOrder?.paymentMethod || t('orderConfirmation.defaultPayment', 'Visa ending in •••• 4242')}</p>
                        </div>
                    </div>

                    <div className="border-t border-border-soft mt-6 pt-6 flex justify-between items-center">
                        <span className="text-sm text-text-muted">{t('orderConfirmation.subtotalPaid', 'Subtotal Paid')}</span>
                        <span className="text-2xl font-bold text-text-primary">
                            {latestOrder ? formatPrice(latestOrder.items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0)) : formatPrice(531.97)}
                        </span>
                    </div>
                </div>

                {/* Status tracker */}
                <div className="bg-white rounded-2xl border border-border-soft p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {[
                            { label: t('orderConfirmation.orderPlaced', 'Order Placed'), key: 'placed' },
                            { label: t('orderConfirmation.processing', 'Processing'), key: 'processing' },
                            { label: t('orderConfirmation.shipped', 'Shipped'), key: 'shipped' },
                            { label: t('orderConfirmation.delivered', 'Delivered'), key: 'delivered' }
                        ].map((status, idx) => (
                            <div key={status.key} className="flex flex-col items-center flex-1 relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2
                  ${idx === 0 ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted border border-border-soft'}`}>
                                    {idx === 0 ? <CheckCircle size={16} /> : <Package size={14} />}
                                </div>
                                <span className={`text-xs font-medium ${idx === 0 ? 'text-brand-primary' : 'text-text-muted'}`}>
                                    {status.label}
                                </span>
                                {idx < 3 && (
                                    <div className={`absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-px
                    ${idx === 0 ? 'bg-brand-primary' : 'bg-border-soft'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/account"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold
                     rounded-xl hover:bg-brand-secondary transition-colors"
                    >
                        {t('orderConfirmation.trackOrder', 'Track Order')} <ArrowRight size={16} />
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border-soft text-text-primary font-medium
                     rounded-xl hover:bg-surface-bg transition-colors"
                    >
                        {t('orderConfirmation.continueShopping', 'Continue Shopping')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
