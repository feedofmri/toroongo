import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Package, SlidersHorizontal, Grid3X3, LayoutList } from 'lucide-react';
import { sellers } from '../../data/mockData';

import { useTranslation } from 'react-i18next';

const SORT_OPTIONS = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'products', label: 'Most Products' },
    { value: 'newest', label: 'Newest' },
    { value: 'name-asc', label: 'A – Z' },
];

export default function ShopsPage() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [viewMode, setViewMode] = useState('grid'); // grid | list

    const filteredSellers = useMemo(() => {
        let result = [...sellers];

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (s) => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
            );
        }

        // Sort
        switch (sortBy) {
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'products':
                result.sort((a, b) => b.totalProducts - a.totalProducts);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: // popular — by rating * products
                result.sort((a, b) => (b.rating * b.totalProducts) - (a.rating * a.totalProducts));
        }

        return result;
    }, [searchQuery, sortBy]);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="bg-surface-bg border-b border-border-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">{t('shops.title', 'Explore Shops')}</h1>
                    <p className="text-text-muted text-sm sm:text-base max-w-xl">
                        {t('shops.subtitle', 'Discover unique stores from independent sellers on Toroongo. Every shop is a curated experience.')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search shops by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-border-soft
                                       focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all
                                       placeholder:text-text-muted/60"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={14} className="text-text-muted" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border border-border-soft rounded-lg px-3 py-2 bg-white text-text-primary outline-none focus:border-brand-primary cursor-pointer"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* View toggle */}
                        <div className="hidden sm:flex items-center border border-border-soft rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                <Grid3X3 size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                <LayoutList size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-xs text-text-muted mb-5">
                    {filteredSellers.length} {filteredSellers.length === 1 ? 'shop' : 'shops'} found
                </p>

                {/* No results */}
                {filteredSellers.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-lg font-semibold text-text-primary mb-2">No shops found</p>
                        <p className="text-sm text-text-muted">Try a different search term.</p>
                    </div>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && filteredSellers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredSellers.map((seller) => (
                            <Link
                                key={seller.id}
                                to={`/${seller.slug}`}
                                className="group bg-white rounded-2xl border border-border-soft overflow-hidden
                                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-primary/20"
                            >
                                {/* Banner */}
                                <div className="relative h-28 overflow-hidden">
                                    <img
                                        src={seller.banner}
                                        alt={seller.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                {/* Info */}
                                <div className="relative px-4 pb-4">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border-[3px] border-white shadow-lg bg-white -mt-7 relative z-10">
                                        <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-semibold text-sm text-text-primary mt-2 group-hover:text-brand-primary transition-colors">
                                        {seller.name}
                                    </h3>
                                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2 leading-relaxed">{seller.description}</p>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-soft/50">
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="fill-amber-400 text-amber-400" />
                                            <span className="text-xs font-semibold text-text-primary">{seller.rating}</span>
                                        </div>
                                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                                            <Package size={11} /> {seller.totalProducts} products
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && filteredSellers.length > 0 && (
                    <div className="space-y-4">
                        {filteredSellers.map((seller) => (
                            <Link
                                key={seller.id}
                                to={`/${seller.slug}`}
                                className="group flex items-center gap-4 sm:gap-5 bg-white rounded-2xl border border-border-soft p-4
                                           transition-all duration-300 hover:shadow-lg hover:border-brand-primary/20"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-border-soft bg-white flex-shrink-0">
                                    <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">
                                        {seller.name}
                                    </h3>
                                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{seller.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Star size={11} className="fill-amber-400 text-amber-400" />
                                            <span className="text-xs font-semibold text-text-primary">{seller.rating}</span>
                                        </div>
                                        <span className="text-[11px] text-text-muted">{seller.totalProducts} products</span>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-xs font-medium text-brand-primary group-hover:translate-x-0.5 transition-transform">
                                    Visit →
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
