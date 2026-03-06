import { localDB } from '../db/localDB';
import { Product } from '../models';

const DELAY = 500;
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
    async getAllProducts() {
        await simulateDelay(DELAY);
        return [...localDB.data.products]; // Return a copy
    },

    async getProductById(id) {
        await simulateDelay(DELAY);
        const product = localDB.data.products.find(p => p.id === id);
        if (!product) throw new Error('Product not found');
        return product;
    },

    async getProductsBySeller(sellerId) {
        await simulateDelay(DELAY);
        return localDB.data.products.filter(p => p.sellerId === sellerId);
    },

    async getProductsByCategory(categorySlug) {
        await simulateDelay(DELAY);
        return localDB.data.products.filter(p => p.category === categorySlug);
    },

    async searchProducts(query) {
        await simulateDelay(DELAY);
        const search = query.toLowerCase();
        return localDB.data.products.filter(p =>
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        );
    },

    async createProduct(productData) {
        await simulateDelay(DELAY);
        const newProduct = new Product(productData);
        localDB.data.products.push(newProduct);
        localDB.save();
        return newProduct;
    },

    async updateProduct(id, updateData) {
        await simulateDelay(DELAY);
        const index = localDB.data.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');

        localDB.data.products[index] = {
            ...localDB.data.products[index],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        localDB.save();
        return localDB.data.products[index];
    },

    async deleteProduct(id) {
        await simulateDelay(DELAY);
        const index = localDB.data.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');

        localDB.data.products.splice(index, 1);
        localDB.save();
        return true;
    }
};
