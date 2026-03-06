import { localDB } from '../db/localDB';

const DELAY = 500;
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
    async getPlatformStats() {
        await simulateDelay(DELAY);
        const { users, products, orders } = localDB.data;

        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const sellerCount = users.filter(u => u.role === 'seller').length;
        const buyerCount = users.filter(u => u.role === 'buyer').length;

        // Calculate sales over last 7 days (mocked based on data)
        const salesData = this._generateMockSalesData(orders);

        return {
            totalUsers: users.length,
            buyerCount,
            sellerCount,
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue,
            salesData
        };
    },

    async getAllUsers() {
        await simulateDelay(DELAY);
        return localDB.data.users.map(u => {
            const { password, ...safeUser } = u;
            return safeUser;
        });
    },

    async updateUserRole(userId, newRole) {
        await simulateDelay(DELAY);
        const index = localDB.data.users.findIndex(u => u.id === userId);
        if (index === -1) throw new Error('User not found');

        localDB.data.users[index].role = newRole;
        localDB.save();
        return localDB.data.users[index];
    },

    // Helper to generate a nice chart data array based on orders
    _generateMockSalesData(orders) {
        const data = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            // In a real app we'd group orders by day. 
            // For mock/seed data, we'll just fake trend data with some randomness
            data.push({
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                sales: Math.floor(Math.random() * 5000) + 1000
            });
        }
        return data;
    }
};
