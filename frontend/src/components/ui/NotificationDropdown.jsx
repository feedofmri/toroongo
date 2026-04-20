import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCircle2, AlertCircle, ShoppingBag, Tag, MessageSquare, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const getIconForType = (type) => {
    switch (type) {
        case 'order': return <ShoppingBag size={18} className="text-blue-500" />;
        case 'promotion': return <Tag size={18} className="text-brand-primary" />;
        case 'system': return <Bell size={18} className="text-gray-500" />;
        case 'inventory': return <AlertCircle size={18} className="text-amber-500" />;
        case 'security': return <AlertCircle size={18} className="text-red-500" />;
        case 'message': return <MessageSquare size={18} className="text-purple-500" />;
        default: return <Bell size={18} className="text-text-muted" />;
    }
};

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const elapsed = Date.now() - new Date(timestamp).getTime();

    // Calculate in respective units
    const seconds = Math.floor(elapsed / 1000);
    if (seconds < 60) return rtf.format(-seconds, 'second');

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return rtf.format(-minutes, 'minute');

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return rtf.format(-hours, 'hour');

    const days = Math.floor(hours / 24);
    if (days < 30) return rtf.format(-days, 'day');

    const months = Math.floor(days / 30);
    return rtf.format(-months, 'month');
};

export default function NotificationDropdown({ onClose }) {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading, refreshNotifications } = useNotifications();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        refreshNotifications(1);
    }, [refreshNotifications]);

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
            if (onClose) onClose();
        }
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        deleteNotification(id);
    };

    return (
        <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-border-soft overflow-hidden z-50 transform origin-top-right transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-soft bg-surface-bg/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} New
                        </span>
                    )}
                    {isLoading && <Loader2 size={12} className="animate-spin text-brand-primary" />}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            markAllAsRead();
                        }}
                        className="text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-1"
                    >
                        <Check size={14} /> Mark all read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="max-h-[70vh] overflow-y-auto overscroll-contain scrollbar-hide">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-surface-bg rounded-full flex items-center justify-center mb-3">
                            <CheckCircle2 size={24} className="text-text-muted/50" />
                        </div>
                        <p className="text-sm font-medium text-text-primary">You're all caught up!</p>
                        <p className="text-xs text-text-muted mt-1">No new notifications at the moment.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border-soft">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`group p-4 hover:bg-surface-bg transition-colors cursor-pointer relative ${!notification.read ? 'bg-brand-primary/[0.02]' : ''}`}
                            >
                                {/* Unread Indicator */}
                                {!notification.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary" />
                                )}

                                <div className="flex gap-3">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!notification.read ? 'bg-white shadow-sm' : 'bg-surface-bg'}`}>
                                        {getIconForType(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className={`text-sm ${!notification.read ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                                                {notification.title}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-text-muted whitespace-nowrap flex-shrink-0 mt-0.5">
                                                    {formatTimeAgo(notification.created_at || notification.timestamp)}
                                                </span>
                                                <button 
                                                    onClick={(e) => handleDelete(e, notification.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded transition-all"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t border-border-soft bg-surface-bg/30">
                    <button
                        onClick={() => {
                            if (onClose) onClose();

                            // Route based on user role
                            if (user?.role === 'seller') {
                                navigate('/seller/settings?tab=notifications');
                            } else if (user?.role === 'admin') {
                                navigate('/admin'); 
                            } else {
                                navigate('/account/settings?tab=notifications');
                            }
                        }}
                        className="w-full py-2 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors text-center"
                    >
                        Notification Settings
                    </button>
                </div>
            )}
        </div>
    );
}

