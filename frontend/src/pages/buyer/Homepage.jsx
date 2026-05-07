import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Sparkles, TrendingUp, Zap,
    ShieldCheck, Truck, RotateCcw, Star, Store, Clock, Percent, Quote, MessageCircle, Search,
    ShoppingBag, Heart, Tag, Gift, Smartphone, Camera, Headphones, Laptop, Monitor, Watch,
    Shirt, Coffee, Box, ThumbsUp, Medal, Crown, Music, Video, Gamepad2, Mic,
    Sofa, Scissors, Glasses, Brush, Award, Bell, Bookmark, Compass, Flame, Leaf, Moon, Sun, Anchor, Umbrella
} from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import CategoryCard from '../../components/ui/CategoryCard';
import Skeleton from '../../components/ui/Skeleton';
import { useProduct } from '../../context/ProductContext';

import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/currency';
import { getTestimonials } from '../../data/testimonials';

export default function Homepage() {
    const { t } = useTranslation();
    const testimonials = getTestimonials(t);
    const {
        products: loadedProducts,
        categories: loadedCategories,
        sellers,
        heroBanners,
        isLoading: productsLoading
    } = useProduct();

    const [showAllCategories, setShowAllCategories] = useState(false);
    const categoriesLoading = productsLoading;
    const isLoading = productsLoading;

    const carouselRef = useRef(null);
    const featuredRef = useRef(null);
    const sellersRef = useRef(null);
    const reviewsRef = useRef(null);

    const heroFloatingIcons = [
        { Icon: Star, color: 'text-amber-500', size: 24, left: '10%', delay: '0s', duration: '45s' },
        { Icon: Clock, color: 'text-blue-500', size: 32, left: '25%', delay: '4s', duration: '50s' },
        { Icon: Percent, color: 'text-green-500', size: 28, left: '40%', delay: '12s', duration: '48s' },
        { Icon: ShieldCheck, color: 'text-purple-500', size: 20, left: '55%', delay: '8s', duration: '55s' },
        { Icon: Zap, color: 'text-yellow-500', size: 36, left: '70%', delay: '15s', duration: '42s' },
        { Icon: Truck, color: 'text-red-500', size: 26, left: '85%', delay: '21s', duration: '47s' },
        { Icon: ShoppingBag, color: 'text-pink-500', size: 30, left: '15%', delay: '7s', duration: '52s' },
        { Icon: Heart, color: 'text-rose-500', size: 22, left: '35%', delay: '18s', duration: '40s' },
        { Icon: Tag, color: 'text-emerald-500', size: 28, left: '60%', delay: '3s', duration: '60s' },
        { Icon: Gift, color: 'text-indigo-500', size: 34, left: '80%', delay: '26s', duration: '46s' },
        { Icon: Smartphone, color: 'text-cyan-500', size: 24, left: '5%', delay: '11s', duration: '58s' },
        { Icon: Camera, color: 'text-fuchsia-500', size: 28, left: '20%', delay: '34s', duration: '44s' },
        { Icon: Headphones, color: 'text-violet-500', size: 32, left: '45%', delay: '10s', duration: '65s' },
        { Icon: Laptop, color: 'text-orange-500', size: 36, left: '65%', delay: '22s', duration: '53s' },
        { Icon: Monitor, color: 'text-sky-500', size: 26, left: '90%', delay: '13s', duration: '62s' },
        { Icon: Watch, color: 'text-lime-500', size: 22, left: '30%', delay: '38s', duration: '41s' },
        { Icon: Shirt, color: 'text-indigo-400', size: 30, left: '50%', delay: '25s', duration: '56s' },
        { Icon: Coffee, color: 'text-amber-600', size: 24, left: '75%', delay: '17s', duration: '49s' },
        { Icon: Box, color: 'text-slate-500', size: 28, left: '12%', delay: '32s', duration: '51s' },
        { Icon: ThumbsUp, color: 'text-teal-500', size: 20, left: '88%', delay: '19s', duration: '57s' },
        { Icon: Medal, color: 'text-yellow-600', size: 34, left: '38%', delay: '41s', duration: '68s' },
        { Icon: Crown, color: 'text-amber-400', size: 38, left: '58%', delay: '5s', duration: '72s' },
        { Icon: Music, color: 'text-pink-400', size: 26, left: '82%', delay: '24s', duration: '45s' },
        { Icon: Video, color: 'text-blue-400', size: 32, left: '18%', delay: '43s', duration: '59s' },
        { Icon: Gamepad2, color: 'text-purple-600', size: 30, left: '48%', delay: '35s', duration: '61s' },
        { Icon: Mic, color: 'text-rose-400', size: 24, left: '68%', delay: '29s', duration: '43s' },
        { Icon: Sofa, color: 'text-teal-600', size: 32, left: '7%', delay: '16s', duration: '60s' },
        { Icon: Scissors, color: 'text-slate-400', size: 22, left: '28%', delay: '2s', duration: '54s' },
        { Icon: Glasses, color: 'text-sky-400', size: 26, left: '42%', delay: '20s', duration: '47s' },
        { Icon: Brush, color: 'text-fuchsia-400', size: 24, left: '52%', delay: '28s', duration: '64s' },
        { Icon: Award, color: 'text-orange-400', size: 34, left: '62%', delay: '40s', duration: '52s' },
        { Icon: Bell, color: 'text-yellow-400', size: 28, left: '78%', delay: '14s', duration: '48s' },
        { Icon: Bookmark, color: 'text-red-400', size: 24, left: '92%', delay: '30s', duration: '55s' },
        { Icon: Compass, color: 'text-blue-600', size: 30, left: '33%', delay: '36s', duration: '63s' },
        { Icon: Flame, color: 'text-orange-600', size: 28, left: '47%', delay: '9s', duration: '41s' },
        { Icon: Leaf, color: 'text-emerald-400', size: 26, left: '67%', delay: '45s', duration: '50s' },
        { Icon: Moon, color: 'text-indigo-300', size: 24, left: '87%', delay: '31s', duration: '58s' },
        { Icon: Sun, color: 'text-amber-300', size: 36, left: '16%', delay: '27s', duration: '49s' },
        { Icon: Anchor, color: 'text-slate-600', size: 28, left: '8%', delay: '39s', duration: '67s' },
        { Icon: Umbrella, color: 'text-teal-400', size: 32, left: '72%', delay: '23s', duration: '52s' },
        { Icon: ShoppingBag, color: 'text-pink-300', size: 20, left: '2%', delay: '2s', duration: '55s', desktopOnly: true },
        { Icon: Heart, color: 'text-rose-300', size: 30, left: '13%', delay: '15s', duration: '48s', desktopOnly: true },
        { Icon: Star, color: 'text-amber-300', size: 18, left: '26%', delay: '5s', duration: '60s', desktopOnly: true },
        { Icon: Zap, color: 'text-yellow-300', size: 28, left: '37%', delay: '20s', duration: '50s', desktopOnly: true },
        { Icon: Coffee, color: 'text-amber-500', size: 22, left: '49%', delay: '8s', duration: '65s', desktopOnly: true },
        { Icon: Music, color: 'text-pink-300', size: 32, left: '61%', delay: '22s', duration: '57s', desktopOnly: true },
        { Icon: Camera, color: 'text-fuchsia-300', size: 25, left: '74%', delay: '11s', duration: '62s', desktopOnly: true },
        { Icon: Box, color: 'text-slate-400', size: 35, left: '84%', delay: '25s', duration: '53s', desktopOnly: true },
        { Icon: Leaf, color: 'text-emerald-300', size: 16, left: '95%', delay: '3s', duration: '58s', desktopOnly: true },
        { Icon: Sun, color: 'text-amber-200', size: 28, left: '4%', delay: '18s', duration: '46s', desktopOnly: true },
        { Icon: Watch, color: 'text-lime-300', size: 24, left: '17%', delay: '7s', duration: '63s', desktopOnly: true },
        { Icon: Shirt, color: 'text-indigo-300', size: 29, left: '29%', delay: '26s', duration: '51s', desktopOnly: true },
        { Icon: Glasses, color: 'text-sky-300', size: 21, left: '41%', delay: '14s', duration: '59s', desktopOnly: true },
        { Icon: Compass, color: 'text-blue-400', size: 34, left: '53%', delay: '1s', duration: '66s', desktopOnly: true },
        { Icon: Flame, color: 'text-orange-400', size: 26, left: '64%', delay: '23s', duration: '49s', desktopOnly: true },
        { Icon: Umbrella, color: 'text-teal-300', size: 31, left: '77%', delay: '10s', duration: '56s', desktopOnly: true },
        { Icon: Gamepad2, color: 'text-purple-400', size: 23, left: '89%', delay: '28s', duration: '44s', desktopOnly: true },
        { Icon: Crown, color: 'text-yellow-500', size: 27, left: '97%', delay: '6s', duration: '61s', desktopOnly: true },
        { Icon: Monitor, color: 'text-sky-400', size: 33, left: '9%', delay: '21s', duration: '54s', desktopOnly: true },
        { Icon: Headphones, color: 'text-violet-400', size: 19, left: '21%', delay: '12s', duration: '67s', desktopOnly: true },
        { Icon: Smartphone, color: 'text-cyan-400', size: 30, left: '34%', delay: '27s', duration: '52s', desktopOnly: true },
        { Icon: Sofa, color: 'text-teal-500', size: 25, left: '44%', delay: '9s', duration: '60s', desktopOnly: true },
        { Icon: Brush, color: 'text-fuchsia-500', size: 28, left: '56%', delay: '19s', duration: '47s', desktopOnly: true },
        { Icon: Scissors, color: 'text-slate-500', size: 22, left: '69%', delay: '4s', duration: '64s', desktopOnly: true },
        { Icon: Bell, color: 'text-yellow-500', size: 35, left: '81%', delay: '24s', duration: '50s', desktopOnly: true },
        { Icon: Anchor, color: 'text-slate-500', size: 24, left: '91%', delay: '13s', duration: '55s', desktopOnly: true },
        { Icon: Moon, color: 'text-indigo-400', size: 29, left: '6%', delay: '29s', duration: '45s', desktopOnly: true },
        { Icon: Zap, color: 'text-amber-400', size: 18, left: '19%', delay: '2s', duration: '68s', desktopOnly: true },
        { Icon: Star, color: 'text-rose-400', size: 32, left: '31%', delay: '16s', duration: '53s', desktopOnly: true },
        { Icon: ShieldCheck, color: 'text-purple-400', size: 26, left: '46%', delay: '10s', duration: '62s', desktopOnly: true },
    ];

    const shiftIconLeft = (left, index) => {
        const value = parseFloat(left);
        if (Number.isNaN(value)) return left;
        const offset = index % 2 === 0 ? 4 : -4;
        return `${Math.min(98, Math.max(2, value + offset))}%`;
    };

    const twoRowProductScrollerClasses = 'grid grid-rows-2 grid-flow-col auto-cols-[220px] sm:auto-cols-[240px] lg:auto-cols-[260px] gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory';

    const scrollContainer = (ref, direction) => {
        if (!ref.current) return;
        const amount = 320;
        ref.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="animate-fade-in bg-white">
            {/* ═══════════════════════════════════════════════════════
          HERO BANNER — Redesigned Premium Theme
          ═══════════════════════════════════════════════════════ */}
            <section className="relative w-full overflow-hidden bg-slate-50 border-b border-border-soft">
                {/* Animated soft bg elements & Flowing Icons */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
                    </div>

                    {/* Floating Icons */}
                    <div className="absolute inset-0 opacity-20 md:opacity-30">
                        {heroFloatingIcons.map((item, i) => (
                            <div
                                key={`primary-${i}`}
                                className={`absolute bottom-[-100px] animate-float-up ${item.desktopOnly ? 'hidden md:block' : ''}`}
                                style={{
                                    left: item.left,
                                    animationDelay: `-${parseFloat(item.delay)}s`,
                                    animationDuration: item.duration,
                                }}
                            >
                                <item.Icon className={`${item.color} opacity-70`} size={item.size} />
                            </div>
                        ))}

                        {/* Extra desktop layer to keep wide screens visually dense */}
                        {heroFloatingIcons
                            .filter((item, i) => !item.desktopOnly && i % 2 === 0)
                            .map((item, i) => (
                                <div
                                    key={`desktop-extra-${i}`}
                                    className="hidden lg:block absolute bottom-[-180px] animate-float-up"
                                    style={{
                                        left: shiftIconLeft(item.left, i),
                                        animationDelay: `-${parseFloat(item.delay) + 6 + (i % 4)}s`,
                                        animationDuration: `${Math.max(34, parseFloat(item.duration) - 7)}s`,
                                    }}
                                >
                                    <item.Icon className={`${item.color} opacity-55`} size={Math.max(16, item.size - 4)} />
                                </div>
                            ))}
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-32">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-6 sm:mb-8">
                            <Sparkles size={14} className="text-brand-primary" />
                            <span className="text-brand-primary text-[10px] sm:text-xs font-semibold tracking-wide uppercase">{t('home.hero.badge', 'Toroongo Marketplace')}</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 sm:mb-6 leading-[1.2] sm:leading-[1.1] tracking-tight">
                            {t('home.heroTitle', 'Discover amazing products')}
                        </h1>

                        <p className="text-sm sm:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
                            {t('home.heroSubtitle', 'Shop from thousands of curated sellers. Quality products, secure payments, and fast delivery — all in one place.')}
                        </p>

                        <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.search.value; if(val) window.location.href = `/products?search=${encodeURIComponent(val)}`; }} 
                              className="flex items-center max-w-2xl mx-auto mb-10 bg-white p-1.5 sm:p-2 rounded-full shadow-2xl shadow-slate-200/40 border border-slate-100 transition-all focus-within:ring-4 focus-within:ring-brand-primary/10">
                            <input
                                type="text"
                                name="search"
                                placeholder={t('home.hero.searchPlaceholder', 'What are you looking for today?')}
                                className="flex-1 pl-6 sm:pl-8 pr-4 py-3 sm:py-4 text-slate-700 bg-transparent outline-none w-full text-base placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                className="h-10 w-10 sm:h-14 sm:w-14 bg-brand-primary text-white 
                                       rounded-full hover:bg-brand-secondary transition-all duration-300 shadow-lg shadow-brand-primary/20 flex items-center justify-center flex-shrink-0"
                                aria-label={t('home.hero.searchBtn', 'Search')}
                            >
                                <Search size={20} />
                            </button>
                        </form>

                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                            <Link
                                to="/shops"
                                className="hidden md:inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-white text-slate-900 font-bold
                                   rounded-full hover:bg-slate-50 transition-all duration-300 border border-slate-200
                                   shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                {t('home.hero.storesBtn', 'Browse Stores')}
                            </Link>
                            <Link
                                to="/products"
                                className="hidden md:inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-transparent text-slate-500 font-semibold
                                   rounded-full hover:text-brand-primary transition-all duration-300"
                            >
                                {t('home.hero.productsBtn', 'Browse Products')} <ArrowRight size={16} />
                            </Link>
                        </div>
                        
                        {/* Trust stats below buttons for extra detail */}
                        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 bg-white/60 backdrop-blur-md rounded-3xl py-6 px-4 border border-white max-w-2xl mx-auto hidden sm:flex">
                             <div className="flex flex-col items-center">
                                  <span className="text-2xl font-extrabold text-slate-900">{t('home.stats.productsCount', '10K+')}</span>
                                  <span className="text-sm text-slate-500 font-medium">{t('home.stats.products', 'Products')}</span>
                             </div>
                             <div className="w-px h-8 bg-slate-200"></div>
                             <div className="flex flex-col items-center">
                                  <span className="text-2xl font-extrabold text-slate-900">{t('home.stats.sellersCount', '500+')}</span>
                                  <span className="text-sm text-slate-500 font-medium">{t('home.stats.sellers', 'Sellers')}</span>
                             </div>
                             <div className="w-px h-8 bg-slate-200"></div>
                             <div className="flex flex-col items-center">
                                  <span className="text-2xl font-extrabold text-slate-900">{t('home.stats.buyersCount', '50K+')}</span>
                                  <span className="text-sm text-slate-500 font-medium">{t('home.stats.buyers', 'Happy Buyers')}</span>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
          TRUST BADGES BAR
          ═══════════════════════════════════════════════════════ */}
            <section className="bg-white border-b border-border-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { icon: Truck, text: t('home.trust.shipping', 'Seller Shipping'), sub: t('home.trust.shippingSub', 'Price set by sellers') },
                            { icon: ShieldCheck, text: t('home.trust.secure', 'Secure Checkout'), sub: t('home.trust.secureSub', '256-bit SSL encryption') },
                            { icon: RotateCcw, text: t('home.trust.returns', '30-Day Returns'), sub: t('home.trust.returnsSub', 'No-hassle refunds') },
                            { icon: Clock, text: t('home.trust.support', '24/7 Support'), sub: t('home.trust.supportSub', 'We are always here') },
                        ].map((badge, idx) => (
                            <div key={idx} className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 justify-center lg:justify-start text-center lg:text-left">
                                <div className="p-2.5 bg-slate-50 rounded-xl inline-flex items-center justify-center">
                                    <badge.icon size={20} className="text-brand-primary flex-shrink-0" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{badge.text}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">{badge.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ═══════════════════════════════════════════════════════
            FEATURED CATEGORIES
            ═══════════════════════════════════════════════════════ */}
                <section className="py-12 lg:py-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                            {t('home.categories.title', 'Shop by Category')}
                        </h2>
                        <p className="text-text-muted text-sm mt-1">{t('home.categories.subtitle', 'Browse our most popular categories')}</p>
                    </div>

                    {categoriesLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center p-6 bg-surface-bg rounded-2xl border border-border-soft">
                                    <Skeleton width="48px" height="48px" rounded="rounded-xl" className="mb-3" />
                                    <Skeleton width="60%" height="0.75rem" rounded="rounded" className="mb-1.5" />
                                    <Skeleton width="40%" height="0.6rem" rounded="rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Mobile: Limit to first 4 categories, explicitly expandable */}
                            <div className="grid grid-cols-2 sm:hidden gap-4">
                                {(showAllCategories ? loadedCategories : loadedCategories.slice(0, 4)).map((cat) => (
                                    <CategoryCard key={cat.id} category={cat} />
                                ))}
                            </div>
                            {/* Desktop/Tablet: Show all */}
                            <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {loadedCategories.map((cat) => (
                                    <CategoryCard key={cat.id} category={cat} />
                                ))}
                            </div>

                            {/* Expand/Collapse Button for Mobile */}
                            {loadedCategories.length > 4 && (
                                <div className="flex justify-center mt-6 sm:hidden">
                                    <button
                                        onClick={() => setShowAllCategories(!showAllCategories)}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                                    >
                                        {showAllCategories ? t('common.showLess', 'Show Less') : t('common.viewAll', 'View All')}
                                        {showAllCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* ═══════════════════════════════════════════════════════
            TRENDING PRODUCTS — Horizontal carousel
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                            {t('home.trending.title', 'Trending Now')}
                        </h2>
                        <p className="text-text-muted text-sm mt-1">{t('home.trending.subtitle', "What everyone's buying this week")}</p>
                    </div>

                    {isLoading ? (
                        <div className={twoRowProductScrollerClasses}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-[220px] sm:w-[240px] lg:w-[260px] snap-start">
                                    <ProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            ref={carouselRef}
                            className={twoRowProductScrollerClasses}
                        >
                            {loadedProducts.map((product) => (
                                <div key={product.id} className="w-[220px] sm:w-[240px] lg:w-[260px] snap-start">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="hidden sm:flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={() => scrollContainer(carouselRef, 'left')}
                            className="p-3 rounded-full border border-border-soft text-text-muted hover:text-text-primary hover:border-gray-300 hover:shadow-sm transition-all"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scrollContainer(carouselRef, 'right')}
                            className="p-3 rounded-full border border-border-soft text-text-muted hover:text-text-primary hover:border-gray-300 hover:shadow-sm transition-all"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
            TOP SELLERS — Horizontal Carousel
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                            {t('home.sellers.title', 'Top Sellers')}
                        </h2>
                        <p className="text-text-muted text-sm mt-1">{t('home.sellers.subtitle', 'Explore stores from our best-rated sellers')}</p>
                    </div>

                    <div
                        ref={sellersRef}
                        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                    >
                        {sellers.map((seller) => (
                            <Link
                                key={seller.id}
                                to={`/${seller.slug}`}
                                className="min-w-[280px] max-w-[280px] snap-start group relative bg-white rounded-2xl border border-border-soft overflow-hidden
                                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-primary/20"
                            >
                                {/* Banner */}
                                <div className="h-24 overflow-hidden">
                                    <img
                                        src={seller.banner}
                                        alt={seller.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                {/* Logo + Info */}
                                <div className="relative px-4 pb-4">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border-[3px] border-white shadow-lg bg-white
                                                    -mt-7 relative z-10">
                                        <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-semibold text-sm text-text-primary mt-2 group-hover:text-brand-primary transition-colors">
                                        {seller.name}
                                    </h3>
                                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{seller.description}</p>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-soft/50">
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="fill-amber-400 text-amber-400" />
                                            <span className="text-xs font-semibold text-text-primary">{seller.rating}</span>
                                        </div>
                                        <span className="text-[11px] text-text-muted">{(seller.totalProducts || seller.total_products)} {t('common.products', 'products')}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden sm:flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={() => scrollContainer(sellersRef, 'left')}
                            className="p-3 rounded-full border border-border-soft text-text-muted hover:text-text-primary hover:border-gray-300 hover:shadow-sm transition-all"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scrollContainer(sellersRef, 'right')}
                            className="p-3 rounded-full border border-border-soft text-text-muted hover:text-text-primary hover:border-gray-300 hover:shadow-sm transition-all"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
            PROMO BANNER — Start selling
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-12">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary p-8 sm:p-12">
                        <div className="relative z-10 max-w-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap size={18} className="text-white" />
                                <span className="text-white/90 text-sm font-medium">{t('home.promo.badge', 'For Sellers')}</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                {t('home.promo.title', 'Start your store today.')}
                            </h3>
                            <p className="text-white/80 mb-6">
                                {t('home.promo.subtitle', 'Join thousands of sellers on Toroongo. Build your brand, reach millions of buyers, and grow your business — all from one platform.')}
                            </p>
                            <Link
                                to="/sell"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-secondary font-semibold
                           rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                            >
                                {t('home.promo.cta', 'Get Started')} <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full" />
                        <div className="absolute -right-6 -bottom-16 w-48 h-48 bg-white/5 rounded-full" />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
            FEATURED PRODUCTS GRID
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                            {t('home.featured.title', 'Featured Products')}
                        </h2>
                        <p className="text-text-muted text-sm mt-1">{t('home.featured.subtitle', 'Hand-picked by our editors')}</p>
                    </div>

                    {isLoading ? (
                        <div className={twoRowProductScrollerClasses}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-[220px] sm:w-[240px] lg:w-[260px] snap-start">
                                    <ProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            ref={featuredRef}
                            className={twoRowProductScrollerClasses}
                        >
                            {loadedProducts.slice(0, 12).map((product) => (
                                <div key={product.id} className="w-[220px] sm:w-[240px] lg:w-[260px] snap-start">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="hidden sm:flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={() => scrollContainer(featuredRef, 'left')}
                            className="p-3 rounded-full border border-border-soft text-text-muted hover:text-text-primary hover:border-gray-300 hover:shadow-sm transition-all"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scrollContainer(featuredRef, 'right')}
                            className="p-3 rounded-full border border-border-soft text-text-muted hover:text-text-primary hover:border-gray-300 hover:shadow-sm transition-all"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
            CUSTOMER TESTIMONIALS — Horizontal Carousel
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                            {t('home.reviews.title', 'What Our Buyers Say')}
                        </h2>
                        <p className="text-text-muted text-sm mt-1">{t('home.reviews.subtitle', 'Real reviews from real customers')}</p>
                    </div>

                    <div
                        ref={reviewsRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                    >
                        {testimonials.map((review, idx) => (
                            <div
                                key={idx}
                                className="min-w-[320px] md:min-w-[380px] max-w-[380px] snap-start bg-white rounded-2xl border border-border-soft p-6 transition-all duration-300
                                           hover:shadow-lg hover:border-brand-primary/20 hover:-translate-y-0.5"
                            >
                                {/* Quote icon */}
                                <Quote size={24} className="text-brand-primary/20 mb-3" />

                                {/* Review text */}
                                <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-4 min-h-[5rem]">
                                    "{review.text}"
                                </p>

                                {/* Product purchased */}
                                <p className="text-xs text-brand-primary font-medium mb-4 truncate">
                                    {t('home.reviews.purchased', 'Purchased:')} {review.purchased}
                                </p>

                                {/* Rating */}
                                <div className="flex items-center gap-0.5 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={13}
                                            className={i < review.rating
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-200'
                                            }
                                        />
                                    ))}
                                </div>

                                {/* User info */}
                                <div className="flex items-center gap-3 pt-4 border-t border-border-soft/50">
                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-text-primary">{review.name}</p>
                                        <p className="text-[11px] text-text-muted">{t('home.reviews.verified', 'Verified Buyer')}</p>
                                    </div>
                                    <span className="text-[11px] text-text-muted">{review.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden sm:flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={() => scrollContainer(reviewsRef, 'left')}
                            className="p-3 rounded-full border border-border-soft text-text-muted hover:text-text-primary hover:border-gray-300 hover:shadow-sm transition-all"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scrollContainer(reviewsRef, 'right')}
                            className="p-3 rounded-full border border-border-soft text-text-muted hover:text-text-primary hover:border-gray-300 hover:shadow-sm transition-all"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
            NEWSLETTER — Final engagement section
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-16">
                    <div className="bg-surface-bg rounded-2xl border border-border-soft p-8 sm:p-12 text-center">
                        <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Sparkles size={24} className="text-brand-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                            {t('home.newsletter.title', 'Stay in the loop')}
                        </h3>
                        <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
                            {t('home.newsletter.subtitle', 'Subscribe to get exclusive deals, new arrivals, and trending product updates — straight to your inbox.')}
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder={t('home.newsletter.placeholder', 'Enter your email')}
                                className="flex-1 px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
                                           focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-brand-primary text-white font-semibold text-sm rounded-xl
                                           hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20"
                            >
                                {t('home.newsletter.button', 'Subscribe')}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
