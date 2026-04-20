import { api } from './api';

export const addressService = {
    async getAddresses() {
        return await api('/addresses');
    },

    async createAddress(addressData) {
        return await api('/addresses', {
            method: 'POST',
            body: JSON.stringify(addressData),
        });
    },

    async updateAddress(id, addressData) {
        return await api(`/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(addressData),
        });
    },

    async deleteAddress(id) {
        return await api(`/addresses/${id}`, {
            method: 'DELETE',
        });
    }
};
