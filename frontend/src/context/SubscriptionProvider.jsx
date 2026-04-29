import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { subscriptionService } from '../services';
import { SubscriptionContext } from './SubscriptionContext';
import { canAccessFeature, getProductLimit, PLANS, getNextPlan, getPlanIndex } from '../data/planConfig';

export function SubscriptionProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [currentPlan, setCurrentPlan] = useState('starter');
    const [subscription, setSubscription] = useState(null);
    const [productCount, setProductCount] = useState(0);
    const [productLimit, setProductLimit] = useState(10);
    const [pendingDowngrade, setPendingDowngrade] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const isSeller = user?.role === 'seller';

    const fetchSubscription = useCallback(async () => {
        if (!isAuthenticated || !isSeller) return;
        setIsLoading(true);
        try {
            const data = await subscriptionService.getCurrentSubscription();
            setCurrentPlan(data.plan || 'starter');
            setSubscription(data.subscription);
            setProductCount(data.product_count || 0);
            setProductLimit(data.product_limit);
        } catch (error) {
            console.error('Error fetching subscription:', error);
            // Fallback to user's plan from auth context
            setCurrentPlan(user?.plan || 'starter');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, isSeller, user]);

    useEffect(() => {
        if (isAuthenticated && isSeller) {
            fetchSubscription();
        } else {
            setCurrentPlan('starter');
            setSubscription(null);
        }
    }, [isAuthenticated, isSeller, fetchSubscription]);

    const canAccess = useCallback((featureKey) => {
        return canAccessFeature(currentPlan, featureKey);
    }, [currentPlan]);

    const getPlanLimits = useCallback(() => {
        return {
            productLimit: getProductLimit(currentPlan),
            productCount,
            canAddProduct: getProductLimit(currentPlan) === null || productCount < getProductLimit(currentPlan),
        };
    }, [currentPlan, productCount]);

    const refreshSubscription = useCallback(async () => {
        await fetchSubscription();
    }, [fetchSubscription]);

    const planDetails = PLANS[currentPlan] || PLANS.starter;
    const nextPlan = getNextPlan(currentPlan);

    return (
        <SubscriptionContext.Provider value={{
            currentPlan,
            subscription,
            planDetails,
            nextPlan,
            productCount,
            productLimit,
            pendingDowngrade,
            isLoading,
            isSeller,
            canAccess,
            getPlanLimits,
            refreshSubscription,
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}
