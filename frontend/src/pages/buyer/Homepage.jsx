import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Zap,
    ShieldCheck, Truck, RotateCcw, Star, Store, Clock, Percent, Quote, MessageCircle
} from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import CategoryCard from '../../components/ui/CategoryCard';
import Skeleton from '../../components/ui/Skeleton';
import { useDelayedLoad } from '../../hooks/useDelayedLoad';
import { categories, sellers, testimonials } from '../../data/mockData';
import { useProduct } from '../../context/ProductContext';

export default function Homepage() {
    const { products: loadedProducts, isLoading } = useProduct();
    const { data: loadedCategories, isLoading: categoriesLoading } = useDelayedLoad(categories, 600);
    const carouselRef = useRef(null);
    const featuredRef = useRef(null);
    const sellersRef = useRef(null);
    const reviewsRef = useRef(null);

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
          HERO BANNER — Modern Premium White Theme
          ═══════════════════════════════════════════════════════ */}
            <section className="relative w-full overflow-hidden bg-slate-50 border-b border-border-soft">
                {/* Animated soft bg elements */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left — content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-6">
                                <Sparkles size={14} className="text-brand-primary" />
                                <span className="text-brand-primary text-xs font-semibold tracking-wide uppercase">Toroongo Marketplace</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                                Discover
                                <span className="text-brand-primary"> amazing </span>
                                products from top sellers
                            </h1>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                                Shop from thousands of curated sellers. Quality products, secure payments, and fast delivery — all in one place.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-10">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-bold
                                       rounded-2xl hover:bg-brand-secondary transition-all duration-300 shadow-xl shadow-brand-primary/20
                                       hover:shadow-brand-secondary/20 hover:-translate-y-0.5"
                                >
                                    Explore Products <ArrowRight size={18} />
                                </Link>
                                <Link
                                    to="/sell"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold
                                       rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-slate-200
                                       hover:border-brand-primary/30"
                                >
                                    Start Selling
                                </Link>
                            </div>

                            {/* Trust stats */}
                            <div className="flex flex-wrap gap-10">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-extrabold text-slate-900">10K+</span>
                                    <span className="text-sm text-slate-500 font-medium">Products</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-extrabold text-slate-900">500+</span>
                                    <span className="text-sm text-slate-500 font-medium">Sellers</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-extrabold text-slate-900">50K+</span>
                                    <span className="text-sm text-slate-500 font-medium">Happy Buyers</span>
                                </div>
                            </div>
                        </div>

                        {/* Right — Premium visual elements */}
                        <div className="hidden lg:flex flex-col gap-6">
                            {/* Featured review card */}
                            <div className="bg-white/80 backdrop-blur-xl border border-white p-7 rounded-[2rem] shadow-2xl shadow-slate-200/50">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 text-base leading-relaxed mb-6 font-medium italic">
                                    "Best marketplace I've used. Found amazing products from verified sellers, and everything arrived exactly as described. The customer service is outstanding!"
                                </p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80"
                                        alt="Sarah M."
                                        className="w-12 h-12 rounded-full object-cover ring-4 ring-brand-primary/10"
                                    />
                                    <div>
                                        <p className="text-slate-900 font-bold text-base">Sarah Mitchell</p>
                                        <p className="text-slate-500 text-xs font-semibold">Verified Buyer — purchased 12 items</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats row with glassmorphism */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/70 backdrop-blur-lg border border-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40">
                                    <div className="flex -space-x-2 mb-4">
                                        {[
                                            'photo-1507003211169-0a1dd7228f2d',
                                            'photo-1438761681033-6461ffad8d80',
                                            'photo-1472099645785-5658abf4ff4e',
                                        ].map((photo, i) => (
                                            <img
                                                key={i}
                                                src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&q=80&w=50&h=50`}
                                                alt=""
                                                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                                            />
                                        ))}
                                        <div className="w-9 h-9 rounded-full border-2 border-white bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold">
                                            +50K
                                        </div>
                                    </div>
                                    <p className="text-slate-900 font-bold text-sm">Trusted by 50K+</p>
                                    <p className="text-slate-500 text-xs mt-0.5">Satisfied buyers</p>
                                </div>

                                <div className="bg-white/70 backdrop-blur-lg border border-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                                        <span className="text-green-600 text-xs font-bold uppercase tracking-wider">Live Activity</span>
                                    </div>
                                    <p className="text-slate-900 font-bold text-lg leading-tight">2.3K Orders</p>
                                    <p className="text-slate-500 text-xs mt-0.5">Placed in 24h</p>
                                </div>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Truck, text: 'Free Shipping', sub: 'On orders over $50' },
                            { icon: ShieldCheck, text: 'Secure Checkout', sub: '256-bit SSL encryption' },
                            { icon: RotateCcw, text: '30-Day Returns', sub: 'No-hassle refunds' },
                            { icon: Clock, text: '24/7 Support', sub: 'We are always here' },
                        ].map((badge, idx) => (
                            <div key={idx} className="flex items-center gap-4 justify-center md:justify-start">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <badge.icon size={20} className="text-brand-primary flex-shrink-0" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{badge.text}</p>
                                    <p className="text-xs text-slate-500 font-medium">{badge.sub}</p>
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
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                                Shop by Category
                            </h2>
                            <p className="text-text-muted text-sm mt-1">Browse our most popular categories</p>
                        </div>
                        <Link
                            to="/products"
                            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                        >
                            View All <ArrowRight size={14} />
                        </Link>
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
                            {/* Mobile: Limit to first 4 categories */}
                            <div className="grid grid-cols-2 sm:hidden gap-4">
                                {loadedCategories.slice(0, 4).map((cat) => (
                                    <CategoryCard key={cat.id} category={cat} />
                                ))}
                            </div>
                            {/* Desktop/Tablet: Show all */}
                            <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {loadedCategories.map((cat) => (
                                    <CategoryCard key={cat.id} category={cat} />
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* ═══════════════════════════════════════════════════════
            TRENDING PRODUCTS — Horizontal carousel
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <TrendingUp size={20} className="text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                                    Trending Now
                                </h2>
                                <p className="text-text-muted text-sm mt-0.5">What everyone's buying this week</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scrollContainer(carouselRef, 'left')}
                                className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                           hover:border-gray-300 transition-colors"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scrollContainer(carouselRef, 'right')}
                                className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                           hover:border-gray-300 transition-colors"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex gap-5 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="min-w-[260px] max-w-[260px]">
                                    <ProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            ref={carouselRef}
                            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                        >
                            {loadedProducts.map((product) => (
                                <div key={product.id} className="min-w-[260px] max-w-[260px] snap-start">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ═══════════════════════════════════════════════════════
            TOP SELLERS — Horizontal Carousel
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <Store size={20} className="text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                                    Top Sellers
                                </h2>
                                <p className="text-text-muted text-sm mt-0.5">Explore stores from our best-rated sellers</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scrollContainer(sellersRef, 'left')}
                                className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                           hover:border-gray-300 transition-colors"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scrollContainer(sellersRef, 'right')}
                                className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                           hover:border-gray-300 transition-colors"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
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
                                        <span className="text-[11px] text-text-muted">{seller.totalProducts} products</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
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
                                <span className="text-white/90 text-sm font-medium">For Sellers</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                Start your store today.
                            </h3>
                            <p className="text-white/80 mb-6">
                                Join thousands of sellers on Toroongo. Build your brand, reach millions of buyers, and grow your business — all from one platform.
                            </p>
                            <Link
                                to="/sell"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-secondary font-semibold
                           rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                            >
                                Get Started <ArrowRight size={16} />
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
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <Sparkles size={20} className="text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                                    Featured Products
                                </h2>
                                <p className="text-text-muted text-sm mt-0.5">Hand-picked by our editors</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2">
                                <button
                                    onClick={() => scrollContainer(featuredRef, 'left')}
                                    className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                                               hover:border-gray-300 transition-colors"
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => scrollContainer(featuredRef, 'right')}
                                    className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                                               hover:border-gray-300 transition-colors"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                            >
                                See All <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex gap-5 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="min-w-[260px] max-w-[260px]">
                                    <ProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            ref={featuredRef}
                            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                        >
                            {loadedProducts.slice(0, 12).map((product) => (
                                <div key={product.id} className="min-w-[260px] max-w-[260px] snap-start">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ═══════════════════════════════════════════════════════
            CUSTOMER TESTIMONIALS — Horizontal Carousel
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-12 pb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <MessageCircle size={20} className="text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                                    What Our Buyers Say
                                </h2>
                                <p className="text-text-muted text-sm mt-0.5">Real reviews from real customers</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scrollContainer(reviewsRef, 'left')}
                                className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                           hover:border-gray-300 transition-colors"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scrollContainer(reviewsRef, 'right')}
                                className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                           hover:border-gray-300 transition-colors"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
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
                                    Purchased: {review.purchased}
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
                                        <p className="text-[11px] text-text-muted">{review.role}</p>
                                    </div>
                                    <span className="text-[11px] text-text-muted">{review.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
            NEWSLETTER — Final engagement section
            ═══════════════════════════════════════════════════════ */}
                <section className="py-8 lg:py-16 mb-8">
                    <div className="bg-surface-bg rounded-2xl border border-border-soft p-8 sm:p-12 text-center">
                        <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Sparkles size={24} className="text-brand-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                            Stay in the loop
                        </h3>
                        <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
                            Subscribe to get exclusive deals, new arrivals, and trending product updates — straight to your inbox.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
                                           focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-brand-primary text-white font-semibold text-sm rounded-xl
                                           hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
