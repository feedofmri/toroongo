import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import { formatPrice, formatPriceInCurrency, convertCurrency } from "../../utils/currency";
import { useProduct } from "../../context/ProductContext";

const STATUS_CONFIG = {
  processing: {
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
    label: "Processing",
  },
  shipped: { icon: Truck, color: "text-blue-600 bg-blue-50", label: "Shipped" },
  delivered: {
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
    label: "Delivered",
  },
  return_requested: { icon: RotateCcw, color: "text-purple-600 bg-purple-50", label: "Return Requested" },
  returned: { icon: RotateCcw, color: "text-purple-600 bg-purple-50", label: "Returned" },
  refunded: { icon: CreditCard, color: "text-indigo-600 bg-indigo-50", label: "Refunded" },
  cancelled: { icon: X, color: "text-red-600 bg-red-50", label: "Cancelled" },
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
      orderService
        .getOrderById(orderId)
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [orderId]);

  if (!orderId) return null;

  const getProductInfo = (productId) => {
    const p = allProducts.find((pr) => String(pr.id) === String(productId));
    return p || { title: t('common.unknownProduct', 'Unknown Product'), imageUrl: "" };
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
      console.error("Failed to update status:", err);
      alert(t('orderDetail.updateError', 'Failed to update status. Please try again.'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusCfg = order
    ? STATUS_CONFIG[order.status] || STATUS_CONFIG.processing
    : STATUS_CONFIG.processing;
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
            <Loader2
              size={40}
              className="text-brand-primary animate-spin mb-4"
            />
            <p className="text-text-muted font-medium">
              {t('orderDetail.loading')}
            </p>
          </div>
        ) : order ? (
          <>
            {/* Header */}
            <div className="p-6 sm:p-8 bg-surface-bg/50 border-b border-border-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    {t('orderDetail.title')}
                  </h2>
                  <p className="text-sm text-text-muted mt-1">
                    TRG-{String(order.id).toUpperCase()} •{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${statusCfg.color}`}
                >
                  <StatusIcon size={16} />
                  {t(`orders.${order.status}`)}
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
                      <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                        {t('orderDetail.shippingTo')}
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {order.shippingAddress?.firstName}{" "}
                        {order.shippingAddress?.lastName}
                      </p>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {order.shippingAddress?.address},{" "}
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.zip}
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
                      <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                        {t('orderDetail.paymentMethod')}
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {order.paymentMethod || t('common.notSpecified')}
                      </p>
                      <p className="text-sm text-text-muted mt-0.5">
                        {t('orderDetail.paidSecurely')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Package size={18} className="text-brand-primary" />
                  {t('orderDetail.orderItems', { count: order.items.length })}
                </h3>
                <div className="space-y-4 bg-surface-bg/30 p-4 rounded-2xl border border-border-soft">
                  {order.items.map((item, idx) => {
                    const pInfo = getProductInfo(item.productId);
                    return (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-border-soft flex-shrink-0">
                          <img
                            src={
                              pInfo.imageUrl || "https://via.placeholder.com/64"
                            }
                            alt={pInfo.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-text-primary line-clamp-1">
                            {pInfo.title}
                          </p>
                          <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wide">
                            {t('orderDetail.qty')}: {item.quantity} ·{" "}
                            {formatPrice(item.priceAtPurchase, order.buyer_currency_code)}{" "}
                            {t('orderDetail.each')}
                          </p>
                          {item.variant?.length > 0 && (
                            <p className="text-xs text-text-muted mt-1">
                              {item.variant
                                .map(
                                  (variant) =>
                                    `${variant.name}: ${variant.value}`,
                                )
                                .join(" · ")}
                            </p>
                          )}
                          <p className="text-sm font-bold text-brand-primary mt-1">
                            {formatPrice(item.priceAtPurchase * item.quantity, order.buyer_currency_code)}
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
                  <span className="text-text-muted">{t('orderDetail.subtotal')}</span>
                  <span className="font-semibold text-text-primary">
                    {formatPrice(order.subtotal, order.buyer_currency_code)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">{t('orderDetail.shippingFee')}</span>
                  <span className="font-semibold text-text-primary">
                    {formatPrice(order.shippingCost, order.buyer_currency_code)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">{t('orderDetail.tax')}</span>
                  <span className="font-semibold text-text-primary">
                    {formatPrice(order.tax, order.buyer_currency_code)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border-soft">
                  <span className="text-base font-bold text-text-primary">
                    {t('orderDetail.total')}
                  </span>
                  <span className="text-xl font-black text-brand-primary">
                    {formatPrice(order.total, order.buyer_currency_code)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-0 sm:p-8 sm:pt-0 bg-white space-y-4">
              {/* Seller Status Controls */}
              {user?.role === "seller" &&
                order.status !== "refunded" &&
                order.status !== "cancelled" && (

                  <div className="p-5 bg-surface-bg border border-border-soft rounded-2xl">
                    <h4 className="text-sm font-bold text-text-primary mb-3">
                      {t('orderDetail.sellerManagement')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {order.status === "processing" && (
                        <>
                          <button
                            onClick={() => handleStatusChange("shipped")}
                            disabled={updatingStatus}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition-all disabled:opacity-50"
                          >
                            {updatingStatus ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Truck size={14} />
                            )}
                            {t('orderDetail.markShipped')}
                          </button>
                          <button
                            onClick={() => handleStatusChange("cancelled")}
                            disabled={updatingStatus}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold border border-red-100 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
                          >
                            {t('orderDetail.cancelOrder')}
                          </button>
                        </>
                      )}
                      {order.status === "shipped" && (
                        <button
                          onClick={() => handleStatusChange("delivered")}
                          disabled={updatingStatus}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                          {updatingStatus ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          {t('orderDetail.markDelivered')}
                        </button>
                      )}
                      {(order.status === "delivered" || order.status === "shipped" || order.status === "return_requested") && (
                          <button
                            onClick={() => handleStatusChange("returned")}
                            disabled={updatingStatus}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-xs font-bold border border-purple-100 rounded-xl hover:bg-purple-100 transition-all disabled:opacity-50"
                          >
                            {t('orderDetail.markReturned', 'Mark as Returned')}
                          </button>
                      )}
                      {(order.status === "returned" || order.status === "return_requested") && (
                        <button
                          onClick={() => handleStatusChange("refunded")}
                          disabled={updatingStatus}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                          {t('orderDetail.issueRefund')}
                        </button>
                      )}

                    </div>
                  </div>
                )}
              
              {/* Buyer Return Request */}
              {user?.role === "buyer" && order.status === "delivered" && (
                <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl mb-4">
                  <h4 className="text-sm font-bold text-purple-900 mb-2">
                    {t('orderDetail.returnPrompt')}
                  </h4>
                  <p className="text-xs text-purple-700 mb-3">
                    {t('orderDetail.returnPromptDesc')}
                  </p>
                  <button
                    onClick={() => {
                      // We can either open a separate modal or just navigate/redirect.
                      // For now, let's suggest using the order history button which is already implemented.
                      alert(t('orderDetail.returnPromptAlert', "Please use the 'Request Return' button on your Order History page to provide a reason for return."));
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-all"
                  >
                    <RotateCcw size={14} />
                    {t('orderDetail.howToReturn')}
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-brand-primary/5 text-brand-primary font-bold rounded-2xl hover:bg-brand-primary/10 transition-all"
              >
                {t('orderDetail.close')}
              </button>
            </div>
          </>
        ) : (
          <div className="p-20 text-center">
            <p className="text-text-muted">{t('orderDetail.notFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
