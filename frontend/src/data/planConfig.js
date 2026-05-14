/**
 * Centralized Plan Configuration — Single Source of Truth
 * 
 * This file defines all plan tiers, features, prices, and access rules.
 * Used by PricingPage, SellerDashboard, Subscription pages, and feature gating.
 */

export const PLAN_ORDER = ['starter', 'pro', 'business', 'enterprise'];

export const PLANS = {
    starter: {
        key: 'starter',
        name: 'Starter',
        price: 0,
        period: '/ Month',
        description: 'Perfect for new sellers getting started.',
        color: '#6B7280',       // gray
        bgGradient: 'from-gray-500/10 to-gray-400/5',
        borderColor: 'border-gray-300',
        badgeBg: 'bg-gray-100 text-gray-600',
        productLimit: 10,
        buttonText: 'Get Started',
        highlight: false,
    },
    pro: {
        key: 'pro',
        name: 'Pro',
        price: 5,
        period: '/ Month',
        description: 'Ideal for growing sellers with high volume.',
        color: '#3B82F6',       // blue
        bgGradient: 'from-blue-500/10 to-blue-400/5',
        borderColor: 'border-blue-400',
        badgeBg: 'bg-blue-100 text-blue-700',
        productLimit: null,     // unlimited
        buttonText: 'Go Pro',
        highlight: false,
    },
    business: {
        key: 'business',
        name: 'Business',
        price: 15,
        period: '/ Month',
        description: 'For established retailers scaling operations.',
        color: '#8B5CF6',       // purple
        bgGradient: 'from-purple-500/10 to-purple-400/5',
        borderColor: 'border-purple-400',
        badgeBg: 'bg-purple-100 text-purple-700',
        productLimit: null,
        buttonText: 'Go Business',
        highlight: true,
    },
    enterprise: {
        key: 'enterprise',
        name: 'Enterprise',
        price: 40,
        period: '/ Month',
        description: 'For power sellers with massive operations.',
        color: '#F59E0B',       // amber/gold
        bgGradient: 'from-amber-500/10 to-amber-400/5',
        borderColor: 'border-amber-400',
        badgeBg: 'bg-amber-100 text-amber-700',
        productLimit: null,
        buttonText: 'Go Enterprise',
        highlight: false,
    },
};

/**
 * Feature definitions with plan access levels.
 * `minPlan` = the minimum plan required to access this feature.
 * `category` = grouping for display in the plan features widget.
 */
