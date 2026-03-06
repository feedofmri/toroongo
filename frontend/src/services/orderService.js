import { localDB } from '../db/localDB';
import { Order } from '../models';

const DELAY = 700;
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
    async createOrder(orderData) {
        await simulateDelay(DELAY);

        // Simulate checking stock and updating products
        for (const item of orderData.items) {
            const productIdx = localDB.data.products.findIndex(p => p.id === item.productId);
            if (productIdx !== -1) {
                const product = localDB.data.products[productIdx];
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.title}`);
                }
                // Deduct stock
                localDB.data.products[productIdx].stock -= item.quantity;
            }
        }

        const newOrder = new Order(orderData);
        localDB.data.orders.push(newOrder);
        localDB.save();
        return newOrder;
    },

    async getOrderById(id) {
        await simulateDelay(DELAY);
        const order = localDB.data.orders.find(o => o.id === id);
        if (!order) throw new Error('Order not found');
        return order;
    },

    async getUserOrders(userId) {
        await simulateDelay(DELAY);
        // Sort by newest first
        return localDB.data.orders
            .filter(o => o.buyerId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async getSellerOrders(sellerId) {
        await simulateDelay(DELAY);
        // We only return the specific items that belong to the seller within the global orders
        const sellerOrders = [];

        for (const order of localDB.data.orders) {
            const sellerItems = order.items.filter(item => item.sellerId === sellerId);
            if (sellerItems.length > 0) {
                // Clone the order but only with the seller's items
                const partialOrder = JSON.parse(JSON.stringify(order));
                partialOrder.items = sellerItems;
                // Recalculate subtotal for just this seller's portion
                partialOrder.subtotal = sellerItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
                sellerOrders.push(partialOrder);
            }
        }

        return sellerOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async updateOrderStatus(orderId, newStatus) {
        await simulateDelay(DELAY);
        const index = localDB.data.orders.findIndex(o => o.id === orderId);
        if (index === -1) throw new Error('Order not found');

        localDB.data.orders[index].status = newStatus;
        localDB.data.orders[index].updatedAt = new Date().toISOString();
        localDB.save();

        return localDB.data.orders[index];
    }
};
