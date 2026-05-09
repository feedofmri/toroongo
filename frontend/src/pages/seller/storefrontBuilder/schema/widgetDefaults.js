/**
 * Default props for each widget type.
 * Used when dragging a new widget onto the canvas.
 */

export const widgetDefaults = {
    HeroBanner: {
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop',
        badge: '',
        heading: 'Welcome to Our Store',
        subheading: 'Discover amazing products at great prices',
        minHeight: 'medium',
        textAlignment: 'center',
        overlayOpacity: 0.4,
        ctaText: 'Shop Now',
        ctaLink: '/products',
        ctaSecondaryText: '',
        ctaSecondaryLink: '',
    },

    AnnouncementBar: {
        emoji: '🎉',
        text: 'Free shipping on orders over $50!',
        linkText: 'Shop Now',
        linkUrl: '/products',
        backgroundColor: '',
        textColor: '#FFFFFF',
        scrolling: false,
        dismissible: true,
    },

    ProductGrid: {
        title: 'Featured Products',
        columns: 4,
        dataSource: 'featured',
        layoutStyle: 'grid',
        maxItems: 8,
        showRating: true,
        showViewAll: true,
        viewAllText: 'View All',
        viewAllLink: '/products',
    },

    FeatureCards: {
        title: 'Shop by Collection',
        columns: 3,
        aspectRatio: '4:3',
        cardStyle: 'overlay',
        cards: [
            { imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', label: 'New Arrivals', sublabel: 'Fresh picks every week', link: '/products?tag=new' },
            { imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop', label: 'Best Sellers', sublabel: 'Most loved items', link: '/products?tag=bestseller' },
            { imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop', label: 'Sale', sublabel: 'Up to 50% off', link: '/products?tag=sale' },
        ],
    },

    TestimonialSlider: {
        title: 'What Our Customers Say',
        layout: 'carousel',
        showAvatars: true,
        backgroundColor: '',
        testimonials: [
            { rating: 5, text: 'Amazing quality and fast shipping! Will definitely order again.', author: 'Sarah M.', role: 'Verified Buyer', avatarUrl: '' },
            { rating: 5, text: 'Best store on Toroongo. Love the product selection.', author: 'James K.', role: 'Regular Customer', avatarUrl: '' },
            { rating: 4, text: 'Great customer service and beautiful packaging.', author: 'Emily R.', role: 'Verified Buyer', avatarUrl: '' },
        ],
    },

    NewsletterSignup: {
        heading: 'Stay in the Loop',
        subheading: 'Subscribe for exclusive deals and new arrivals',
        placeholderText: 'Enter your email address',
        buttonText: 'Subscribe',
        buttonColor: '',
        disclaimer: '',
        successMessage: 'Thanks for subscribing! Check your inbox for a welcome gift.',
        backgroundColor: '',
        backgroundImage: '',
    },

    CountdownTimer: {
        heading: 'Flash Sale Ends In',
        subtext: 'Limited stock — grab yours before it\'s gone!',
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        expiredMessage: 'This sale has ended. Check out our latest deals!',
        targetUrl: '/products',
        showSeconds: true,
        backgroundColor: '',
        textColor: '#FFFFFF',
    },

    VideoPlayer: {
        title: 'Our Story',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        uploadedVideoUrl: '',
        posterUrl: '',
        aspectRatio: '16:9',
        autoplay: false,
        caption: '',
    },

    TrustBadges: {
        title: '',
        layout: 'horizontal',
        showDividers: false,
        badges: [
            { icon: 'Shield', label: 'Secure Checkout', description: 'SSL encrypted & safe' },
            { icon: 'RotateCcw', label: '30-Day Returns', description: 'Hassle-free returns' },
            { icon: 'Truck', label: 'Free Shipping', description: 'On orders over $50' },
            { icon: 'Leaf', label: 'Eco-Friendly', description: 'Sustainable packaging' },
        ],
    },

    FAQAccordion: {
        title: 'Frequently Asked Questions',
        allowMultipleOpen: false,
        style: 'bordered',
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
        showPhone: false,
        showSubject: false,
        successMessage: '',
        backgroundColor: '',
    },

    StoreStats: {
        title: '',
        style: 'cards',
        backgroundColor: '',
        stats: [
            { prefix: '', value: '10,000+', suffix: '', label: 'Happy Customers' },
            { prefix: '', value: '500+', suffix: '', label: 'Products' },
            { prefix: '', value: '4.9', suffix: '/5', label: 'Average Rating' },
            { prefix: '', value: '5+', suffix: '', label: 'Years in Business' },
        ],
    },

    BlogHighlights: {
        title: 'From Our Blog',
        maxPosts: 3,
        layout: 'grid',
        showAuthor: true,
        showCategory: true,
    },

    CustomHTML: {
        code: '<div style="text-align:center;padding:2rem;"><p>Custom content goes here</p></div>',
    },

    BrandLogos: {
        title: 'As Featured In',
        grayscale: true,
        animate: false,
        logoHeight: 'medium',
        logos: [
            { name: 'Brand 1', imageUrl: 'https://placehold.co/120x40?text=Brand+1', link: '' },
            { name: 'Brand 2', imageUrl: 'https://placehold.co/120x40?text=Brand+2', link: '' },
            { name: 'Brand 3', imageUrl: 'https://placehold.co/120x40?text=Brand+3', link: '' },
            { name: 'Brand 4', imageUrl: 'https://placehold.co/120x40?text=Brand+4', link: '' },
        ],
    },

    ImageSlider: {
        slides: [
            { imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop', heading: 'Summer Collection', subheading: 'New styles for the season', ctaText: 'Shop Now', ctaLink: '/products' },
            { imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop', heading: 'New Arrivals', subheading: 'Just dropped — be the first', ctaText: 'Discover', ctaLink: '/products?tag=new' },
        ],
        height: 'medium',
        autoPlay: true,
        interval: 5000,
        showArrows: true,
        showDots: true,
        transition: 'slide',
    },
};

export default widgetDefaults;
