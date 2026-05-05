import { api } from './api';

export const paymentMethodService = {
    async getMyMethods() {
        return await api('/payment-methods');
    },

    async getBySellers(sellerIds) {
        return await api('/payment-methods/by-sellers', {
            method: 'POST',
            body: JSON.stringify({ seller_ids: sellerIds }),
        });
    },

    async createMethod(data) {
        return await api('/payment-methods', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async updateMethod(id, data) {
        return await api(`/payment-methods/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async deleteMethod(id) {
        return await api(`/payment-methods/${id}`, { method: 'DELETE' });
    },
};
