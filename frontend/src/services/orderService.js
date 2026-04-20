import { api } from './api';

const _transformOrder = (o) => {
    if (!o) return null;
    return {
        ...o,
        buyerId: o.buyer_id,
        shippingAddress: o.shipping_address,
        paymentMethod: o.payment_method,
        shippingCost: o.shipping_cost,
        subtotal: o.subtotal,
        tax: o.tax,
        total: o.total,
        cancellationReason: o.cancellation_reason,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        items: (o.items || []).map(i => ({
            ...i,
            productId: i.product_id,
            sellerId: i.seller_id,
            priceAtPurchase: i.price_at_purchase,
        })),
    };
};

export const orderService = {
    async createOrder(orderData) {
        return await api('/orders', {
            method: 'POST',
            body: JSON.stringify({
                items: orderData.items.map(item => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    seller_id: item.sellerId,
                    price_at_purchase: item.priceAtPurchase,
                })),
                shipping_address: orderData.shippingAddress,
                payment_method: orderData.paymentMethod,
            }),
        });
    },

    async getOrderById(id) {
        const order = await api(`/orders/${id}`);
        return _transformOrder(order);
    },

    async getUserOrders(userId) {
        const orders = await api('/orders/my');
        return (orders || []).map(_transformOrder);
    },

    async getSellerOrders(sellerId) {
        const orders = await api('/orders/seller');
        return (orders || []).map(_transformOrder);
    },

    async updateOrderStatus(orderId, newStatus) {
        return await api(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus }),
        });
    },

    async cancelOrder(orderId, reason) {
        return await api(`/orders/${orderId}/cancel`, {
            method: 'PUT',
            body: JSON.stringify({ reason }),
        });
    }
};
