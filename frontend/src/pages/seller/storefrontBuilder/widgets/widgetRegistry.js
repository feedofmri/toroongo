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

const ICON_OPTIONS = ['Shield', 'RotateCcw', 'Truck', 'Leaf', 'Award', 'Clock', 'CreditCard', 'Headphones', 'Star', 'Heart', 'Zap', 'Globe'];

/** @type {Record<string, Object>} */
export const widgetRegistry = {
    HeroBanner: {
        component: HeroBanner,
        icon: Image,
        label: 'Hero Banner',
        category: 'Hero & Promo',
        defaultProps: widgetDefaults.HeroBanner,
        propertySchema: [
            { key: 'imageUrl', label: 'Background Image', type: 'image-upload' },
            { key: 'badge', label: 'Badge Text (above heading)', type: 'text' },
            { key: 'heading', label: 'Heading', type: 'text' },
            { key: 'subheading', label: 'Subheading', type: 'text' },
            { key: 'minHeight', label: 'Height', type: 'select', options: ['small', 'medium', 'large', 'fullscreen'] },
            { key: 'textAlignment', label: 'Text Alignment', type: 'select', options: ['left', 'center', 'right'] },
            { key: 'overlayOpacity', label: 'Overlay Opacity', type: 'range', min: 0, max: 1, step: 0.05 },
            { key: 'ctaText', label: 'Primary Button Text', type: 'text' },
            { key: 'ctaLink', label: 'Primary Button Link', type: 'url' },
            { key: 'ctaSecondaryText', label: 'Secondary Button Text', type: 'text' },
            { key: 'ctaSecondaryLink', label: 'Secondary Button Link', type: 'url' },
        ],
    },

    AnnouncementBar: {
        component: AnnouncementBar,
        icon: Megaphone,
        label: 'Announcement Bar',
        category: 'Hero & Promo',
        defaultProps: widgetDefaults.AnnouncementBar,
        propertySchema: [
            { key: 'emoji', label: 'Emoji / Icon', type: 'text' },
            { key: 'text', label: 'Announcement Text', type: 'text' },
            { key: 'linkText', label: 'Link Text', type: 'text' },
            { key: 'linkUrl', label: 'Link URL', type: 'url' },
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
            { key: 'textColor', label: 'Text Color', type: 'color' },
            { key: 'scrolling', label: 'Scrolling Marquee', type: 'toggle' },
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
            {
                key: 'slides', label: 'Slides', type: 'list-editor', previewKey: 'heading',
                itemSchema: [
                    { key: 'imageUrl', label: 'Slide Image', type: 'image-upload' },
                    { key: 'heading', label: 'Heading', type: 'text' },
                    { key: 'subheading', label: 'Subheading', type: 'text' },
                    { key: 'ctaText', label: 'Button Text', type: 'text' },
                    { key: 'ctaLink', label: 'Button Link', type: 'url' },
                ],
            },
            { key: 'height', label: 'Height', type: 'select', options: ['small', 'medium', 'large'] },
            { key: 'transition', label: 'Transition Effect', type: 'select', options: ['slide', 'fade'] },
            { key: 'autoPlay', label: 'Auto Play', type: 'toggle' },
            { key: 'interval', label: 'Interval (ms)', type: 'number', min: 1000, max: 10000, step: 500 },
            { key: 'showArrows', label: 'Show Arrows', type: 'toggle' },
            { key: 'showDots', label: 'Show Dots', type: 'toggle' },
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
            { key: 'subtext', label: 'Subtext', type: 'text' },
            { key: 'endDate', label: 'End Date & Time', type: 'datetime' },
            { key: 'expiredMessage', label: 'Expired Message', type: 'text' },
            { key: 'targetUrl', label: 'CTA Link URL', type: 'url' },
            { key: 'showSeconds', label: 'Show Seconds', type: 'toggle' },
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
            { key: 'showViewAll', label: 'Show View All Button', type: 'toggle' },
            { key: 'viewAllText', label: 'View All Text', type: 'text' },
            { key: 'viewAllLink', label: 'View All Link', type: 'url' },
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
            { key: 'columns', label: 'Columns', type: 'select', options: [2, 3, 4] },
            { key: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['4:3', '1:1', '16:9', '3:4'] },
            { key: 'cardStyle', label: 'Card Style', type: 'select', options: ['overlay', 'clean'] },
            {
                key: 'cards', label: 'Cards', type: 'list-editor', previewKey: 'label',
                itemSchema: [
                    { key: 'imageUrl', label: 'Card Image', type: 'image-upload' },
                    { key: 'label', label: 'Title', type: 'text' },
                    { key: 'sublabel', label: 'Subtitle', type: 'text' },
                    { key: 'link', label: 'Link URL', type: 'url' },
                ],
            },
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
            { key: 'layout', label: 'Layout', type: 'select', options: ['carousel', 'grid'] },
            { key: 'showAvatars', label: 'Show Avatars', type: 'toggle' },
            { key: 'backgroundColor', label: 'Section Background Color', type: 'color' },
            {
                key: 'testimonials', label: 'Testimonials', type: 'list-editor', previewKey: 'author',
                itemSchema: [
                    { key: 'avatarUrl', label: 'Avatar Photo', type: 'image-upload' },
                    { key: 'text', label: 'Review Text', type: 'textarea' },
                    { key: 'author', label: 'Name', type: 'text' },
                    { key: 'role', label: 'Role / Company', type: 'text' },
                    { key: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5 },
                ],
            },
        ],
    },

    TrustBadges: {
        component: TrustBadges,
        icon: ShieldCheck,
        label: 'Trust Badges',
        category: 'Trust & Social Proof',
        defaultProps: widgetDefaults.TrustBadges,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
            { key: 'layout', label: 'Layout', type: 'select', options: ['horizontal', 'vertical'] },
            { key: 'showDividers', label: 'Show Dividers', type: 'toggle' },
            {
                key: 'badges', label: 'Badges', type: 'list-editor', previewKey: 'label',
                itemSchema: [
                    { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
                    { key: 'label', label: 'Label', type: 'text' },
                    { key: 'description', label: 'Description', type: 'text' },
                ],
            },
        ],
    },

    BrandLogos: {
        component: BrandLogos,
        icon: Award,
        label: 'Brand Logos',
        category: 'Trust & Social Proof',
        defaultProps: widgetDefaults.BrandLogos,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
            { key: 'grayscale', label: 'Grayscale (hover to color)', type: 'toggle' },
            { key: 'animate', label: 'Scrolling Animation', type: 'toggle' },
            { key: 'logoHeight', label: 'Logo Size', type: 'select', options: ['small', 'medium', 'large'] },
            {
                key: 'logos', label: 'Logos', type: 'list-editor', previewKey: 'name',
                itemSchema: [
                    { key: 'imageUrl', label: 'Logo Image', type: 'image-upload' },
                    { key: 'name', label: 'Brand Name', type: 'text' },
                    { key: 'link', label: 'Website URL', type: 'url' },
                ],
            },
        ],
    },

    StoreStats: {
        component: StoreStats,
        icon: BarChart3,
        label: 'Store Stats',
        category: 'Trust & Social Proof',
        defaultProps: widgetDefaults.StoreStats,
        propertySchema: [
            { key: 'title', label: 'Section Title', type: 'text' },
            { key: 'style', label: 'Style', type: 'select', options: ['cards', 'minimal', 'gradient'] },
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
            {
                key: 'stats', label: 'Statistics', type: 'list-editor', previewKey: 'label',
                itemSchema: [
                    { key: 'prefix', label: 'Prefix (e.g. $)', type: 'text', default: '' },
                    { key: 'value', label: 'Value', type: 'text' },
                    { key: 'suffix', label: 'Suffix (e.g. +)', type: 'text', default: '' },
                    { key: 'label', label: 'Label', type: 'text' },
                ],
            },
        ],
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
            { key: 'disclaimer', label: 'Disclaimer Text', type: 'text' },
            { key: 'successMessage', label: 'Success Message', type: 'text' },
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
            { key: 'backgroundImage', label: 'Background Image', type: 'image-upload' },
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
            { key: 'layout', label: 'Layout', type: 'select', options: ['grid', 'list', 'featured'] },
            { key: 'showAuthor', label: 'Show Author', type: 'toggle' },
            { key: 'showCategory', label: 'Show Category', type: 'toggle' },
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
            { key: 'showPhone', label: 'Include Phone Field', type: 'toggle' },
            { key: 'showSubject', label: 'Include Subject Field', type: 'toggle' },
            { key: 'successMessage', label: 'Success Message', type: 'text' },
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
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
            { key: 'uploadedVideoUrl', label: 'Upload Video File', type: 'image-upload', acceptVideo: true },
            { key: 'videoUrl', label: 'Or Embed URL (YouTube / Vimeo)', type: 'url' },
            { key: 'posterUrl', label: 'Poster / Thumbnail Image', type: 'image-upload' },
            { key: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['16:9', '4:3', '1:1'] },
            { key: 'autoplay', label: 'Autoplay (muted loop)', type: 'toggle' },
            { key: 'caption', label: 'Caption', type: 'text' },
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
            { key: 'allowMultipleOpen', label: 'Allow Multiple Open', type: 'toggle' },
            { key: 'style', label: 'Style', type: 'select', options: ['bordered', 'minimal', 'filled'] },
            {
                key: 'items', label: 'Questions', type: 'list-editor', previewKey: 'question',
                itemSchema: [
                    { key: 'question', label: 'Question', type: 'text' },
                    { key: 'answer', label: 'Answer', type: 'textarea' },
                ],
            },
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
