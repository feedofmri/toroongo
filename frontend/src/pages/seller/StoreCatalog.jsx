import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';

export default function StoreCatalog() {
    const { t } = useTranslation();
    const { sellerProducts } = useOutletContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    
    const [search, setSearch] = useState(queryParam);
    const [sortBy, setSortBy] = useState('relevance');

    // Sync search state with URL query
    useEffect(() => {
        setSearch(queryParam);
    }, [queryParam]);

    const handleSearchChange = (val) => {
        setSearch(val);
        // We update URL params to keep it synced
        if (val.trim()) {
            searchParams.set('q', val.trim());
        } else {
            searchParams.delete('q');
        }
        setSearchParams(searchParams, { replace: true });
    };

    const SORT_OPTIONS = [
        { value: 'relevance', label: t('storefront.catalog.sort.relevance') },
        { value: 'price-asc', label: t('storefront.catalog.sort.priceAsc') },
        { value: 'price-desc', label: t('storefront.catalog.sort.priceDesc') },
        { value: 'rating', label: t('storefront.catalog.sort.rating') },
    ];

    const filtered = useMemo(() => {
        let result = [...sellerProducts];
        if (search && search.trim()) {
            const q = search.toLowerCase().trim();
            result = result.filter((p) => {
                const title = (p.title || '').toLowerCase();
                const description = (p.description || '').toLowerCase();
                const metaDescription = (p.meta_description || p.metaDescription || '').toLowerCase();
                const category = (p.category || '').toLowerCase();
                const tags = Array.isArray(p.tags) ? p.tags : [];
                
                return title.includes(q) || 
                       description.includes(q) || 
                       metaDescription.includes(q) || 
                       category.includes(q) ||
                       tags.some(tag => tag && String(tag).toLowerCase().includes(q));
            });
        }
        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
        }
        return result;
    }, [sellerProducts, search, sortBy]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h2 className="text-xl font-bold text-text-primary">
                    {t("storefront.catalog.allProducts")} <span className="text-text-muted font-normal text-base">({filtered.length})</span>
                </h2>
                <div className="flex gap-3">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-56">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder={t("storefront.catalog.searchPlaceholder")}
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-border-soft rounded-lg
                       focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        />
                    </div>
                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-border-soft rounded-lg
                       cursor-pointer hover:border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-text-primary font-medium mb-1">{t("storefront.catalog.noProductsFound")}</p>
                    <p className="text-sm text-text-muted">{t("storefront.catalog.tryDifferentSearch")}</p>
                </div>
            )}
        </div>
    );
}
