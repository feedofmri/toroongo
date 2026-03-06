import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, Grid3X3, LayoutList, Star, Tag, Search as SearchIcon } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import { useDelayedLoad } from '../../hooks/useDelayedLoad';
import { categories, sellers } from '../../data/mockData';
import { useProduct } from '../../context/ProductContext';
import CategoryIcon from '../../components/ui/CategoryIcon';

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
    { label: '$200 – $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: Infinity },
];

const ITEMS_PER_PAGE = 12;

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categorySlug = searchParams.get('category');
    const saleOnly = searchParams.get('sale') === 'true';
    const query = searchParams.get('q') || '';

    const [searchInput, setSearchInput] = useState(query);
    const [sortBy, setSortBy] = useState('relevance');
    const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState('');
    const [onSaleOnly, setOnSaleOnly] = useState(saleOnly);
    const [customMinPrice, setCustomMinPrice] = useState('');
    const [customMaxPrice, setCustomMaxPrice] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [gridCols, setGridCols] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAllSellers, setShowAllSellers] = useState(false);

    const { products: allProducts } = useProduct();

    // Sync search input with URL query
    useEffect(() => {
        setSearchInput(query);
    }, [query]);

    const handlePageSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            const params = new URLSearchParams(searchParams);
            if (searchInput.trim()) {
                params.set('q', searchInput.trim());
            } else {
                params.delete('q');
            }
            navigate(`/search?${params.toString()}`);
            setCurrentPage(1);
        }
    };

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        // Category filter
        if (selectedCategory) {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Sale filter
        if (onSaleOnly) {
            result = result.filter((p) => p.discount > 0);
        }

        // Seller filter
        if (selectedSeller) {
            result = result.filter((p) => p.sellerId === selectedSeller);
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

        // Price range filter (preset or custom)
        if (customMinPrice || customMaxPrice) {
            const min = parseFloat(customMinPrice) || 0;
            const max = parseFloat(customMaxPrice) || Infinity;
            result = result.filter((p) => p.price >= min && p.price <= max);
        } else if (selectedPrice !== null) {
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
    }, [allProducts, selectedCategory, onSaleOnly, selectedSeller, query, selectedPrice, customMinPrice, customMaxPrice, selectedRating, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        return filteredProducts.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [filteredProducts, currentPage]);

    const { data: loadedProducts, isLoading } = useDelayedLoad(paginatedProducts, 400);

    const activeCategory = categories.find((c) => c.slug === selectedCategory);

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedPrice(null);
        setSelectedRating(null);
        setSelectedSeller('');
        setOnSaleOnly(false);
        setCustomMinPrice('');
        setCustomMaxPrice('');
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedCategory || selectedPrice !== null || selectedRating || selectedSeller || onSaleOnly || customMinPrice || customMaxPrice;

    // Reset page when filters change
    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="bg-surface-bg border-b border-border-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Mobile Search Bar */}
                    <div className="sm:hidden mb-6">
                        <div className="relative">
                            <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handlePageSearch}
                                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-white border border-border-soft
                                   focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none shadow-sm"
                            />
                            {searchInput && (
                                <button
                                    onClick={() => { setSearchInput(''); handlePageSearch({ type: 'click' }); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                                {activeCategory ? activeCategory.name : onSaleOnly ? 'Sale' : query ? `Results for "${query}"` : 'All Products'}
                            </h1>
                            <p className="text-sm text-text-muted mt-1">
                                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                                {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
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
                                {hasActiveFilters && <span className="w-2 h-2 bg-brand-primary rounded-full" />}
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
                       lg:w-60 flex-shrink-0`}
                    >
                        <div className={`${filtersOpen ? 'absolute right-0 top-0 h-full w-80 bg-white p-5 shadow-2xl overflow-y-auto lg:relative lg:w-auto lg:shadow-none lg:p-0' : ''}`}>
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
                                <div className="mb-6 p-3 bg-brand-primary/5 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-text-primary">Active Filters</span>
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedCategory && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white text-text-primary px-2 py-1 rounded-md border border-border-soft">
                                                {categories.find(c => c.slug === selectedCategory)?.name}
                                                <button onClick={() => handleFilterChange(setSelectedCategory)('')}>
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        )}
                                        {selectedSeller && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white text-text-primary px-2 py-1 rounded-md border border-border-soft">
                                                {sellers.find(s => `seller_${s.id}` === selectedSeller)?.name}
                                                <button onClick={() => handleFilterChange(setSelectedSeller)('')}>
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        )}
                                        {onSaleOnly && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white text-text-primary px-2 py-1 rounded-md border border-border-soft">
                                                On Sale
                                                <button onClick={() => handleFilterChange(setOnSaleOnly)(false)}>
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        )}
                                        {selectedRating && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white text-text-primary px-2 py-1 rounded-md border border-border-soft">
                                                {selectedRating}+ stars
                                                <button onClick={() => handleFilterChange(setSelectedRating)(null)}>
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Category filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-text-primary mb-3">Category</h4>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => handleFilterChange(setSelectedCategory)('')}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                      ${!selectedCategory ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => {
                                        const count = allProducts.filter(p => p.category === cat.slug).length;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleFilterChange(setSelectedCategory)(cat.slug)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2
                                    ${selectedCategory === cat.slug ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                                            >
                                                <CategoryIcon name={cat.icon} size={14} className="flex-shrink-0" />
                                                <span className="flex-1 text-xs">{cat.name}</span>
                                                <span className="text-[10px] text-text-muted">{count}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-text-primary mb-3">Price Range</h4>
                                <div className="space-y-1 mb-3">
                                    {PRICE_RANGES.map((range, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                handleFilterChange(setSelectedPrice)(selectedPrice === idx ? null : idx);
                                                setCustomMinPrice('');
                                                setCustomMaxPrice('');
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                                ${selectedPrice === idx ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-border-soft pt-3">
                                    <p className="text-[10px] text-text-muted mb-2 uppercase tracking-wider font-bold">Custom range</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={customMinPrice}
                                            onChange={(e) => {
                                                setCustomMinPrice(e.target.value);
                                                setSelectedPrice(null);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-border-soft rounded-lg
                                                       focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none"
                                        />
                                        <span className="text-text-muted text-xs">–</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={customMaxPrice}
                                            onChange={(e) => {
                                                setCustomMaxPrice(e.target.value);
                                                setSelectedPrice(null);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-border-soft rounded-lg
                                                       focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* On sale toggle */}
                            <div className="mb-6">
                                <button
                                    onClick={() => handleFilterChange(setOnSaleOnly)(!onSaleOnly)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                        ${onSaleOnly ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-surface-bg text-text-muted hover:text-text-primary border border-transparent'}`}
                                >
                                    <Tag size={14} className={onSaleOnly ? 'text-red-500' : ''} />
                                    <span>On Sale Only</span>
                                </button>
                            </div>

                            {/* Rating filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-text-primary mb-3">Minimum Rating</h4>
                                <div className="space-y-1">
                                    {[4, 3, 2].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => handleFilterChange(setSelectedRating)(selectedRating === r ? null : r)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2
                                ${selectedRating === r ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                                        >
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={11} className={i < r ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                            <span className="text-[11px] font-medium">& Up</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Seller filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-text-primary mb-4">Shop by Seller</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleFilterChange(setSelectedSeller)('')}
                                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors font-semibold uppercase tracking-wider
                                ${!selectedSeller ? 'bg-brand-primary/10 text-brand-primary' : 'bg-transparent text-text-muted hover:bg-surface-bg'}`}
                                    >
                                        All Shops
                                    </button>
                                    {sellers.slice(0, showAllSellers ? sellers.length : 6).map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleFilterChange(setSelectedSeller)(`seller_${s.id}`)}
                                            className={`w-full text-left px-2 py-2 rounded-xl border transition-all duration-200
                                ${selectedSeller === `seller_${s.id}`
                                                    ? 'bg-brand-primary/5 border-brand-primary/30 ring-1 ring-brand-primary/20'
                                                    : 'bg-white border-border-soft hover:border-gray-300'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-border-soft bg-white">
                                                    <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-[11px] font-bold truncate ${selectedSeller === `seller_${s.id}` ? 'text-brand-primary' : 'text-text-primary'}`}>
                                                        {s.name}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Star size={9} className="fill-amber-400 text-amber-400" />
                                                        <span className="text-[9px] text-text-muted font-medium">{s.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                    {sellers.length > 6 && (
                                        <button
                                            onClick={() => setShowAllSellers(!showAllSellers)}
                                            className="w-full py-2 text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                                        >
                                            {showAllSellers ? 'Show Less' : `Show All (${sellers.length})`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── Product Grid ─────────────────────────────────── */}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : loadedProducts && loadedProducts.length > 0 ? (
                            <>
                                <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                                    {loadedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                                                       hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        {getPageNumbers()[0] > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    className="w-9 h-9 rounded-lg text-sm font-medium text-text-muted hover:bg-surface-bg transition-colors"
                                                >
                                                    1
                                                </button>
                                                {getPageNumbers()[0] > 2 && (
                                                    <span className="text-text-muted text-sm px-1">…</span>
                                                )}
                                            </>
                                        )}

                                        {getPageNumbers().map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                                                    ${page === currentPage
                                                        ? 'bg-brand-primary text-white shadow-sm'
                                                        : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                                            <>
                                                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                                                    <span className="text-text-muted text-sm px-1">…</span>
                                                )}
                                                <button
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className="w-9 h-9 rounded-lg text-sm font-medium text-text-muted hover:bg-surface-bg transition-colors"
                                                >
                                                    {totalPages}
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-text-primary
                                                       hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
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
