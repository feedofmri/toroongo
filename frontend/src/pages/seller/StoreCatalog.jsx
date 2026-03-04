import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
];

export default function StoreCatalog() {
    const { seller, sellerProducts } = useOutletContext();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('relevance');

    const filtered = useMemo(() => {
        let result = [...sellerProducts];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter((p) => p.title.toLowerCase().includes(q));
        }
        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
        }
        return result;
    }, [sellerProducts, search, sortBy]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h2 className="text-xl font-bold text-text-primary">
                    All Products <span className="text-text-muted font-normal text-base">({filtered.length})</span>
                </h2>
                <div className="flex gap-3">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-56">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-text-primary font-medium mb-1">No products found</p>
                    <p className="text-sm text-text-muted">Try a different search term.</p>
                </div>
            )}
        </div>
    );
}
