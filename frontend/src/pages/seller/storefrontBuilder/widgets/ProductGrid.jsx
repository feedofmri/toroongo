import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../../../../components/product/ProductCard';

/**
 * ProductGrid Widget
 * Displays a grid of products with configurable columns, data source, and View All link.
 */
export default function ProductGrid({
    title,
    columns = 4,
    dataSource = 'featured',
    layoutStyle = 'grid',
    maxItems = 8,
    showViewAll = true,
    viewAllText = 'View All',
    viewAllLink = '/products',
    products = [],
}) {
    const colClass = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    }[columns] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

    // Filter/sort products by dataSource type
    let filtered = [...products];
    if (dataSource === 'bestsellers') {
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else if (dataSource === 'new') {
        const newOnes = filtered.filter((p) => p.badge === 'New' || p.badge === 'new');
        const rest = filtered.filter((p) => p.badge !== 'New' && p.badge !== 'new');
        filtered = [...new Map([...newOnes, ...rest].map((p) => [p.id, p])).values()];
    }

    const displayProducts = filtered.slice(0, maxItems);

    const gridClass =
        layoutStyle === 'masonry'
            ? `columns-${columns} gap-4 sm:gap-6 space-y-4 sm:space-y-6`
            : `grid ${colClass} gap-4 sm:gap-6`;

    const placeholders =
        displayProducts.length === 0
            ? Array.from({ length: maxItems }, (_, i) => ({
                  id: `placeholder_${i}`,
                  title: `Featured Product ${i + 1}`,
                  price: 19.99 + i * 10,
                  originalPrice: 29.99 + i * 15,
                  imageUrl: `https://placehold.co/300x300/f8fafc/64748b?text=Product+${i + 1}`,
                  rating: 4.5,
                  reviews: 12,
                  seller: 'Demo Store',
                  sellerId: 'demo-store',
                  badge: i === 0 ? 'New' : i === 1 ? 'Sale' : null,
              }))
            : [];

    const items = displayProducts.length > 0 ? displayProducts : placeholders;

    return (
        <div>
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <h2
                        className="text-xl sm:text-2xl font-bold"
                        style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                    >
                        {title}
                    </h2>
                    {showViewAll && (
                        <a
                            href={viewAllLink || '/products'}
                            className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                            style={{ color: 'var(--seller-brand, #008080)' }}
                        >
                            {viewAllText || 'View All'} <ArrowRight size={14} />
                        </a>
                    )}
                </div>
            )}

            <div className={gridClass}>
                {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
