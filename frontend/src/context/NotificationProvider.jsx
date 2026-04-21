import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/index.js';
import { NotificationContext } from './NotificationContext';

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const pollingInterval = useRef(null);

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        try {
            const { count } = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, [isAuthenticated, user]);

    const fetchNotifications = useCallback(async (page = 1) => {
        if (!isAuthenticated || !user) return;
        setIsLoading(true);
        try {
            const data = await notificationService.getNotifications(page);
            if (page === 1) {
                setNotifications(data.data);
            } else {
                setNotifications(prev => [...prev, ...data.data]);
            }
            // Update unread count as well
            const { count } = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response) {
                console.error('Notification Error Response:', error.response.data);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user]);

    // Initial load and polling setup
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchNotifications();

            // Setup polling for unread count every 30 seconds
            pollingInterval.current = setInterval(fetchUnreadCount, 30000);
        } else {
            setNotifications([]);
            setUnreadCount(0);
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        }

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [isAuthenticated, user, fetchNotifications, fetchUnreadCount]);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            const wasUnread = !notifications.find(n => n.id === id)?.read;
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const addNotification = (notification) => {
        // This is still useful for immediate UI updates if we implement WebSockets later
        setNotifications(prev => [notification, ...prev]);
        if (!notification.read) setUnreadCount(prev => prev + 1);
    };

    const hasUnread = unreadCount > 0;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            hasUnread,
            isLoading,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            addNotification,
            refreshNotifications: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

