import { api } from './api';

export const productService = {
    async getAllProducts() {
        return await api('/products');
    },

    async getProductById(id) {
        return await api(`/products/${id}`);
    },

    async getProductsBySeller(sellerId) {
        return await api(`/products/seller/${sellerId}`);
    },

    async getProductsByCategory(categorySlug) {
        return await api(`/products/category/${categorySlug}`);
    },

    async searchProducts(query) {
        return await api(`/products?search=${encodeURIComponent(query)}`);
    },

    async createProduct(productData) {
        return await api('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    async updateProduct(id, updateData) {
        return await api(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    async deleteProduct(id) {
        return await api(`/products/${id}`, { method: 'DELETE' });
        return true;
    }
};
