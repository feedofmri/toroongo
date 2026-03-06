import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initial load based on user role
    useEffect(() => {
        if (!isAuthenticated || !user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        const role = user.role || 'buyer';
        // Fallback to buyer notifications if role isn't explicitly matched in MOCK_NOTIFICATIONS (though it should be)
        const roleNotifications = MOCK_NOTIFICATIONS[role] || MOCK_NOTIFICATIONS['buyer'];

        setNotifications(roleNotifications);
    }, [user, isAuthenticated]);

    // Update unread count whenever notifications change
    useEffect(() => {
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
    }, [notifications]);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addNotification = (notification) => {
        const newNotification = {
            id: `n-${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    // Derived state for the dropdown/UI
    const hasUnread = unreadCount > 0;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            hasUnread,
            markAsRead,
            markAllAsRead,
            addNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
