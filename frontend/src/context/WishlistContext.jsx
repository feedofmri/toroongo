import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = useState([]);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const storedWishlist = localStorage.getItem('toroongo_wishlist');
        if (storedWishlist) {
            try {
                setWishlist(JSON.parse(storedWishlist));
            } catch (e) {
                console.error("Failed to load wishlist", e);
            }
        }
    }, []);

    // Sync with backend if authenticated and user is a buyer
    useEffect(() => {
        if (isAuthenticated && user?.role === 'buyer') {
            api('/wishlist')
                .then(items => {
                    const ids = items.map(item => item.product_id);
                    setWishlist(ids);
                })
                .catch(err => console.error("Failed to fetch wishlist from DB", err));
        } else {
            // Optional: clear or keep local
            // For now let's keep local if not authenticated, but the app forces login to toggle anyway
            if (!isAuthenticated) {
                // Keep local storage wishlist for guests
            } else {
                // Sellers don't have wishlists, clear it
                setWishlist([]);
            }
        }
    }, [isAuthenticated, user]);

    // Sync with localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('toroongo_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Clear wishlist if user logs out (optional, based on requirement)
    // However, the requirement is "if user not loggedin it will show to auth"
    // So we should probably keep it simple: the context provides the IDs.

    const toggleWishlist = async (productId) => {
        if (!isAuthenticated) return false;

        // Optimistic update
        setWishlist(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            }
            return [...prev, productId];
        });

        try {
            await api('/wishlist', {
                method: 'POST',
                body: JSON.stringify({ product_id: productId })
            });
            return true;
        } catch (err) {
            console.error("Failed to toggle wishlist in DB", err);
            // Rollback optimistic update
            setWishlist(prev => {
                if (prev.includes(productId)) {
                    return prev.filter(id => id !== productId);
                }
                return [...prev, productId];
            });
            return false;
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) {
            setWishlist(prev => prev.filter(id => id !== productId));
            return;
        }

        // Optimistic update
        setWishlist(prev => prev.filter(id => id !== productId));

        try {
            await api('/wishlist', {
                method: 'POST',
                body: JSON.stringify({ product_id: productId })
            });
        } catch (err) {
            console.error("Failed to remove from wishlist in DB", err);
            // Rollback
            setWishlist(prev => [...prev, productId]);
        }
    };

    const clearWishlist = () => setWishlist([]);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            toggleWishlist,
            isInWishlist,
            removeFromWishlist,
            clearWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
