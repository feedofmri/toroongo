import { categories, sellers, products, heroBanners, navCategories, mockAdmins, mockBuyers, extraSellers } from '../data/mockData';
import { User, Product, Blog, Message } from '../models';
import { seedStorefrontConfigs } from '../pages/seller/storefrontBuilder/services/seedStorefrontConfigs';

const DB_KEY = 'toroongo_db_v4';

// Initial data shape
const initialData = {
    users: [],
    products: [],
    orders: [],
    categories: [],
    blogs: [],
    messages: [],
    system: {
        heroBanners: [],
        navCategories: []
    }
};

class LocalDatabase {
    constructor() {
        this.data = this.loadData();
        // Ensure storefront configs exist even if DB was already loaded
        seedStorefrontConfigs();
    }

    // Load data from localStorage or initialize if empty
    loadData() {
        try {
            const raw = localStorage.getItem(DB_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
            return this.seedDatabase();
        } catch (error) {
            console.error('Error loading LocalDB, re-seeding...', error);
            return this.seedDatabase();
        }
    }

    // Save current state to localStorage
    save() {
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(this.data));
        } catch (error) {
            console.error('Failed to save to LocalDB:', error);
        }
    }

    // Initial Database Seeding from mockData
    seedDatabase() {
        console.log('Seeding Local Database from mockData.js...');
        const db = { ...initialData };

        // 1. Seed Categories & System Data
        db.categories = categories;
        db.system.heroBanners = heroBanners;
        db.system.navCategories = navCategories;

        // 2. Add a default Admin User
        const adminUser = new User({
            id: 'admin_1',
            name: 'System Admin',
            email: 'admin@toroongo.com',
            password: 'password123',
            role: 'admin'
        });
        db.users.push(adminUser);

        // 3. Add a generic Buyer User
        const demoBuyer = new User({
            id: 'buyer_1',
            name: 'Demo Buyer',
            email: 'buyer@example.com',
            password: 'password123',
            role: 'buyer'
        });
        db.users.push(demoBuyer);

        // 4. Transform Sellers (from mockData) to User models with 'seller' role
        const allSellers = [...sellers, ...extraSellers];
        allSellers.forEach(seller => {
            const sellerUser = new User({
                id: `seller_${seller.id}`,
                name: seller.name,
                email: `contact@${seller.slug}.com`,
                password: 'password123',
                role: 'seller',
                storeName: seller.name,
                description: seller.description,
                logo: seller.logo,
                banner: seller.banner,
                rating: seller.rating,
                totalProducts: seller.totalProducts,
                brandColor: seller.brandColor,
                slug: seller.slug,
                joinedDate: seller.joinedDate
            });
            db.users.push(sellerUser);
        });

        // 4a. Add extra Admins and Buyers
        mockAdmins.forEach(admin => db.users.push(new User(admin)));
        mockBuyers.forEach(buyer => db.users.push(new User(buyer)));

        // 5. Transform Products (from mockData) to Product models
        products.forEach(p => {
            const product = new Product({
                id: `prod_${p.id}`,
                title: p.title,
                price: p.price,
                originalPrice: p.originalPrice,
                sellerId: String(p.sellerId).startsWith('seller_') ? p.sellerId : `seller_${p.sellerId}`, // Link to transformed seller IDs
                seller: p.seller,
                category: p.category,
                badge: p.badge,
                imageUrl: p.imageUrl
            });
            // Overwrite mock data specific properties
            product.rating = p.rating || 0;
            product.reviews = p.reviews || 0;
            db.products.push(product);
        });

        // 6. Add some mock blogs
        const rawBlogs = [
            { category: 'Seller Tips', title: '10 Ways to Boost Your Storefront Sales in 2026', summary: 'Learn proven strategies to increase traffic to your Toroongo store, improve conversion rates, and grow your revenue.', author: 'Sarah Mitchell', readTime: '6 min read', color: 'bg-purple-500', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000', content: '<p>Content goes here...</p>' },
            { category: 'Platform Updates', title: 'Introducing Custom Storefronts: Your Brand, Your Way', summary: 'Sellers can now fully customize their store appearance with brand colors, banners, logos, and dedicated pages.', author: 'Toroongo Team', readTime: '4 min read', color: 'bg-brand-primary', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000', content: '<p>Content goes here...</p>' },
            { category: 'Buyer Guides', title: 'How to Shop Smart on Toroongo: A Complete Guide', summary: 'From finding deals to tracking orders, here is everything you need to know to get the most out of Toroongo.', author: 'James Kim', readTime: '5 min read', color: 'bg-green-500', imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1000', content: '<p>Content goes here...</p>' },
            { category: 'Industry News', title: 'The Future of Multi-Vendor E-Commerce', summary: 'Marketplaces are evolving. Discover how hybrid platforms like Toroongo are changing the way people buy and sell online.', author: 'Emily Rodriguez', readTime: '7 min read', color: 'bg-amber-500', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000', content: '<p>Content goes here...</p>' },
            { category: 'Seller Tips', title: 'Product Photography Tips That Actually Work', summary: 'Great photos sell products. Learn how to take professional-quality product images with just your smartphone.', author: 'Anna Lee', readTime: '5 min read', color: 'bg-purple-500', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000', content: '<p>Content goes here...</p>' },
            { category: 'Platform Updates', title: 'New Analytics Dashboard for Sellers', summary: 'Track your sales, revenue trends, and customer insights with our brand new seller analytics experience.', author: 'Toroongo Team', readTime: '3 min read', color: 'bg-brand-primary', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000', content: '<p>Content goes here...</p>' }
        ];

        db.blogs = rawBlogs.map((b, i) => {
            const blog = new Blog(b);
            // hardcode different dates for variation
            const d = new Date();
            d.setDate(d.getDate() - i * 5);
            blog.createdAt = d.toISOString();
            return blog;
        });

        // 7. Seed initial messages between demo buyer and seller
        const now = Date.now();
        db.messages = [
            new Message({
                id: 'msg_1',
                senderId: 'buyer_1',
                receiverId: 'seller_1', // Eco Living
                text: 'Hi, I am interested in the Bamboo Toothbrush set. Do you offer bulk discounts?',
                read: true,
                createdAt: new Date(now - 86400000 * 2).toISOString() // 2 days ago
            }),
            new Message({
                id: 'msg_2',
                senderId: 'seller_1',
                receiverId: 'buyer_1',
                text: 'Hello! Yes, we offer a 15% discount for orders of 10 or more sets. Would you like me to set up a custom listing?',
                read: true,
                createdAt: new Date(now - 86400000 * 1.5).toISOString()
            }),
            new Message({
                id: 'msg_3',
                senderId: 'buyer_1',
                receiverId: 'seller_1',
                text: 'That would be great, thank you!',
                read: false,
                createdAt: new Date(now - 3600000 * 2).toISOString() // 2 hours ago
            })
        ];

        this.data = db;
        this.save();

        // Seed storefront builder configs for all sellers
        seedStorefrontConfigs();

        return db;
    }

    // --- Table Operations ---

    // Generic clear DB
    reset() {
        localStorage.removeItem(DB_KEY);
        localStorage.removeItem('toroongo_storefront_configs');
        this.data = this.seedDatabase();
        window.location.reload(); // Force reload to re-mount context
    }
}

// Export a singleton instance
export const localDB = new LocalDatabase();
