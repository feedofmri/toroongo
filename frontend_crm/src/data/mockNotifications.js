// mockNotifications.js

export const MOCK_NOTIFICATIONS = {
    buyer: [
        {
            id: 'n-b-1',
            type: 'order',
            title: 'Order Shipped!',
            message: 'Your order #ORD-2025-8832 has been shipped and is on its way.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
            read: false,
            link: '/account/orders'
        },
        {
            id: 'n-b-2',
            type: 'promotion',
            title: 'Flash Sale Alert',
            message: 'Get up to 50% off on electronics this weekend only!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            read: true,
            link: '/products'
        },
        {
            id: 'n-b-3',
            type: 'system',
            title: 'Price Drop on Wishlist Item',
            message: 'The Sony WH-1000XM5 headphones on your wishlist have dropped in price.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
            read: true,
            link: '/wishlist'
        }
    ],
    seller: [
        {
            id: 'n-s-1',
            type: 'order',
            title: 'New Order Received',
            message: 'You have a new order (#ORD-2025-8832) waiting for fulfillment.',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
            read: false,
            link: '/seller/orders'
        },
        {
            id: 'n-s-2',
            type: 'inventory',
            title: 'Low Stock Warning',
            message: 'Product "Minimalist Desk Lamp" is running low on stock (only 3 left).',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            read: true,
            link: '/seller/products'
        },
        {
            id: 'n-s-3',
            type: 'system',
            title: 'Weekly Performance Report',
            message: 'Your weekly performance report is ready to view.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
            read: true,
            link: '/seller/finance'
        }
    ],
    admin: [
        {
            id: 'n-a-1',
            type: 'system',
            title: 'New Seller Registration',
            message: 'TechNova has applied to become a seller. Review their application.',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
            read: false,
            link: '/admin/sellers'
        },
        {
            id: 'n-a-2',
            type: 'security',
            title: 'System Alert',
            message: 'Unusual login activity detected from IP 192.168.1.100.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
            read: false,
            link: '/admin'
        },
        {
            id: 'n-a-3',
            type: 'system',
            title: 'Platform Maintenance',
            message: 'Scheduled maintenance will begin in 24 hours.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            read: true,
            link: '/admin'
        }
    ]
};
