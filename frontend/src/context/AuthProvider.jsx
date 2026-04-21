import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services';
import { TOKEN_STORAGE_KEY } from '../services/api';

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

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

