/**
 * Widget Registry
 * Maps widget type keys to their React components, metadata, default props, and property schemas.
 * The property schema drives the auto-generated PropertyEditor sidebar.
 */
import {
    Image, LayoutGrid, Columns3, MessageCircle, Mail, Timer,
    Play, ShieldCheck, HelpCircle, MessageSquare, BarChart3,
    FileText, Code, Award, Images, Megaphone
} from 'lucide-react';
import { widgetDefaults } from '../schema/widgetDefaults.js';

import HeroBanner from './HeroBanner.jsx';
import AnnouncementBar from './AnnouncementBar.jsx';
import ProductGrid from './ProductGrid.jsx';
import FeatureCards from './FeatureCards.jsx';
import TestimonialSlider from './TestimonialSlider.jsx';
import NewsletterSignup from './NewsletterSignup.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import TrustBadges from './TrustBadges.jsx';
import FAQAccordion from './FAQAccordion.jsx';
import ContactForm from './ContactForm.jsx';
import StoreStats from './StoreStats.jsx';
import BlogHighlights from './BlogHighlights.jsx';
import CustomHTML from './CustomHTML.jsx';
import BrandLogos from './BrandLogos.jsx';
import ImageSlider from './ImageSlider.jsx';

/** @type {Record<string, Object>} */
export const widgetRegistry = {
    HeroBanner: {
        component: HeroBanner,
        icon: Image,
        label: 'Hero Banner',
        category: 'Hero & Promo',
        defaultProps: widgetDefaults.HeroBanner,
        propertySchema: [
            { key: 'imageUrl', label: 'Background Image URL', type: 'url' },
            { key: 'heading', label: 'Heading', type: 'text' },
            { key: 'subheading', label: 'Subheading', type: 'text' },
            { key: 'ctaText', label: 'Button Text', type: 'text' },
            { key: 'ctaLink', label: 'Button Link', type: 'url' },
            { key: 'textAlignment', label: 'Text Alignment', type: 'select', options: ['left', 'center', 'right'] },
            { key: 'overlayOpacity', label: 'Overlay Opacity', type: 'range', min: 0, max: 1, step: 0.1 },
        ],
    },

    AnnouncementBar: {
        component: AnnouncementBar,
        icon: Megaphone,
        label: 'Announcement Bar',
        category: 'Hero & Promo',
        defaultProps: widgetDefaults.AnnouncementBar,
        propertySchema: [
            { key: 'text', label: 'Announcement Text', type: 'text' },
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
            { key: 'textColor', label: 'Text Color', type: 'color' },
            { key: 'dismissible', label: 'Dismissible', type: 'toggle' },
        ],
    },

    ImageSlider: {
        component: ImageSlider,
        icon: Images,
        label: 'Image Slider',
        category: 'Hero & Promo',
        defaultProps: widgetDefaults.ImageSlider,
        propertySchema: [
            { key: 'autoPlay', label: 'Auto Play', type: 'toggle' },
            { key: 'interval', label: 'Interval (ms)', type: 'number', min: 1000, max: 10000, step: 500 },
        ],
    },

    CountdownTimer: {
        component: CountdownTimer,
        icon: Timer,
        label: 'Countdown Timer',
        category: 'Hero & Promo',
        defaultProps: widgetDefaults.CountdownTimer,
        propertySchema: [
            { key: 'heading', label: 'Heading', type: 'text' },
            { key: 'endDate', label: 'End Date/Time', type: 'text' },
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
            { key: 'textColor', label: 'Text Color', type: 'color' },
        ],
    },

    ProductGrid: {
        component: ProductGrid,
        icon: LayoutGrid,
        label: 'Product Grid',
        category: 'Products',
        defaultProps: widgetDefaults.ProductGrid,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
            { key: 'columns', label: 'Columns', type: 'select', options: [2, 3, 4] },
            { key: 'dataSource', label: 'Data Source', type: 'select', options: ['featured', 'bestsellers', 'new', 'all'] },
            { key: 'layoutStyle', label: 'Layout Style', type: 'select', options: ['grid', 'masonry'] },
            { key: 'maxItems', label: 'Max Items', type: 'number', min: 2, max: 20 },
        ],
    },

    FeatureCards: {
        component: FeatureCards,
        icon: Columns3,
        label: 'Feature Cards',
        category: 'Products',
        defaultProps: widgetDefaults.FeatureCards,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
        ],
    },

    TestimonialSlider: {
        component: TestimonialSlider,
        icon: MessageCircle,
        label: 'Testimonials',
        category: 'Trust & Social Proof',
        defaultProps: widgetDefaults.TestimonialSlider,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
        ],
    },

    TrustBadges: {
        component: TrustBadges,
        icon: ShieldCheck,
        label: 'Trust Badges',
        category: 'Trust & Social Proof',
        defaultProps: widgetDefaults.TrustBadges,
        propertySchema: [],
    },

    BrandLogos: {
        component: BrandLogos,
        icon: Award,
        label: 'Brand Logos',
        category: 'Trust & Social Proof',
        defaultProps: widgetDefaults.BrandLogos,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
        ],
    },

    StoreStats: {
        component: StoreStats,
        icon: BarChart3,
        label: 'Store Stats',
        category: 'Trust & Social Proof',
        defaultProps: widgetDefaults.StoreStats,
        propertySchema: [],
    },

    NewsletterSignup: {
        component: NewsletterSignup,
        icon: Mail,
        label: 'Newsletter Signup',
        category: 'Lead Generation',
        defaultProps: widgetDefaults.NewsletterSignup,
        propertySchema: [
            { key: 'heading', label: 'Heading', type: 'text' },
            { key: 'subheading', label: 'Subheading', type: 'text' },
            { key: 'placeholderText', label: 'Placeholder Text', type: 'text' },
            { key: 'buttonText', label: 'Button Text', type: 'text' },
            { key: 'buttonColor', label: 'Button Color', type: 'color' },
        ],
    },

    BlogHighlights: {
        component: BlogHighlights,
        icon: FileText,
        label: 'Blog Highlights',
        category: 'Lead Generation',
        defaultProps: widgetDefaults.BlogHighlights,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
            { key: 'maxPosts', label: 'Max Posts', type: 'number', min: 1, max: 6 },
        ],
    },

    ContactForm: {
        component: ContactForm,
        icon: MessageSquare,
        label: 'Contact Form',
        category: 'Lead Generation',
        defaultProps: widgetDefaults.ContactForm,
        propertySchema: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'subtitle', label: 'Subtitle', type: 'text' },
            { key: 'buttonText', label: 'Button Text', type: 'text' },
        ],
    },

    VideoPlayer: {
        component: VideoPlayer,
        icon: Play,
        label: 'Video Player',
        category: 'Utility',
        defaultProps: widgetDefaults.VideoPlayer,
        propertySchema: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'videoUrl', label: 'Video Embed URL', type: 'url' },
            { key: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['16:9', '4:3', '1:1'] },
        ],
    },

    FAQAccordion: {
        component: FAQAccordion,
        icon: HelpCircle,
        label: 'FAQ Accordion',
        category: 'Utility',
        defaultProps: widgetDefaults.FAQAccordion,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
        ],
    },

    CustomHTML: {
        component: CustomHTML,
        icon: Code,
        label: 'Custom HTML',
        category: 'Utility',
        defaultProps: widgetDefaults.CustomHTML,
        propertySchema: [
            { key: 'code', label: 'HTML Code', type: 'textarea' },
        ],
    },
};

/**
 * Get unique categories in display order.
 * @returns {string[]}
 */
export function getWidgetCategories() {
    const categories = [];
    Object.values(widgetRegistry).forEach((entry) => {
        if (!categories.includes(entry.category)) {
            categories.push(entry.category);
        }
    });
    return categories;
}

/**
 * Get all widget types in a specific category.
 * @param {string} category
 * @returns {Array<{type: string}>}
 */
export function getWidgetsByCategory(category) {
    return Object.entries(widgetRegistry)
        .filter(([, entry]) => entry.category === category)
        .map(([type, entry]) => ({ type, ...entry }));
}

export default widgetRegistry;
