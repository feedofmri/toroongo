import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = useState([]);

    // Load wishlist from localStorage on mount (regardless of auth for now, but will filter later)
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

    // Sync with localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('toroongo_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Clear wishlist if user logs out (optional, based on requirement)
    // However, the requirement is "if user not loggedin it will show to auth"
    // So we should probably keep it simple: the context provides the IDs.

    const toggleWishlist = (productId) => {
        if (!isAuthenticated) return false; // Signal that auth is needed

        setWishlist(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            }
            return [...prev, productId];
        });
        return true;
    };

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(id => id !== productId));
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