export const FEATURES = {
    // ── Starter Features ─────────────────────────────────────
    products:           { label: 'Up to 10 Product Listings (Digital & Physical)',   minPlan: 'starter', category: 'core' },
    themes:             { label: 'Mobile-Responsive Storefront Themes',              minPlan: 'starter', category: 'core' },
    builder:            { label: 'Drag-and-Drop Store Builder',                      minPlan: 'starter', category: 'core', subtitle: 'Toroongo branded subdomain' },
    payment:            { label: 'Local Payment Gateway Integrations',               minPlan: 'starter', category: 'core' },
    inventory:          { label: 'Basic Order & Inventory Management',               minPlan: 'starter', category: 'core' },
    seo:                { label: 'Basic SEO Meta Control',                           minPlan: 'starter', category: 'core', subtitle: 'Titles & Descriptions' },
    analytics:          { label: 'Basic Analytics',                                  minPlan: 'starter', category: 'core', subtitle: 'Page views & total sales' },
    support:            { label: 'Standard Support',                                 minPlan: 'starter', category: 'core' },

    // ── Pro Features ─────────────────────────────────────────
    unlimited_products: { label: 'Unlimited Product Listings',                       minPlan: 'pro', category: 'core' },
    domain:             { label: 'Custom Domain Support',                            minPlan: 'pro', category: 'core' },
    variants:           { label: 'Advanced Variant Management',                      minPlan: 'pro', category: 'core', subtitle: 'Multiple colors, sizes, SKUs' },
    social:             { label: 'Social Commerce Integrations',                     minPlan: 'pro', category: 'core', subtitle: 'Meta Pixel, Google Shopping feeds' },
    discount:           { label: 'Basic Discount Rules',                             minPlan: 'pro', category: 'core', subtitle: 'Percentage off, flat rate' },
    advanced_analytics: { label: 'Advanced Analytics',                               minPlan: 'pro', category: 'core', subtitle: 'Conversion funnels, visitor heatmaps' },
    priority_support:   { label: 'Priority Support',                                 minPlan: 'pro', category: 'core' },

    // ── Business Features ────────────────────────────────────
    whitelabel:         { label: 'White-Labeling',                                   minPlan: 'business', category: 'core', subtitle: 'Complete removal of "Powered by Toroongo" branding' },
    staff:              { label: 'Multiple Staff Accounts',                          minPlan: 'business', category: 'core', subtitle: 'Up to 5 users with role permissions' },
    abandoned:          { label: 'Abandoned Cart Recovery',                          minPlan: 'business', category: 'core', subtitle: 'Automated follow-up emails' },
    currency:           { label: 'Multi-Currency Support',                           minPlan: 'business', category: 'core', subtitle: 'Auto-converting prices based on IP' },
    api:                { label: 'Full API & Webhooks Access',                       minPlan: 'business', category: 'core' },
    blog:               { label: 'Blog Engine',                                      minPlan: 'pro', category: 'core', subtitle: 'Built-in for content marketing' },
    manager:            { label: 'Dedicated Account Manager',                        minPlan: 'business', category: 'core' },

    // ── Enterprise Features ──────────────────────────────────
    unlimited_staff:    { label: 'Unlimited Staff Accounts',                         minPlan: 'enterprise', category: 'core' },
    css:                { label: 'Custom CSS/HTML Access',                            minPlan: 'enterprise', category: 'core', subtitle: 'Bespoke storefront design' },
    affiliate:          { label: 'Affiliate & Referral System',                      minPlan: 'enterprise', category: 'core', subtitle: 'Sellers can run their own affiliate networks' },
    import:             { label: 'Advanced Bulk Import/Export',                       minPlan: 'enterprise', category: 'core', subtitle: 'Custom data mapping' },
    custom_pricing:     { label: 'Custom Contract Pricing',                          minPlan: 'enterprise', category: 'core' },
    premium_sla:        { label: 'Premium Support SLA',                              minPlan: 'enterprise', category: 'core' },
};

/**
 * AI features per plan tier.
 */
export const AI_FEATURES = {
    starter: [
        {
            title: 'AI Product Description Generator',
            desc: 'Instantly write engaging, SEO-friendly descriptions from a few keywords.',
        },
    ],
    pro: [
        {
            title: 'AI Image Enhancer',
            desc: 'Automatically remove backgrounds, upscale, and replace backgrounds with pure white or brand colors.',
        },
        {
            title: 'AI Multilingual Auto-Translator',
            desc: 'Instantly translate product catalogs into regional languages for localized reach.',
        },
    ],
    business: [
        {
            title: 'Autonomous Support Agent (RAG-Powered)',
            desc: "24/7 AI chatbot trained on the seller's store policies and products for buyer questions.",
        },
        {
            title: 'AI "Smart Upsell" Engine',
            desc: "Powers the 'Frequently Bought Together' recommendations.",
        },
        {
            title: 'Autonomous Marketing Agent',
            desc: 'Auto-generates social media captions and promotional email drafts for new launches.',
        },
    ],
    enterprise: [
        {
            title: 'AI Inventory Forecasting',
            desc: 'Predicts inventory run-outs based on historical sales velocity and trends.',
        },
        {
            title: 'AI Sentiment Analysis',
            desc: 'Analyzes hundreds of reviews for instant, actionable summaries.',
        },
        {
            title: 'AI Dynamic Pricing Assistant',
            desc: 'Suggests optimal price points based on market trends.',
        },
    ],
};

/**
 * Short feature lists for plan cards (what's new in this tier).
 */
export const PLAN_CARD_FEATURES = {
    starter: [
        'Up to 10 Product Listings (Digital & Physical)',
        'Mobile-Responsive Storefront Themes',
        'Drag-and-Drop Store Builder (Toroongo branded subdomain)',
        'Local Payment Gateway Integrations',
        'Basic Order & Inventory Management',
        'Basic SEO Meta Control (Titles & Descriptions)',
        'Basic Analytics (Page views & total sales)',
        'Standard Support',
    ],
    pro: [
        'Unlimited Product Listings',
        'Custom Domain Support',
        'Advanced Variant Management (Multiple colors, sizes, SKUs)',
        'Social Commerce Integrations (Meta Pixel, Google Shopping feeds)',
        'Basic Discount Rules (Percentage off, flat rate)',
        'Advanced Analytics (Conversion funnels, visitor heatmaps)',
        'Priority Support',
        'Blog Engine built-in for content marketing',
    ],
    business: [
        'White-Labeling: Complete removal of "Powered by Toroongo" branding',
        'Multiple Staff Accounts (Up to 5 users with role permissions)',
        'Abandoned Cart Recovery (Automated follow-up emails)',
        'Multi-Currency Support (Auto-converting prices based on IP)',
        'Full API & Webhooks Access',
        'Dedicated Account Manager',
    ],
    enterprise: [
        'Unlimited Staff Accounts',
        'Custom CSS/HTML Access (Bespoke storefront design)',
        'Affiliate & Referral System',
        'Advanced Bulk Import/Export (Custom data mapping)',
        'Custom Contract Pricing',
        'Premium Support SLA',
    ],
};

