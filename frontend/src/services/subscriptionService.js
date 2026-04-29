import { api } from './api';

export const subscriptionService = {
    async getCurrentSubscription() {
        return await api('/subscription/current');
    },

    async getPlans() {
        return await api('/subscription/plans');
    },

    async upgradePlan({ plan, cardNumber, expiry, cvv }) {
        return await api('/subscription/upgrade', {
            method: 'POST',
            body: JSON.stringify({
                plan,
                card_number: cardNumber,
                expiry,
                cvv,
            }),
        });
    },

    async downgradePlan(plan) {
        return await api('/subscription/downgrade', {
            method: 'POST',
            body: JSON.stringify({ plan }),
        });
    },

    async getSubscriptionHistory() {
        return await api('/subscription/history');
    },
};
