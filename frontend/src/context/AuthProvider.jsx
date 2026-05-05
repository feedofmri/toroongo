import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services';
import { TOKEN_STORAGE_KEY } from '../services/api';
import { setBuyerCurrencyCode } from '../utils/currency';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage on initial load
        const storedUser = authService.getCurrentUser();
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedUser && token) {
            setUser(storedUser);
            setIsAuthenticated(true);
            if (storedUser.currency_code) {
                setBuyerCurrencyCode(storedUser.currency_code, true);
            }
        }
        setIsLoading(false);
    }, []);

    const updateUser = (newUserData) => {
        setUser(newUserData);
    };

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const loggedInUser = await authService.login(email, password);
            setUser(loggedInUser);
            setIsAuthenticated(true);
            return loggedInUser;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        try {
            const registeredUser = await authService.register(userData);
            setUser(registeredUser);
            setIsAuthenticated(true);
            return registeredUser;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const sendOtp = async (email, type) => {
        setIsLoading(true);
        try {
            return await authService.sendOtp(email, type);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async (email, otp, type) => {
        setIsLoading(true);
        try {
            return await authService.verifyOtp(email, otp, type);
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            const url = await authService.getGoogleUrl();
            window.location.href = url; // Redirect to Google
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleCallback = async (queryParams) => {
        setIsLoading(true);
        try {
            const user = await authService.handleGoogleCallback(queryParams);
            setUser(user);
            setIsAuthenticated(true);
            return user;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, isAuthenticated, isLoading, 
            login, register, logout, updateUser, 
            sendOtp, verifyOtp, 
            loginWithGoogle, handleGoogleCallback 
        }}>
            {children}
        </AuthContext.Provider>
    );
}
