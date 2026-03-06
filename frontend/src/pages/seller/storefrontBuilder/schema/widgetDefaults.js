/**
 * Default props for each widget type.
 * Used when dragging a new widget onto the canvas.
 */

export const widgetDefaults = {
    HeroBanner: {
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop',
        heading: 'Welcome to Our Store',
        subheading: 'Discover amazing products at great prices',
        ctaText: 'Shop Now',
        ctaLink: '/products',
        textAlignment: 'center',
        overlayOpacity: 0.4,
    },

    AnnouncementBar: {
        text: '🎉 Free shipping on orders over $50!',
        backgroundColor: '',
        textColor: '#FFFFFF',
        dismissible: true,
    },

    ProductGrid: {
        title: 'Featured Products',
        columns: 4,
        dataSource: 'featured',
        layoutStyle: 'grid',
        maxItems: 8,
    },

    FeatureCards: {
        title: 'Shop by Collection',
        cards: [
            { imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', label: 'New Arrivals', link: '/products?tag=new' },
            { imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop', label: 'Best Sellers', link: '/products?tag=bestseller' },
            { imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop', label: 'Sale', link: '/products?tag=sale' },
        ],
    },

    TestimonialSlider: {
        title: 'What Our Customers Say',
        testimonials: [
            { rating: 5, text: 'Amazing quality and fast shipping! Will definitely order again.', author: 'Sarah M.' },
            { rating: 5, text: 'Best store on Toroongo. Love the product selection.', author: 'James K.' },
            { rating: 4, text: 'Great customer service and beautiful packaging.', author: 'Emily R.' },
        ],
    },

    NewsletterSignup: {
        heading: 'Stay in the Loop',
        subheading: 'Subscribe for exclusive deals and new arrivals',
        placeholderText: 'Enter your email address',
        buttonText: 'Subscribe',
        buttonColor: '',
    },

    CountdownTimer: {
        heading: 'Flash Sale Ends In',
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        backgroundColor: '',
        textColor: '#FFFFFF',
    },

    VideoPlayer: {
        title: 'Our Story',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        aspectRatio: '16:9',
    },

    TrustBadges: {
        badges: [
            { icon: 'Shield', label: 'Secure Checkout' },
            { icon: 'RotateCcw', label: '30-Day Returns' },
            { icon: 'Truck', label: 'Free Shipping' },
            { icon: 'Leaf', label: 'Eco-Friendly' },
        ],
    },

    FAQAccordion: {
        title: 'Frequently Asked Questions',
        items: [
            { question: 'What is your shipping policy?', answer: 'We offer free shipping on all orders over $50. Standard delivery takes 3-5 business days.' },
            { question: 'How do I return an item?', answer: 'You can initiate a return within 30 days of purchase through your account dashboard.' },
            { question: 'Do you offer international shipping?', answer: 'Yes, we ship to over 50 countries worldwide. International delivery times vary by location.' },
        ],
    },

    ContactForm: {
        title: 'Get in Touch',
        subtitle: 'Have a question? We\'d love to hear from you.',
        fields: ['name', 'email', 'message'],
        buttonText: 'Send Message',
    },

    StoreStats: {
        stats: [
            { value: '10,000+', label: 'Happy Customers' },
            { value: '500+', label: 'Products' },
            { value: '4.9', label: 'Average Rating' },
            { value: '5+', label: 'Years in Business' },
        ],
    },

    BlogHighlights: {
        title: 'From Our Blog',
        maxPosts: 3,
    },

    CustomHTML: {
        code: '<div style="text-align:center;padding:2rem;"><p>Custom content goes here</p></div>',
    },

    BrandLogos: {
        title: 'As Featured In',
        logos: [
            { name: 'Brand 1', imageUrl: 'https://placehold.co/120x40?text=Brand+1' },
            { name: 'Brand 2', imageUrl: 'https://placehold.co/120x40?text=Brand+2' },
            { name: 'Brand 3', imageUrl: 'https://placehold.co/120x40?text=Brand+3' },
            { name: 'Brand 4', imageUrl: 'https://placehold.co/120x40?text=Brand+4' },
        ],
    },

    ImageSlider: {
        slides: [
            { imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop', heading: 'Summer Collection', ctaText: 'Shop Now', ctaLink: '/products' },
            { imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop', heading: 'New Arrivals', ctaText: 'Discover', ctaLink: '/products?tag=new' },
        ],
        autoPlay: true,
        interval: 5000,
    },
};

export default widgetDefaults;
