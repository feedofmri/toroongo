import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList, ArrowUpDown } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import { useDelayedLoad } from '../../hooks/useDelayedLoad';
import { products, categories } from '../../data/mockData';

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
];

const PRICE_RANGES = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 – $50', min: 25, max: 50 },
    { label: '$50 – $100', min: 50, max: 100 },
    { label: '$100 – $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: Infinity },
];

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const categorySlug = searchParams.get('category');
    const saleOnly = searchParams.get('sale') === 'true';
    const query = searchParams.get('q') || '';

    const [sortBy, setSortBy] = useState('relevance');
    const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [gridCols, setGridCols] = useState(4);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Category filter
        if (selectedCategory) {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Sale filter
        if (saleOnly) {
            result = result.filter((p) => p.discount > 0);
        }

        // Search query filter
        if (query) {
            const q = query.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.seller.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
            );
        }

        // Price range filter
        if (selectedPrice !== null) {
            const range = PRICE_RANGES[selectedPrice];
            result = result.filter((p) => p.price >= range.min && p.price < range.max);
        }

        // Rating filter
        if (selectedRating) {
            result = result.filter((p) => p.rating >= selectedRating);
        }

        // Sort
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                result.sort((a, b) => b.id - a.id);
                break;
        }

        return result;
    }, [selectedCategory, saleOnly, query, selectedPrice, selectedRating, sortBy]);

    const { data: loadedProducts, isLoading } = useDelayedLoad(filteredProducts, 600);

    const activeCategory = categories.find((c) => c.slug === selectedCategory);

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedPrice(null);
        setSelectedRating(null);
    };

    const hasActiveFilters = selectedCategory || selectedPrice !== null || selectedRating;

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="bg-surface-bg border-b border-border-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                                {activeCategory ? activeCategory.name : saleOnly ? 'Sale' : query ? `Results for "${query}"` : 'All Products'}
                            </h1>
                            <p className="text-sm text-text-muted mt-1">
                                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sort dropdown */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-border-soft rounded-lg
                           text-text-primary cursor-pointer hover:border-gray-300 focus:border-brand-primary
                           focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            </div>

                            {/* Grid toggle (desktop) */}
                            <div className="hidden md:flex items-center border border-border-soft rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setGridCols(4)}
                                    className={`p-2 transition-colors ${gridCols === 4 ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
                                >
                                    <Grid3X3 size={16} />
                                </button>
                                <button
                                    onClick={() => setGridCols(3)}
                                    className={`p-2 transition-colors ${gridCols === 3 ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
                                >
                                    <LayoutList size={16} />
                                </button>
                            </div>

                            {/* Filter toggle (mobile) */}
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-border-soft
                         rounded-lg hover:border-gray-300 transition-colors"
                            >
                                <SlidersHorizontal size={16} />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* ── Sidebar Filters ──────────────────────────────── */}
                    <aside
                        className={`${filtersOpen ? 'fixed inset-0 z-50 bg-black/30 lg:relative lg:bg-transparent' : 'hidden lg:block'}
                       lg:w-56 flex-shrink-0`}
                    >
                        <div className={`${filtersOpen ? 'absolute right-0 top-0 h-full w-72 bg-white p-5 shadow-2xl overflow-y-auto lg:relative lg:w-auto lg:shadow-none lg:p-0' : ''}`}>
                            {/* Mobile close */}
                            {filtersOpen && (
                                <div className="flex items-center justify-between mb-4 lg:hidden">
                                    <h3 className="font-semibold text-text-primary">Filters</h3>
                                    <button onClick={() => setFiltersOpen(false)} className="p-1.5 hover:bg-surface-bg rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Active filters bar */}
                            {hasActiveFilters && (
                                <div className="mb-6">
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}

                            {/* Category filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-text-primary mb-3">Category</h4>
                                <div className="space-y-1.5">
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                      ${!selectedCategory ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                        ${selectedCategory === cat.slug ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                                        >
                                            {cat.icon} {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-text-primary mb-3">Price Range</h4>
                                <div className="space-y-1.5">
                                    {PRICE_RANGES.map((range, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedPrice(selectedPrice === idx ? null : idx)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                        ${selectedPrice === idx ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-text-primary mb-3">Minimum Rating</h4>
                                <div className="space-y-1.5">
                                    {[4, 3, 2].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setSelectedRating(selectedRating === r ? null : r)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2
                        ${selectedRating === r ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                                        >
                                            {r}+ stars & above
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── Product Grid ─────────────────────────────────── */}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : loadedProducts && loadedProducts.length > 0 ? (
                            <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                                {loadedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-lg font-medium text-text-primary mb-2">No products found</p>
                                <p className="text-text-muted text-sm mb-6">Try adjusting your filters or search terms.</p>
                                <button
                                    onClick={clearFilters}
                                    className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl
                           hover:bg-brand-secondary transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