/**
 * "Includes everything in X, plus:" labels for each plan.
 */
export const PLAN_INCLUDES_LABEL = {
    starter: null,
    pro: 'Includes everything in Starter, plus:',
    business: 'Includes everything in Pro, plus:',
    enterprise: 'Includes everything in Business, plus:',
};

// ── Helper Functions ──────────────────────────────────────────

/**
 * Returns the index (0-3) of a plan in the tier hierarchy.
 */
export function getPlanIndex(plan) {
    return PLAN_ORDER.indexOf(plan);
}

/**
 * Check if a plan can access a feature.
 */
export function canAccessFeature(currentPlan, featureKey) {
    const feature = FEATURES[featureKey];
    if (!feature) return true; // Unknown features are allowed
    return getPlanIndex(currentPlan) >= getPlanIndex(feature.minPlan);
}

/**
 * Get all features accessible for a plan.
 */
export function getPlanFeatures(plan) {
    const planIdx = getPlanIndex(plan);
    return Object.entries(FEATURES)
        .filter(([, feat]) => getPlanIndex(feat.minPlan) <= planIdx)
        .map(([key, feat]) => ({ key, ...feat }));
}

/**
 * Get all features NOT accessible for a plan (locked features from higher tiers).
 */
export function getLockedFeatures(plan) {
    const planIdx = getPlanIndex(plan);
    return Object.entries(FEATURES)
        .filter(([, feat]) => getPlanIndex(feat.minPlan) > planIdx)
        .map(([key, feat]) => ({ key, ...feat }));
}

/**
 * Get the AI features cumulative up to a given plan.
 */
export function getCumulativeAiFeatures(plan) {
    const planIdx = getPlanIndex(plan);
    let features = [];
    for (let i = 0; i <= planIdx; i++) {
        const tierKey = PLAN_ORDER[i];
        features = [...features, ...(AI_FEATURES[tierKey] || [])];
    }
    return features;
}

/**
 * Get locked AI features (from tiers above the current plan).
 */
export function getLockedAiFeatures(plan) {
    const planIdx = getPlanIndex(plan);
    let features = [];
    for (let i = planIdx + 1; i < PLAN_ORDER.length; i++) {
        const tierKey = PLAN_ORDER[i];
        features = [...features, ...(AI_FEATURES[tierKey] || []).map(f => ({ ...f, requiredPlan: tierKey }))];
    }
    return features;
}

/**
 * Get the next plan above the current one.
 */
export function getNextPlan(currentPlan) {
    const idx = getPlanIndex(currentPlan);
    return idx < PLAN_ORDER.length - 1 ? PLAN_ORDER[idx + 1] : null;
}

/**
 * Get the product limit for a plan. Returns null for unlimited.
 */
export function getProductLimit(plan) {
    return PLANS[plan]?.productLimit ?? 10;
}

/**
 * Check if a plan is higher than another.
 */
export function isHigherPlan(planA, planB) {
    return getPlanIndex(planA) > getPlanIndex(planB);
}

/**
 * Mapping of seller dashboard sidebar items to required feature keys.
 * Only items that need gating are listed here.
 * Items NOT listed here are available on ALL plans.
 */
export const SIDEBAR_FEATURE_MAP = {
    '/seller/blogs': 'blog',
    '/seller/finance': 'advanced_analytics',
    '/seller/discounts': 'discount',
    '/seller/staff': 'staff',
    '/seller/domain': 'domain',
    '/seller/social-commerce': 'social',
    '/seller/abandoned-carts': 'abandoned',
    '/seller/api': 'api',
    '/seller/affiliates': 'affiliate',
    '/seller/import-export': 'import',
};
