import { localDB } from '../db/localDB';
import { User } from '../models';

const DELAY = 800; // Simulate network latency

const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
    async login(email, password) {
        await simulateDelay(DELAY);
        const { users } = localDB.data;
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const { password: _, ...userWithoutPassword } = user;

        // Setup session token
        const token = `token_${user.id}_${Date.now()}`;
        localStorage.setItem('toroongo_token', token);
        localStorage.setItem('toroongo_user', JSON.stringify(userWithoutPassword));

        return { user: userWithoutPassword, token };
    },

    async register(userData) {
        await simulateDelay(DELAY);
        const { users } = localDB.data;

        if (users.some(u => u.email === userData.email)) {
            throw new Error('Email already exists');
        }

        const newUser = new User(userData);
        localDB.data.users.push(newUser);
        localDB.save();

        const { password: _, ...userWithoutPassword } = newUser;
        const token = `token_${newUser.id}_${Date.now()}`;

        localStorage.setItem('toroongo_token', token);
        localStorage.setItem('toroongo_user', JSON.stringify(userWithoutPassword));

        return { user: userWithoutPassword, token };
    },

    async logout() {
        await simulateDelay(300);
        localStorage.removeItem('toroongo_token');
        localStorage.removeItem('toroongo_user');
        return true;
    },

    getCurrentUser() {
        // Synchronous retrieval from storage
        const userStr = localStorage.getItem('toroongo_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
};
