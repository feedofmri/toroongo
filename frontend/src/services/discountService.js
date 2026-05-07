import { api } from './api';

export const discountService = {
    async getDiscounts() {
        return await api('/discounts');
    },

    async createDiscount(data) {
        return await api('/discounts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async toggleDiscount(id) {
        return await api(`/discounts/${id}/toggle`, {
            method: 'PUT',
        });
    },

    async deleteDiscount(id) {
        return await api(`/discounts/${id}`, {
            method: 'DELETE',
        });
    },
};
