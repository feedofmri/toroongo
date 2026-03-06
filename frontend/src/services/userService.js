import { localDB } from '../db/localDB';

const DELAY = 600;
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
    async getUserProfile(userId) {
        await simulateDelay(DELAY);
        const user = localDB.data.users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');
        const { password: _, ...safeUser } = user;
        return safeUser;
    },

    async updateProfile(userId, updateData) {
        await simulateDelay(DELAY);
        const index = localDB.data.users.findIndex(u => u.id === userId);
        if (index === -1) throw new Error('User not found');

        // Prevent password updates through this method
        const { password, ...safeUpdates } = updateData;

        localDB.data.users[index] = {
            ...localDB.data.users[index],
            ...safeUpdates
        };
        localDB.save();

        const { password: _, ...safeUser } = localDB.data.users[index];

        // If updating the currently logged in user, update localStorage too
        const currentUser = JSON.parse(localStorage.getItem('toroongo_user') || '{}');
        if (currentUser.id === userId) {
            localStorage.setItem('toroongo_user', JSON.stringify(safeUser));
        }

        return safeUser;
    },

    async getAllSellers() {
        await simulateDelay(DELAY);
        return localDB.data.users
            .filter(u => u.role === 'seller')
            .map(seller => {
                const { password: _, ...safeSeller } = seller;
                return safeSeller;
            });
    },

    async getSellerById(sellerId) {
        await simulateDelay(DELAY);
        const seller = localDB.data.users.find(u => u.id === sellerId && u.role === 'seller');
        if (!seller) throw new Error('Seller not found');
        const { password: _, ...safeSeller } = seller;
        return safeSeller;
    },

    async getSellerBySlug(slug) {
        await simulateDelay(DELAY);
        const seller = localDB.data.users.find(u => u.slug === slug && u.role === 'seller');
        if (!seller) throw new Error('Seller not found');
        const { password: _, ...safeSeller } = seller;
        return safeSeller;
    }
};
