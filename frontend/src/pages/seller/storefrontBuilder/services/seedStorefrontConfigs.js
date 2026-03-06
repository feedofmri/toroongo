/**
 * Pre-built storefront configurations for all mock sellers.
 * Each seller gets a unique combination of widgets, theme settings, and layouts
 * to showcase the full range of the storefront builder.
 */

const STOREFRONT_CONFIGS_KEY = 'toroongo_storefront_configs';

/**
 * Generate a widget block with a deterministic ID.
 */
function w(id, type, props, layout = {}) {
    return {
        id,
        type,
        props,
        layout: {
            paddingTop: 'medium',
            paddingBottom: 'medium',
            containerWidth: 'boxed',
            hideOnMobile: false,
            hideOnDesktop: false,
            ...layout,
        },
    };
}

/**
 * Seed storefront configs for all 15 sellers into localStorage.
 * Called once during database seeding.
 */
export function seedStorefrontConfigs() {
    const existing = localStorage.getItem(STOREFRONT_CONFIGS_KEY);
    if (existing) return; // Don't overwrite if already seeded

    const configs = {

        // ═══════════════════════════════════════════════════════════════
        // 1. Sony Electronics — Sleek dark tech store
        // ═══════════════════════════════════════════════════════════════
        seller_1: {
            theme: {
                brandColor: '#38f4c7',
                secondaryColor: '#1a1a2e',
                backgroundColor: '#FFFFFF',
                textColor: '#0F172A',
                mutedTextColor: '#64748B',
                headingFont: 'DM Sans',
                bodyFont: 'Inter',
                baseFontSize: 16,
                borderRadius: 'rounded',
                cardStyle: 'shadow',
                headerStyle: 'light',
                logoPosition: 'left',
                stickyHeader: true,
            },
            widgets: [
                w('s1_w1', 'AnnouncementBar', {
                    text: '⚡ Free Express Shipping on orders over $99 — Limited Time!',
                    backgroundColor: '#1a1a2e',
                    textColor: '#38f4c7',
                    dismissible: true,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s1_w2', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1400&h=550&fit=crop',
                    heading: 'Next-Gen Sound. Redefined.',
                    subheading: 'Experience the new WH-1000XM6 with industry-leading noise cancellation',
                    ctaText: 'Shop Headphones',
                    ctaLink: '/products',
                    textAlignment: 'left',
                    overlayOpacity: 0.5,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s1_w3', 'TrustBadges', {
                    badges: [
                        { icon: 'Shield', label: 'Official Sony Store' },
                        { icon: 'Truck', label: 'Free Express Shipping' },
                        { icon: 'RotateCcw', label: '1-Year Warranty' },
                        { icon: 'CreditCard', label: 'Secure Payment' },
                    ],
                }),

                w('s1_w4', 'ProductGrid', {
                    title: 'Best Sellers',
                    columns: 4,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s1_w5', 'FeatureCards', {
                    title: 'Shop by Category',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', label: 'Audio', link: '/products?cat=audio' },
                        { imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop', label: 'Cameras', link: '/products?cat=cameras' },
                        { imageUrl: 'https://images.unsplash.com/photo-1606318313647-137d1f3b4330?w=400&h=300&fit=crop', label: 'Gaming', link: '/products?cat=gaming' },
                    ],
                }),

                w('s1_w6', 'StoreStats', {
                    stats: [
                        { value: '887', label: 'Products' },
                        { value: '4.4★', label: 'Average Rating' },
                        { value: '50K+', label: 'Happy Customers' },
                        { value: '2024', label: 'Est. Year' },
                    ],
                }),

                w('s1_w7', 'NewsletterSignup', {
                    heading: 'Join the Sony Family',
                    subheading: 'Get exclusive deals, early access to new launches, and tech tips',
                    placeholderText: 'your.email@example.com',
                    buttonText: 'Subscribe',
                    buttonColor: '#1a1a2e',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 2. Urban Threads — Trendy fashion boutique
        // ═══════════════════════════════════════════════════════════════
        seller_2: {
            theme: {
                brandColor: '#fec03c',
                secondaryColor: '#1a1a1a',
                backgroundColor: '#FFFBF0',
                textColor: '#1a1a1a',
                mutedTextColor: '#7a7a7a',
                headingFont: 'Playfair Display',
                bodyFont: 'Lato',
                baseFontSize: 16,
                borderRadius: 'pill',
                cardStyle: 'none',
                headerStyle: 'light',
                logoPosition: 'center',
                stickyHeader: true,
            },
            widgets: [
                w('s2_w1', 'ImageSlider', {
                    slides: [
                        { imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=550&fit=crop', heading: 'Spring/Summer \'26', ctaText: 'Shop the Collection', ctaLink: '/products' },
                        { imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=550&fit=crop', heading: 'Streetwear Essentials', ctaText: 'Explore Now', ctaLink: '/products' },
                        { imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=550&fit=crop', heading: 'New Arrivals Daily', ctaText: 'Discover', ctaLink: '/products' },
                    ],
                    autoPlay: true,
                    interval: 4000,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s2_w2', 'FeatureCards', {
                    title: 'Shop the Look',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop', label: 'Women\'s', link: '/products?cat=women' },
                        { imageUrl: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=300&fit=crop', label: 'Men\'s', link: '/products?cat=men' },
                        { imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop', label: 'Accessories', link: '/products?cat=accessories' },
                    ],
                }),

                w('s2_w3', 'ProductGrid', {
                    title: 'Trending Now',
                    columns: 4,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s2_w4', 'TestimonialSlider', {
                    title: 'What Our Customers Say',
                    testimonials: [
                        { rating: 5, text: 'The quality of these clothes is insane for the price. My new go-to store!', author: 'Jessica T.' },
                        { rating: 5, text: 'Fast shipping and the fit is always perfect. Love Urban Threads.', author: 'Marcus D.' },
                        { rating: 4, text: 'Great basics collection. The fabric feels premium.', author: 'Priya K.' },
                    ],
                }),

                w('s2_w5', 'BrandLogos', {
                    title: 'As Seen In',
                    logos: [
                        { name: 'Vogue', imageUrl: 'https://placehold.co/120x40/1a1a1a/ffffff?text=VOGUE' },
                        { name: 'GQ', imageUrl: 'https://placehold.co/120x40/1a1a1a/ffffff?text=GQ' },
                        { name: 'Elle', imageUrl: 'https://placehold.co/120x40/1a1a1a/ffffff?text=ELLE' },
                        { name: 'Harper\'s', imageUrl: 'https://placehold.co/120x40/1a1a1a/ffffff?text=HARPERS' },
                    ],
                }),

                w('s2_w6', 'NewsletterSignup', {
                    heading: 'Get 15% Off Your First Order',
                    subheading: 'Join our mailing list for exclusive drops and style inspiration',
                    placeholderText: 'Enter email for 15% off',
                    buttonText: 'Get My Discount',
                    buttonColor: '#1a1a1a',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 3. NaturGlow — Clean beauty / skincare brand
        // ═══════════════════════════════════════════════════════════════
        seller_3: {
            theme: {
                brandColor: '#fcc06b',
                secondaryColor: '#6B8E6B',
                backgroundColor: '#FEFCF3',
                textColor: '#2D2D2D',
                mutedTextColor: '#8B8B8B',
                headingFont: 'Playfair Display',
                bodyFont: 'Nunito',
                baseFontSize: 16,
                borderRadius: 'pill',
                cardStyle: 'none',
                headerStyle: 'light',
                logoPosition: 'center',
                stickyHeader: true,
            },
            widgets: [
                w('s3_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&h=550&fit=crop',
                    heading: 'Glow Naturally',
                    subheading: 'Clean, cruelty-free skincare that works with your skin, not against it',
                    ctaText: 'Discover Our Range',
                    ctaLink: '/products',
                    textAlignment: 'center',
                    overlayOpacity: 0.3,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s3_w2', 'TrustBadges', {
                    badges: [
                        { icon: 'Leaf', label: '100% Organic' },
                        { icon: 'Shield', label: 'Dermatologist Tested' },
                        { icon: 'RotateCcw', label: '60-Day Returns' },
                        { icon: 'Award', label: 'Cruelty Free' },
                    ],
                }),

                w('s3_w3', 'ProductGrid', {
                    title: 'Customer Favorites',
                    columns: 3,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 6,
                }),

                w('s3_w4', 'VideoPlayer', {
                    title: 'The NaturGlow Story',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    aspectRatio: '16:9',
                }),

                w('s3_w5', 'TestimonialSlider', {
                    title: 'Real Results, Real Reviews',
                    testimonials: [
                        { rating: 5, text: 'My skin has never looked better. The vitamin C serum is a game-changer!', author: 'Amelia W.' },
                        { rating: 5, text: 'Finally found a natural moisturizer that actually hydrates. Obsessed!', author: 'Sarah L.' },
                        { rating: 5, text: 'Sensitive skin approved. No irritation and my acne cleared up in weeks.', author: 'Chen Y.' },
                    ],
                }),

                w('s3_w6', 'ContactForm', {
                    title: 'Skincare Consultation',
                    subtitle: 'Not sure what\'s right for your skin? Our experts are here to help.',
                    fields: ['name', 'email', 'message'],
                    buttonText: 'Get Advice',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 4. TechVault — Premium gadgets store
        // ═══════════════════════════════════════════════════════════════
        seller_4: {
            theme: {
                brandColor: '#bdfe7b',
                secondaryColor: '#0F172A',
                backgroundColor: '#0F172A',
                textColor: '#F1F5F9',
                mutedTextColor: '#94A3B8',
                headingFont: 'DM Sans',
                bodyFont: 'Inter',
                baseFontSize: 16,
                borderRadius: 'rounded',
                cardStyle: 'border',
                headerStyle: 'dark',
                logoPosition: 'left',
                stickyHeader: true,
            },
            widgets: [
                w('s4_w1', 'AnnouncementBar', {
                    text: '🔥 MEGA SALE — Up to 40% off all accessories this week',
                    backgroundColor: '#bdfe7b',
                    textColor: '#0F172A',
                    dismissible: true,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s4_w2', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=550&fit=crop',
                    heading: 'The Future is Here',
                    subheading: 'Cutting-edge gadgets and tech accessories for the modern innovator',
                    ctaText: 'Explore Tech',
                    ctaLink: '/products',
                    textAlignment: 'left',
                    overlayOpacity: 0.6,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s4_w3', 'CountdownTimer', {
                    heading: '🚀 Flash Sale Ends In',
                    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    backgroundColor: '#bdfe7b',
                    textColor: '#0F172A',
                }),

                w('s4_w4', 'ProductGrid', {
                    title: 'Hot Right Now',
                    columns: 4,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s4_w5', 'StoreStats', {
                    stats: [
                        { value: '201', label: 'Premium Products' },
                        { value: '4.9★', label: 'Store Rating' },
                        { value: '25K+', label: 'Units Sold' },
                        { value: '24/7', label: 'Tech Support' },
                    ],
                }),

                w('s4_w6', 'FAQAccordion', {
                    title: 'Frequently Asked Questions',
                    items: [
                        { question: 'Are all products brand new and authentic?', answer: 'Yes! Every product in TechVault is 100% authentic, brand new, and comes with manufacturer warranty.' },
                        { question: 'What is your warranty policy?', answer: 'All products come with a minimum 1-year manufacturer warranty. Extended warranty options are available at checkout.' },
                        { question: 'Do you offer same-day shipping?', answer: 'Orders placed before 2 PM EST ship the same day. We partner with FedEx and UPS for reliable delivery.' },
                        { question: 'Can I trade in my old devices?', answer: 'Yes! Our trade-in program lets you exchange old tech for store credit. Contact us for a valuation.' },
                    ],
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 5. EcoHome — Sustainable home products
        // ═══════════════════════════════════════════════════════════════
        seller_5: {
            theme: {
                brandColor: '#2f22b2',
                secondaryColor: '#4CAF50',
                backgroundColor: '#F5F5F0',
                textColor: '#2D3436',
                mutedTextColor: '#636E72',
                headingFont: 'Merriweather',
                bodyFont: 'Open Sans',
                baseFontSize: 16,
                borderRadius: 'rounded',
                cardStyle: 'shadow',
                headerStyle: 'light',
                logoPosition: 'left',
                stickyHeader: true,
            },
            widgets: [
                w('s5_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&h=550&fit=crop',
                    heading: 'Live Sustainably. Live Beautifully.',
                    subheading: 'Eco-conscious home essentials made from recycled and natural materials',
                    ctaText: 'Shop Eco Collection',
                    ctaLink: '/products',
                    textAlignment: 'center',
                    overlayOpacity: 0.45,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s5_w2', 'TrustBadges', {
                    badges: [
                        { icon: 'Leaf', label: 'Eco-Friendly' },
                        { icon: 'RotateCcw', label: 'Recycled Materials' },
                        { icon: 'Truck', label: 'Carbon-Neutral Shipping' },
                        { icon: 'Award', label: 'B-Corp Certified' },
                    ],
                }),

                w('s5_w3', 'FeatureCards', {
                    title: 'Room by Room',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', label: 'Kitchen', link: '/products?cat=kitchen' },
                        { imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop', label: 'Bedroom', link: '/products?cat=bedroom' },
                        { imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop', label: 'Living Room', link: '/products?cat=living' },
                    ],
                }),

                w('s5_w4', 'ProductGrid', {
                    title: 'New Eco Arrivals',
                    columns: 4,
                    dataSource: 'new',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s5_w5', 'StoreStats', {
                    stats: [
                        { value: '50 tons', label: 'Plastic Saved' },
                        { value: '100%', label: 'Recycled Packaging' },
                        { value: '4.8★', label: 'Customer Rating' },
                        { value: '241', label: 'Eco Products' },
                    ],
                }),

                w('s5_w6', 'BlogHighlights', {
                    title: 'Sustainability Tips',
                    maxPosts: 3,
                }),

                w('s5_w7', 'NewsletterSignup', {
                    heading: 'Join the Green Movement',
                    subheading: 'Tips for sustainable living + 10% off your first eco-order',
                    placeholderText: 'Enter your email',
                    buttonText: 'Go Green',
                    buttonColor: '#4CAF50',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 6. FitGear — Athletic equipment store
        // ═══════════════════════════════════════════════════════════════
        seller_6: {
            theme: {
                brandColor: '#82049e',
                secondaryColor: '#FF6B35',
                backgroundColor: '#FFFFFF',
                textColor: '#1A1A2E',
                mutedTextColor: '#6C757D',
                headingFont: 'Montserrat',
                bodyFont: 'Roboto',
                baseFontSize: 16,
                borderRadius: 'sharp',
                cardStyle: 'border',
                headerStyle: 'dark',
                logoPosition: 'left',
                stickyHeader: true,
            },
            widgets: [
                w('s6_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&h=550&fit=crop',
                    heading: 'PUSH YOUR LIMITS',
                    subheading: 'Professional-grade fitness equipment for every level',
                    ctaText: 'SHOP NOW',
                    ctaLink: '/products',
                    textAlignment: 'left',
                    overlayOpacity: 0.55,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s6_w2', 'CountdownTimer', {
                    heading: '💪 New Year, New Gear — Sale Ends Soon',
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    backgroundColor: '#82049e',
                    textColor: '#FFFFFF',
                }),

                w('s6_w3', 'ProductGrid', {
                    title: 'Top Rated Equipment',
                    columns: 3,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 6,
                }),

                w('s6_w4', 'TestimonialSlider', {
                    title: 'Athletes Trust FitGear',
                    testimonials: [
                        { rating: 5, text: 'Best resistance bands I\'ve ever used. Commercial gym quality at home prices.', author: 'Jake M.' },
                        { rating: 5, text: 'The adjustable dumbbell set is incredible. Saved me thousands vs a full rack.', author: 'Serena W.' },
                        { rating: 4, text: 'Solid yoga mat. Thick, grippy, and doesn\'t smell like chemicals.', author: 'Rosa P.' },
                    ],
                }),

                w('s6_w5', 'VideoPlayer', {
                    title: 'Train With Us',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    aspectRatio: '16:9',
                }),

                w('s6_w6', 'NewsletterSignup', {
                    heading: 'Get Fit, Get Deals',
                    subheading: 'Weekly workout tips and member-only discounts',
                    placeholderText: 'Enter your email',
                    buttonText: 'Join the Team',
                    buttonColor: '#FF6B35',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 7. Bibliophile Haven — Bookstore
        // ═══════════════════════════════════════════════════════════════
        seller_7: {
            theme: {
                brandColor: '#9e517a',
                secondaryColor: '#8B4513',
                backgroundColor: '#FAF6F0',
                textColor: '#2C1810',
                mutedTextColor: '#8B7355',
                headingFont: 'Playfair Display',
                bodyFont: 'Lato',
                baseFontSize: 17,
                borderRadius: 'rounded',
                cardStyle: 'shadow',
                headerStyle: 'light',
                logoPosition: 'center',
                stickyHeader: true,
            },
            widgets: [
                w('s7_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&h=550&fit=crop',
                    heading: 'Every Book Tells a Story',
                    subheading: 'Curated collections for every reader. From classics to contemporary bestsellers.',
                    ctaText: 'Browse Our Shelves',
                    ctaLink: '/products',
                    textAlignment: 'center',
                    overlayOpacity: 0.4,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s7_w2', 'FeatureCards', {
                    title: 'Browse by Genre',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop', label: 'Fiction', link: '/products?cat=fiction' },
                        { imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop', label: 'Non-Fiction', link: '/products?cat=nonfiction' },
                        { imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop', label: 'Children\'s', link: '/products?cat=children' },
                    ],
                }),

                w('s7_w3', 'ProductGrid', {
                    title: 'Staff Picks',
                    columns: 4,
                    dataSource: 'featured',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s7_w4', 'TestimonialSlider', {
                    title: 'Reader Reviews',
                    testimonials: [
                        { rating: 5, text: 'The curation is impeccable. Every recommendation has been a winner!', author: 'David H.' },
                        { rating: 5, text: 'Beautiful editions and fast delivery. My bookshelf has never looked better.', author: 'Emma R.' },
                        { rating: 4, text: 'Love the gift wrapping service. Perfect for book-lover friends.', author: 'Tom S.' },
                    ],
                }),

                w('s7_w5', 'BlogHighlights', {
                    title: 'The Reading Corner',
                    maxPosts: 3,
                }),

                w('s7_w6', 'FAQAccordion', {
                    title: 'Book Lover FAQ',
                    items: [
                        { question: 'Do you offer signed editions?', answer: 'Yes! We regularly stock signed editions and first printings. Check our "Special Editions" collection.' },
                        { question: 'Can I get book recommendations?', answer: 'Absolutely! Fill out our Reader Profile quiz and our staff will curate a personalized list for you.' },
                        { question: 'Do you have a book club?', answer: 'Our monthly book club picks are announced on the 1st of each month. Members get 20% off the selected title.' },
                    ],
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 8. ToyBox — Toy store (colorful, playful)
        // ═══════════════════════════════════════════════════════════════
        seller_8: {
            theme: {
                brandColor: '#0d6e6b',
                secondaryColor: '#FF6B6B',
                backgroundColor: '#FFFFF5',
                textColor: '#2D3436',
                mutedTextColor: '#636E72',
                headingFont: 'Poppins',
                bodyFont: 'Nunito',
                baseFontSize: 16,
                borderRadius: 'pill',
                cardStyle: 'shadow',
                headerStyle: 'light',
                logoPosition: 'center',
                stickyHeader: true,
            },
            widgets: [
                w('s8_w1', 'AnnouncementBar', {
                    text: '🎁 Buy 2, Get 1 Free on all board games this weekend!',
                    backgroundColor: '#FF6B6B',
                    textColor: '#FFFFFF',
                    dismissible: true,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s8_w2', 'ImageSlider', {
                    slides: [
                        { imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1400&h=550&fit=crop', heading: 'Play. Learn. Grow.', ctaText: 'Shop Toys', ctaLink: '/products' },
                        { imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1400&h=550&fit=crop', heading: 'Board Game Night!', ctaText: 'Browse Games', ctaLink: '/products?cat=games' },
                    ],
                    autoPlay: true,
                    interval: 5000,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s8_w3', 'FeatureCards', {
                    title: 'Shop by Age',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop', label: 'Ages 0-3', link: '/products?age=toddler' },
                        { imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop', label: 'Ages 4-8', link: '/products?age=kids' },
                        { imageUrl: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=300&fit=crop', label: 'Ages 9+', link: '/products?age=tweens' },
                    ],
                }),

                w('s8_w4', 'ProductGrid', {
                    title: 'Most Popular Toys',
                    columns: 4,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s8_w5', 'TrustBadges', {
                    badges: [
                        { icon: 'Shield', label: 'Safety Certified' },
                        { icon: 'Award', label: 'Award-Winning Toys' },
                        { icon: 'Truck', label: 'Gift Wrapping' },
                        { icon: 'RotateCcw', label: 'Easy Returns' },
                    ],
                }),

                w('s8_w6', 'StoreStats', {
                    stats: [
                        { value: '721', label: 'Toys & Games' },
                        { value: '4.5★', label: 'Parent Rating' },
                        { value: '100K+', label: 'Happy Kids' },
                        { value: '0', label: 'Boring Toys' },
                    ],
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 9. Wellness Hub — Health & wellness
        // ═══════════════════════════════════════════════════════════════
        seller_9: {
            theme: {
                brandColor: '#6ec0ac',
                secondaryColor: '#A8DADC',
                backgroundColor: '#F8FFFE',
                textColor: '#1D3557',
                mutedTextColor: '#457B9D',
                headingFont: 'Raleway',
                bodyFont: 'Open Sans',
                baseFontSize: 16,
                borderRadius: 'rounded',
                cardStyle: 'none',
                headerStyle: 'light',
                logoPosition: 'center',
                stickyHeader: true,
            },
            widgets: [
                w('s9_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1400&h=550&fit=crop',
                    heading: 'Your Wellness Journey Starts Here',
                    subheading: 'Supplements, superfoods, and self-care essentials backed by science',
                    ctaText: 'Shop Wellness',
                    ctaLink: '/products',
                    textAlignment: 'center',
                    overlayOpacity: 0.35,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s9_w2', 'TrustBadges', {
                    badges: [
                        { icon: 'Shield', label: 'Lab Tested' },
                        { icon: 'Leaf', label: 'All Natural' },
                        { icon: 'Award', label: 'GMP Certified' },
                        { icon: 'Truck', label: 'Free Shipping $40+' },
                    ],
                }),

                w('s9_w3', 'ProductGrid', {
                    title: 'Best Sellers',
                    columns: 3,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 6,
                }),

                w('s9_w4', 'TestimonialSlider', {
                    title: 'Transformation Stories',
                    testimonials: [
                        { rating: 5, text: 'The magnesium supplement completely fixed my sleep issues. Life-changing!', author: 'Rachel G.' },
                        { rating: 5, text: 'Best protein powder I\'ve ever tasted. No chalky aftertaste.', author: 'Mike B.' },
                        { rating: 4, text: 'Love the vitamin subscription. Never run out and it saves me money.', author: 'Linda C.' },
                    ],
                }),

                w('s9_w5', 'ContactForm', {
                    title: 'Ask Our Nutritionist',
                    subtitle: 'Free health consultation — tell us your goals and we\'ll recommend the right supplements.',
                    fields: ['name', 'email', 'message'],
                    buttonText: 'Get Recommendations',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 10. Glamour Shop — Beauty & cosmetics (luxury feel)
        // ═══════════════════════════════════════════════════════════════
        seller_10: {
            theme: {
                brandColor: '#3593b0',
                secondaryColor: '#C9A961',
                backgroundColor: '#FFFFFF',
                textColor: '#1A1A1A',
                mutedTextColor: '#888888',
                headingFont: 'Playfair Display',
                bodyFont: 'Lato',
                baseFontSize: 16,
                borderRadius: 'sharp',
                cardStyle: 'none',
                headerStyle: 'light',
                logoPosition: 'center',
                stickyHeader: true,
            },
            widgets: [
                w('s10_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&h=600&fit=crop',
                    heading: 'Luxury. Redefined.',
                    subheading: 'Premium beauty and cosmetics curated for the modern woman',
                    ctaText: 'Explore Collection',
                    ctaLink: '/products',
                    textAlignment: 'center',
                    overlayOpacity: 0.35,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s10_w2', 'FeatureCards', {
                    title: 'Shop by Category',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop', label: 'Skincare', link: '/products?cat=skincare' },
                        { imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop', label: 'Makeup', link: '/products?cat=makeup' },
                        { imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop', label: 'Fragrances', link: '/products?cat=fragrances' },
                    ],
                }),

                w('s10_w3', 'ProductGrid', {
                    title: 'Editor\'s Picks',
                    columns: 4,
                    dataSource: 'featured',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s10_w4', 'BrandLogos', {
                    title: 'Brands We Carry',
                    logos: [
                        { name: 'Chanel', imageUrl: 'https://placehold.co/120x40/1a1a1a/ffffff?text=CHANEL' },
                        { name: 'Dior', imageUrl: 'https://placehold.co/120x40/1a1a1a/ffffff?text=DIOR' },
                        { name: 'MAC', imageUrl: 'https://placehold.co/120x40/1a1a1a/ffffff?text=MAC' },
                        { name: 'NARS', imageUrl: 'https://placehold.co/120x40/1a1a1a/ffffff?text=NARS' },
                    ],
                }),

                w('s10_w5', 'TestimonialSlider', {
                    title: 'What Our Beauties Say',
                    testimonials: [
                        { rating: 5, text: 'Received my order in a gorgeous gift box. The presentation is everything!', author: 'Sophia A.' },
                        { rating: 5, text: 'Authentic luxury products at better prices than department stores.', author: 'Isabella M.' },
                        { rating: 5, text: 'The Glamour Shop membership is so worth it. VIP access to new launches!', author: 'Olivia J.' },
                    ],
                }),

                w('s10_w6', 'NewsletterSignup', {
                    heading: 'Join the Glamour List',
                    subheading: 'VIP access to new launches, beauty tips, and exclusive member-only offers',
                    placeholderText: 'Enter your email',
                    buttonText: 'Become a VIP',
                    buttonColor: '#C9A961',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 11. Modern Living — Furniture & decor
        // ═══════════════════════════════════════════════════════════════
        seller_11: {
            theme: {
                brandColor: '#67cbb2',
                secondaryColor: '#D4A574',
                backgroundColor: '#FAFAF8',
                textColor: '#2D2D2D',
                mutedTextColor: '#7A7A7A',
                headingFont: 'DM Sans',
                bodyFont: 'Inter',
                baseFontSize: 16,
                borderRadius: 'rounded',
                cardStyle: 'shadow',
                headerStyle: 'light',
                logoPosition: 'left',
                stickyHeader: true,
            },
            widgets: [
                w('s11_w1', 'ImageSlider', {
                    slides: [
                        { imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=550&fit=crop', heading: 'Modern Comfort. Timeless Design.', ctaText: 'Shop Furniture', ctaLink: '/products' },
                        { imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&h=550&fit=crop', heading: 'Spring Refresh Collection', ctaText: 'Explore', ctaLink: '/products?tag=spring' },
                    ],
                    autoPlay: true,
                    interval: 6000,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s11_w2', 'FeatureCards', {
                    title: 'Shop by Room',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop', label: 'Bedroom', link: '/products?room=bedroom' },
                        { imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', label: 'Living Room', link: '/products?room=living' },
                        { imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', label: 'Home Office', link: '/products?room=office' },
                    ],
                }),

                w('s11_w3', 'ProductGrid', {
                    title: 'Bestselling Pieces',
                    columns: 4,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s11_w4', 'TrustBadges', {
                    badges: [
                        { icon: 'Truck', label: 'White Glove Delivery' },
                        { icon: 'RotateCcw', label: '90-Day Returns' },
                        { icon: 'Shield', label: '5-Year Warranty' },
                        { icon: 'Headphones', label: 'Design Consultation' },
                    ],
                }),

                w('s11_w5', 'StoreStats', {
                    stats: [
                        { value: '703', label: 'Unique Pieces' },
                        { value: '4.7★', label: 'Customer Rating' },
                        { value: '15K+', label: 'Homes Furnished' },
                        { value: '3', label: 'Showrooms' },
                    ],
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 12. Pixel Perfect — Electronics / Photography
        // ═══════════════════════════════════════════════════════════════
        seller_12: {
            theme: {
                brandColor: '#0d022e',
                secondaryColor: '#6C5CE7',
                backgroundColor: '#FFFFFF',
                textColor: '#0d022e',
                mutedTextColor: '#636E72',
                headingFont: 'Montserrat',
                bodyFont: 'Roboto',
                baseFontSize: 16,
                borderRadius: 'rounded',
                cardStyle: 'border',
                headerStyle: 'dark',
                logoPosition: 'left',
                stickyHeader: true,
            },
            widgets: [
                w('s12_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1400&h=550&fit=crop',
                    heading: 'Capture Every Moment',
                    subheading: 'Professional cameras, lenses, and accessories for creators at every level',
                    ctaText: 'Shop Cameras',
                    ctaLink: '/products',
                    textAlignment: 'left',
                    overlayOpacity: 0.5,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s12_w2', 'ProductGrid', {
                    title: 'Staff Favorites',
                    columns: 4,
                    dataSource: 'featured',
                    layoutStyle: 'grid',
                    maxItems: 4,
                }),

                w('s12_w3', 'VideoPlayer', {
                    title: 'See What You Can Create',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    aspectRatio: '16:9',
                }),

                w('s12_w4', 'FAQAccordion', {
                    title: 'Photographer FAQ',
                    items: [
                        { question: 'Do you offer trade-ins on old camera bodies?', answer: 'Yes! Bring in your old gear and get up to 40% of its value as store credit toward new equipment.' },
                        { question: 'Can I rent equipment before buying?', answer: 'We offer a Try-Before-You-Buy program on select cameras and lenses. Contact us for details.' },
                        { question: 'Do you service and repair cameras?', answer: 'Our in-house technicians handle sensor cleaning, lens calibration, and minor repairs with fast turnaround.' },
                    ],
                }),

                w('s12_w5', 'NewsletterSignup', {
                    heading: 'Pixel Perfect Updates',
                    subheading: 'New gear launches, photography tutorials, and exclusive deals',
                    placeholderText: 'your@email.com',
                    buttonText: 'Subscribe',
                    buttonColor: '#6C5CE7',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 13. Style Avenue — Fashion (minimal, high-end)
        // ═══════════════════════════════════════════════════════════════
        seller_13: {
            theme: {
                brandColor: '#277df6',
                secondaryColor: '#1a1a1a',
                backgroundColor: '#FFFFFF',
                textColor: '#111111',
                mutedTextColor: '#777777',
                headingFont: 'DM Sans',
                bodyFont: 'Inter',
                baseFontSize: 15,
                borderRadius: 'sharp',
                cardStyle: 'none',
                headerStyle: 'light',
                logoPosition: 'center',
                stickyHeader: true,
            },
            widgets: [
                w('s13_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=600&fit=crop',
                    heading: 'Effortless Elegance',
                    subheading: 'Curated fashion for the modern professional',
                    ctaText: 'Shop Now',
                    ctaLink: '/products',
                    textAlignment: 'center',
                    overlayOpacity: 0.4,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s13_w2', 'ProductGrid', {
                    title: 'New In',
                    columns: 4,
                    dataSource: 'new',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s13_w3', 'FeatureCards', {
                    title: 'Collections',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop', label: 'Workwear', link: '/products?col=workwear' },
                        { imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop', label: 'Weekend', link: '/products?col=weekend' },
                        { imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop', label: 'Evening', link: '/products?col=evening' },
                    ],
                }),

                w('s13_w4', 'BrandLogos', {
                    title: 'Featured Brands',
                    logos: [
                        { name: 'Zara', imageUrl: 'https://placehold.co/120x40/111111/ffffff?text=ZARA' },
                        { name: 'H&M', imageUrl: 'https://placehold.co/120x40/111111/ffffff?text=H%26M' },
                        { name: 'COS', imageUrl: 'https://placehold.co/120x40/111111/ffffff?text=COS' },
                        { name: 'Massimo', imageUrl: 'https://placehold.co/120x40/111111/ffffff?text=MASSIMO' },
                    ],
                }),

                w('s13_w5', 'NewsletterSignup', {
                    heading: 'First Access',
                    subheading: 'Be the first to shop new arrivals and get 10% off your order',
                    placeholderText: 'Email address',
                    buttonText: 'Sign Up',
                    buttonColor: '#111111',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 14. Green Life — Organic / wellness
        // ═══════════════════════════════════════════════════════════════
        seller_14: {
            theme: {
                brandColor: '#708a7d',
                secondaryColor: '#A8C5A0',
                backgroundColor: '#F4F7F4',
                textColor: '#2D3B2D',
                mutedTextColor: '#6B7F6B',
                headingFont: 'Merriweather',
                bodyFont: 'Nunito',
                baseFontSize: 16,
                borderRadius: 'rounded',
                cardStyle: 'shadow',
                headerStyle: 'light',
                logoPosition: 'left',
                stickyHeader: true,
            },
            widgets: [
                w('s14_w1', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1400&h=550&fit=crop',
                    heading: 'Green Living Made Easy',
                    subheading: 'Organic, sustainable, and ethical products for a better world',
                    ctaText: 'Shop Organic',
                    ctaLink: '/products',
                    textAlignment: 'center',
                    overlayOpacity: 0.4,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s14_w2', 'TrustBadges', {
                    badges: [
                        { icon: 'Leaf', label: 'USDA Organic' },
                        { icon: 'Shield', label: 'Non-GMO Verified' },
                        { icon: 'Award', label: 'Fair Trade' },
                        { icon: 'RotateCcw', label: 'Zero Waste' },
                    ],
                }),

                w('s14_w3', 'ProductGrid', {
                    title: 'Best Sellers',
                    columns: 3,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 6,
                }),

                w('s14_w4', 'StoreStats', {
                    stats: [
                        { value: '175', label: 'Organic Products' },
                        { value: '4.4★', label: 'Store Rating' },
                        { value: '100%', label: 'Recyclable Packaging' },
                        { value: '0', label: 'Artificial Ingredients' },
                    ],
                }),

                w('s14_w5', 'BlogHighlights', {
                    title: 'Green Living Blog',
                    maxPosts: 3,
                }),

                w('s14_w6', 'NewsletterSignup', {
                    heading: 'Go Green With Us',
                    subheading: 'Weekly eco-tips and 15% off your first organic order',
                    placeholderText: 'Your email address',
                    buttonText: 'Join Green Life',
                    buttonColor: '#A8C5A0',
                }),
            ],
        },

        // ═══════════════════════════════════════════════════════════════
        // 15. Comfort Zone — Home textiles & lifestyle
        // ═══════════════════════════════════════════════════════════════
        seller_15: {
            theme: {
                brandColor: '#81f534',
                secondaryColor: '#E8B4B8',
                backgroundColor: '#FFFAF9',
                textColor: '#2C2C2C',
                mutedTextColor: '#8C8C8C',
                headingFont: 'Poppins',
                bodyFont: 'Open Sans',
                baseFontSize: 16,
                borderRadius: 'pill',
                cardStyle: 'shadow',
                headerStyle: 'light',
                logoPosition: 'center',
                stickyHeader: true,
            },
            widgets: [
                w('s15_w1', 'AnnouncementBar', {
                    text: '🏠 Free returns on all bedding — Try it at home risk-free!',
                    backgroundColor: '#81f534',
                    textColor: '#1a1a1a',
                    dismissible: true,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s15_w2', 'HeroBanner', {
                    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&h=550&fit=crop',
                    heading: 'Your Sanctuary Awaits',
                    subheading: 'Luxuriously soft bedding, throws, and home textiles for ultimate comfort',
                    ctaText: 'Shop Comfort',
                    ctaLink: '/products',
                    textAlignment: 'center',
                    overlayOpacity: 0.35,
                }, { containerWidth: 'full', paddingTop: 'small', paddingBottom: 'small' }),

                w('s15_w3', 'FeatureCards', {
                    title: 'Cozy Collections',
                    cards: [
                        { imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop', label: 'Bedding', link: '/products?col=bedding' },
                        { imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', label: 'Throws & Pillows', link: '/products?col=throws' },
                        { imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop', label: 'Bath Towels', link: '/products?col=bath' },
                    ],
                }),

                w('s15_w4', 'ProductGrid', {
                    title: 'Customer Favorites',
                    columns: 4,
                    dataSource: 'bestsellers',
                    layoutStyle: 'grid',
                    maxItems: 8,
                }),

                w('s15_w5', 'TestimonialSlider', {
                    title: 'Why Customers Love Us',
                    testimonials: [
                        { rating: 5, text: 'These sheets are INCREDIBLE. Hotel quality at a fraction of the price. I bought 3 sets!', author: 'Hannah K.' },
                        { rating: 5, text: 'The weighted blanket changed my life. I fall asleep in minutes now.', author: 'Chris T.' },
                        { rating: 5, text: 'So soft, so cozy. My bedroom feels like a spa retreat. 10/10 would recommend.', author: 'Nadia R.' },
                    ],
                }),

                w('s15_w6', 'CountdownTimer', {
                    heading: '☁️ Comfort Week Sale — Up to 50% Off',
                    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                    backgroundColor: '#81f534',
                    textColor: '#1a1a1a',
                }),

                w('s15_w7', 'ContactForm', {
                    title: 'Need Help Choosing?',
                    subtitle: 'Our comfort experts can help you find the perfect bedding for your needs.',
                    fields: ['name', 'email', 'message'],
                    buttonText: 'Ask an Expert',
                }),
            ],
        },
    };

    localStorage.setItem(STOREFRONT_CONFIGS_KEY, JSON.stringify(configs));
    console.log('✅ Storefront configs seeded for all 15 sellers');
}
