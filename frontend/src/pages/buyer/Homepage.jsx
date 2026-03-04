import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import CategoryCard from '../../components/ui/CategoryCard';
import Skeleton from '../../components/ui/Skeleton';
import { useDelayedLoad } from '../../hooks/useDelayedLoad';
import { products, categories, heroBanners } from '../../data/mockData';

export default function Homepage() {
    const { data: loadedProducts, isLoading } = useDelayedLoad(products, 1000);
    const { data: loadedCategories, isLoading: categoriesLoading } = useDelayedLoad(categories, 600);
    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;
        const amount = 320;
        carouselRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    };

    const banner = heroBanners[0];

    return (
        <div className="animate-fade-in">
            {/* ═══════════════════════════════════════════════════════
          HERO BANNER
          ═══════════════════════════════════════════════════════ */}
            <section className="relative w-full h-[420px] sm:h-[480px] lg:h-[520px] overflow-hidden bg-slate-900">
                <img
                    src={banner.imageUrl}
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={16} className="text-brand-primary" />
                            <span className="text-brand-primary text-sm font-medium">New on Toroongo</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
                            {banner.heading}
                        </h1>
                        <p className="text-lg text-white/80 mb-8 leading-relaxed">
                            {banner.subheading}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to={banner.ctaLink}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold
                           rounded-xl hover:bg-brand-secondary transition-colors duration-200 shadow-lg shadow-brand-primary/25"
                            >
                                {banner.ctaText}
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/sell"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold
                           rounded-xl hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm border border-white/20"
                            >
                                Start Selling
                            </Link>
                        </div>
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
                            to="/search"
                            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                        >
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    {categoriesLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center p-6 bg-surface-bg rounded-2xl border border-border-soft">
                                    <Skeleton width="40px" height="40px" rounded="rounded-full" className="mb-3" />
                                    <Skeleton width="60%" height="0.75rem" rounded="rounded" className="mb-1.5" />
                                    <Skeleton width="40%" height="0.6rem" rounded="rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {loadedCategories.map((cat) => (
                                <CategoryCard key={cat.id} category={cat} />
                            ))}
                        </div>
                    )}
                </section>

                {/* ═══════════════════════════════════════════════════════
            TRENDING PRODUCTS
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
                                onClick={() => scrollCarousel('left')}
                                className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                           hover:border-gray-300 transition-colors"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scrollCarousel('right')}
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
            PROMO BANNER
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
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                                Featured Products
                            </h2>
                            <p className="text-text-muted text-sm mt-1">Hand-picked by our editors</p>
                        </div>
                        <Link
                            to="/search"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                        >
                            See All <ArrowRight size={14} />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {loadedProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
