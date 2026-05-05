import { api } from "./api";

const _normalizeShippingAddress = (address) => {
  if (!address) return null;

  return {
    firstName: address.firstName || address.first_name || "",
    lastName: address.lastName || address.last_name || "",
    email: address.email || "",
    phone: address.phone || "",
    address: address.address || address.line1 || "",
    city: address.city || "",
    state: address.state || "",
    zip: address.zip || address.postal_code || "",
    country: address.country || "",
  };
};

const _transformOrder = (o) => {
  if (!o) return null;
  return {
    ...o,
    buyerId: o.buyer_id,
    shippingAddress: _normalizeShippingAddress(o.shipping_address),
    paymentMethod: o.payment_method,
    shippingCost: o.shipping_cost,
    subtotal: o.subtotal,
    tax: o.tax,
    total: o.total,
    cancellationReason: o.cancellation_reason,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    items: (o.items || []).map((i) => ({
      ...i,
      productId: i.product_id,
      sellerId: i.seller_id,
      priceAtPurchase: i.price_at_purchase,
    })),
  };
};

export const orderService = {
  async quoteOrder(orderData) {
    return await api("/orders/quote", {
      method: "POST",
      body: JSON.stringify({
        items: orderData.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          seller_id: item.sellerId,
          price_at_purchase: item.priceAtPurchase,
          variant: item.variant,
        })),
        shipping_address: orderData.shippingAddress,
        shipping_area_id: orderData.shippingAreaId || null,
      }),
    });
  },

  async createOrder(orderData) {
    return await api("/orders", {
      method: "POST",
      body: JSON.stringify({
        items: orderData.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          seller_id: item.sellerId,
          price_at_purchase: item.priceAtPurchase,
          variant: item.variant,
        })),
        shipping_address: orderData.shippingAddress,
        shipping_area_id: orderData.shippingAreaId || null,
        payment_method: orderData.paymentMethod,
      }),
    });
  },

  async getOrderById(id) {
    const order = await api(`/orders/${id}`);
    return _transformOrder(order);
  },

  async getUserOrders(userId) {
    const orders = await api("/orders/my");
    return (orders || []).map(_transformOrder);
  },

  async getSellerOrders(sellerId) {
    const orders = await api("/orders/seller");
    return (orders || []).map(_transformOrder);
  },

  async updateOrderStatus(orderId, newStatus) {
    return await api(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
  },

  async cancelOrder(orderId, reason) {
    return await api(`/orders/${orderId}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
  },
};
