import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { NotificationContext } from './NotificationContext';

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);

    // Initial load based on user role
    useEffect(() => {
        if (!isAuthenticated || !user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNotifications([]);
            return;
        }

        const role = user.role || 'buyer';
        // Fallback to buyer notifications if role isn't explicitly matched in MOCK_NOTIFICATIONS (though it should be)
        const roleNotifications = MOCK_NOTIFICATIONS[role] || MOCK_NOTIFICATIONS['buyer'];

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotifications(roleNotifications);
    }, [user, isAuthenticated]);

    const unreadCount = notifications.filter(n => !n.read).length;

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
